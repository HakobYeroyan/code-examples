import {ScrappingSettingsService} from 'services';
import {UserActionsTypes} from 'store/types';
import {errorToastify, successToastify} from 'utils/notification';
import {PAYMENT_TIME} from 'utils/constant';
import {generatePrice} from 'utils/helpers';

const InitialScrapingSettingsData = () => async (dispatch) => {
  try {
    dispatch(loadingMarkets(true));
    const {response} = await ScrappingSettingsService.getInitialData();

    if (!response.status) {
      throw new Error(response.message);
    }

    const {marketPlaces, selectedMarkets, scrapingSchedule, planInterval, frequencies, premiumMultiplyPrice} = response;
    const annualOrMonthly = PAYMENT_TIME.find(({interval}) => interval === planInterval);

    dispatch(getMarkets(marketPlaces));
    dispatch(getSelectedMarkets([]));
    dispatch(setCurrentMarketPlaces(selectedMarkets));
    dispatch(setTotalPrice({totalCost: 0, saveCost: null}));
    dispatch(getFrequencies(frequencies));
    dispatch(getScrapingSchedule(scrapingSchedule));
    dispatch(setPremiumPrice(premiumMultiplyPrice));
    dispatch(selectFrequency(scrapingSchedule.selFrequency));
    dispatch(selectAnnualOrMonthly(annualOrMonthly));

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loadingMarkets(false));
  }
};



const AddNewMarketPlaceContinueToPayment = (step, redirect, router) => async (dispatch) => {
  try {
    let stepPage = Number(step);

    redirect({
      pathname: '/products/add-new-market',
      query: {step: ++stepPage, mode: router.query.mode}
    });

    dispatch(changeStep(++stepPage));

  } catch (err) {
    err.message && errorToastify(err.message);
  }
};

const AddNewMarketPlaceUpdate = (redirect) => async (dispatch, getState) => {
  try {
    const { scrappingSettings: { annualOrMonthly, markets: { selectedMarketplaces } } } = getState();

    const toSendData = {
      selectedMarketplaces,
      annualOrMonthly,
    };
    const { response } = await ScrappingSettingsService.updateMarketPlace(toSendData);

    if (!response.status) {
      throw new Error(response.message);
    }

    redirect({
      pathname: '/dashboard/summary',
    });

    successToastify(response.message);

  } catch (err) {
    err.message && errorToastify(err.message);
  }
};

const addAdditionalPrice = () => async (dispatch, getState) => {
  try {
    const { scrappingSettings: { payPrice } } = getState();

    await dispatch(setPayPrice(payPrice));
  } catch (err) {
    err.message && errorToastify(err.message);
  }
};

const getAdditionalPrice = () => async (dispatch, getState) => {
  try {
    const { scrappingSettings: { markets: { selectedMarketplaces }, annualOrMonthly } } = getState();
    const { response } = await ScrappingSettingsService.getAdditionalPrice({ annualOrMonthly, selectedMarketplaces });

    if (!response.status) {
      throw new Error(response.message);
    }

    const { payPrice } = response;
    await dispatch(setPayPrice(payPrice));

  } catch (err) {
    err.message && errorToastify(err.message);
  }
};

const loadingCountPay = (boolean) => {
  return {
    type: UserActionsTypes.COUNTING_PAY_LOADING,
    payload: boolean
  };
};

const getFrequencies = (frequencies) => {
  return {
    type: UserActionsTypes.GET_FREQUENCIES,
    payload: frequencies
  };
};

const selectFrequency = (frequency) => {
  return {
    type: UserActionsTypes.SELECT_FREQUENCY,
    payload: frequency
  };
};


const selectAnnualOrMonthly = (annualOrMonthly) => async (dispatch) => {
  await dispatch({type: UserActionsTypes.SELECT_ANNUAL_OR_MONTHLY, payload: annualOrMonthly});
  await dispatch(toCountPay());
  await dispatch(addAdditionalPrice());
};

const onSelectMarket = (market) => async (dispatch, getState) => {
  const {scrappingSettings: {markets: {selectedMarketplaces}}} = getState();

  //add from the beginning market, and filter by id
  selectedMarketplaces.unshift(market);

  const filteredMarketPlaceById = selectedMarketplaces.reduce((acc, current) => {
    const findMarket = acc.find(item => item._id === current._id);
    if (!findMarket) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  await dispatch(getSelectedMarkets(filteredMarketPlaceById));
  await dispatch(toCountPay());
  await dispatch(addAdditionalPrice());
};

const toCountPay = () => async (dispatch, getState) => {
  await dispatch(loadingCountPay(true));
  const {scrappingSettings: {annualOrMonthly, premiumMultiplyPrice, markets: {selectedMarketplaces, currentMarketPlaces}, scrapingSchedule: {selFrequency, timeOfDay}}} = getState();
  const allMarkets = selectedMarketplaces.length !== 0 ? [...currentMarketPlaces, ...selectedMarketplaces] : [...selectedMarketplaces];

  const price = allMarkets.reduce((acc, current) => {
    return acc + +current.price;
  }, 0);

  const {multiplyPrice} = selFrequency;

  const findPremium = timeOfDay.some(({premium}) => premium);
  let totalPrice = price * multiplyPrice;

  let {totalCost, saveCost} = generatePrice(price, multiplyPrice, timeOfDay, annualOrMonthly.interval, premiumMultiplyPrice);

  if (findPremium) {
    let premiumPrice = totalPrice;
    totalPrice *= premiumMultiplyPrice ;

    premiumPrice = (totalPrice - premiumPrice).toFixed(2);
    dispatch(setPremiumTimePrice(premiumPrice));
  }

  totalCost = totalCost.toFixed(2);

  await dispatch(setTotalPrice({totalCost: totalPrice.toFixed(2), saveCost: saveCost.toFixed(2)}));
  await dispatch(getAdditionalPrice());
  await dispatch(loadingCountPay(false));
};

const setCurrentMarketPlaces = (markets) => {
  return {
    type: UserActionsTypes.SET_CURRENT_MARKETPLACES,
    payload: [...markets]
  };
};

const setPremiumTimePrice = (price) => {
  return {
    type: UserActionsTypes.SET_PREMIUM_TIME_PRICE,
    payload: price
  };
};

const setPayPrice = (price) => {
  return {
    type: UserActionsTypes.SET_PAY_PRICE,
    payload: price
  };
};


const payAddMarkets = (paymentData, redirect) => async (dispatch, getState) => {
  try {
    dispatch(payLoading(true));
    const {scrappingSettings: { annualOrMonthly, markets: { selectedMarketplaces } }, auth: { user }} = getState();

    const updateScrapingSettings = {
      payment_methods: paymentData,
      annualOrMonthly,
      selectedMarketplaces,
    };
    const {response} = await ScrappingSettingsService.payAddMarketPrice(updateScrapingSettings);

    if (!response.status) {
      throw new Error(response.message);
    }

    const { subscriptionInterval } = response;

    dispatch({type: UserActionsTypes.LOGIN_SUCCESS, payload: {...user, subscriptionInterval}});

    successToastify(response.message);
    redirect('/products/new');

  } catch (err) {
    errorToastify(err.message);
  } finally {
    dispatch(payLoading(false));
  }
};


const onHandleBackAddMarket = (redirect, router) => async (dispatch, getState) => {
  try {
    const { auth: { user: { subscriptionInterval: currentInterval } } } = getState();
    const annualOrMonthly = PAYMENT_TIME.find(({ interval }) => currentInterval === interval);

    dispatch(selectAnnualOrMonthly(annualOrMonthly));
    dispatch(toCountPay());
    dispatch(addAdditionalPrice());

    redirect({
      pathname: '/products/add-new-market',
      query: {step: 1, mode: router.query.mode}
    });

    dispatch(changeStep(1));
  } catch (e) {
    errorToastify(e.message);
  }
};

const onResetMarketplace = (_id) => async (dispatch, getState) => {
  const {scrappingSettings: {markets: {selectedMarketplaces}}} = getState();
  const filterResetData = selectedMarketplaces.filter((market) => market._id !== _id);

  dispatch(getSelectedMarkets(filterResetData));
  dispatch(toCountPay());
};

const setTotalPrice = (price) => {
  return {
    type: UserActionsTypes.SET_TOTAL_PRICE,
    payload: price
  };
};

const changeStep = (step) => {
  return {
    type: UserActionsTypes.CHANGE_STEP_ADD_NEW_MARKET,
    payload: step
  };
};

const setPremiumPrice = (price) => {
  return {
    type: UserActionsTypes.SET_PREMIUM_PRICE_FOR_TIME,
    payload: price
  };
};

const onHandelOpenMarket = (entry) => {
  return {
    type: UserActionsTypes.ON_SELECT_MARKETS,
    payload: entry
  };
};


const getMarkets = (markets) => {
  return {
    type: UserActionsTypes.GET_MARKETS,
    payload: [...markets]
  };
};

const getScrapingSchedule = (scrapingSchedule) => {
  return {
    type: UserActionsTypes.GET_SCRAPING_SCHEDULE,
    payload: scrapingSchedule
  };
};

const getSelectedMarkets = (selectedMarkets) => {
  return {
    type: UserActionsTypes.GET_SELECTED_MARKETS,
    payload: [...selectedMarkets]
  };
};

const loadingMarkets = (boolean) => {
  return {
    type: UserActionsTypes.LOADING_ADD_NEW_MARKET,
    payload: boolean
  };
};

const payLoading = (boolean) => {
  return {
    type: UserActionsTypes.PAY_LOADING, payload: boolean
  };
};

export const ScrappingSettingsActions = {
  InitialScrapingSettingsData,
  selectFrequency,
  onHandelOpenMarket,
  onSelectMarket,
  onResetMarketplace,
  changeStep,
  selectAnnualOrMonthly,
  payAddMarkets,
  onHandleBackAddMarket,
  AddNewMarketPlaceUpdate,
  AddNewMarketPlaceContinueToPayment,
  payLoading,
};
