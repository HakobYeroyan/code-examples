import {UserActionsTypes} from 'store/types';
import { successToastify, errorToastify } from 'utils/notification';
import {ChangeFrequencyService, ScrappingSettingsService} from 'services';
import {PAYMENT_TIME, SCRAPING_SCHEDULE_TIMES} from 'utils/constant';
import {generatePrice} from 'utils/helpers';


const GetInitialData = () => async (dispatch) => {
  try {
    dispatch(loadingFreqData(true));
    const {response} = await ScrappingSettingsService.getInitialData();

    if (!response.status) {
      throw new Error(response.message);
    }

    const {scrapingSchedule, planInterval, frequencies, premiumMultiplyPrice, totalCost, selectedMarkets} = response;
    const annualOrMonthly = PAYMENT_TIME.find(({interval}) => interval === planInterval);

    dispatch(getMarkets(selectedMarkets));
    dispatch(setTotalPrice({totalCost: 0, saveCost: null}));
    dispatch(getFrequencies(frequencies));
    dispatch(getScrapingSchedule(scrapingSchedule));
    dispatch(setPremiumPrice(premiumMultiplyPrice));
    dispatch(selectFrequency(scrapingSchedule.selFrequency));
    dispatch(selectAnnualOrMonthly(annualOrMonthly));

  } catch (err) {
    errorToastify(err.message);
  } finally {
    dispatch(loadingFreqData(false));
  }
};

const updateDailyFrequency = (redirect) => async (dispatch, getState) => {
  try {
    const { scrappingSettings: { scrapingSchedule: { timeOfDay, selFrequency } } } = getState();

    const toSendData = { scrapingSchedule: { selFrequency, timeOfDay } };
    const { response } = await ChangeFrequencyService.updateDailyFrequency(toSendData);

    if (!response.status) {
      throw new Error(response.message);
    }

    successToastify(response.message);
    redirect('dashboard/summary');

  } catch (e) {
    errorToastify(e.message);
  }
};


const onHandleBack = (redirect) => async (dispatch, getState) => {
  const { auth: { user: { subscriptionInterval: currentInterval } } } = getState();

  redirect({
    pathname: '/change-daily-frequency',
    query: {step: '1'}
  });

  const annualOrMonthly = PAYMENT_TIME.find(({ interval }) => currentInterval === interval);

  dispatch(selectAnnualOrMonthly(annualOrMonthly));
  dispatch(toCountPay());
  dispatch(addAdditionalPrice());
  dispatch(changeStep(1));
};

const selectAnnualOrMonthly = (annualOrMonthly) => async (dispatch, getState) => {
  await dispatch({type: UserActionsTypes.SELECT_ANNUAL_OR_MONTHLY, payload: annualOrMonthly});
  await dispatch(toCountPay());
  await dispatch(addAdditionalPrice());
};

const changeFrequencyContinueToPayment = (step, redirect) => async (dispatch, getState) => {
  try {
    const { changeFrequency: { scrapingSchedule: { timeOfDay, selFrequency } } } = getState();
    const { response } = await ChangeFrequencyService.checkDailyFrequency({ scrapingSchedule: {timeOfDay, selFrequency} });

    if (!response.status) {
      throw new Error(response.message);
    }

    let stepPage = Number(step);

    redirect({
      pathname: '/change-daily-frequency',
      query: {step: ++stepPage}
    });

    dispatch(changeStep(++stepPage));

  } catch (e) {
    errorToastify(e.message);
  }
};

const onClickTime = (time, checkOrUncheck) => async (dispatch, getState) => {
  const {changeFrequency: {scrapingSchedule: {timeOfDay, selFrequency: entrySelectedFreq}}} = getState();
  const {frequency} = entrySelectedFreq;
  let times = [...timeOfDay];

  //checkOrUncheck - variable when checked or unchecked timeOfDays
  if (!checkOrUncheck) {
    const length = times.length;
    if (+frequency <= length) {
      times.pop();
    }

    times.push(time);

  } else {
    times = times.filter((item) => item._id !== time._id);
  }

  await dispatch(selectTimeOfDays(times));
  await dispatch(toCountPay());
  await dispatch(addAdditionalPrice());
};

const onClickFrequency = (checkedFrequency) => async (dispatch, getState) => {
  const {changeFrequency: {scrapingSchedule: {timeOfDay}}} = getState();
  const {frequency} = checkedFrequency;
  const checkedTimesCount = timeOfDay.length;
  let checkedTimes = [...timeOfDay];

  if (frequency < checkedTimesCount) {
    const deletedCount = checkedTimesCount - frequency;
    checkedTimes = checkedTimes.slice(deletedCount, checkedTimesCount);
  }

  //when user clicks on 4x frequency,should by default select all timeOfDays
  if (frequency === 4) {
    checkedTimes = [...SCRAPING_SCHEDULE_TIMES];
  }
  await dispatch(selectTimeOfDays(checkedTimes));
  await dispatch(selectFrequency(checkedFrequency));
  await dispatch(toCountPay());
  await dispatch(addAdditionalPrice());
};

const addAdditionalPrice = () => async (dispatch, getState) => {
  try {
    const { changeFrequency: { payPrice } } = getState();

    await dispatch(setPayPrice(payPrice));
  } catch (e) {
    errorToastify(e.message);
  }
};

const toCountPay = () => async (dispatch, getState) => {
  await dispatch(loadingCountPay(true));
  const {changeFrequency: {annualOrMonthly, premiumMultiplyPrice, markets: {list}, scrapingSchedule: {selFrequency, timeOfDay}, totalCost: firstCost}} = getState();
  const allPrice = list.reduce((firstPrice, current) => firstPrice + +current.price, 0);

  const {multiplyPrice} = selFrequency;

  const findPremium = timeOfDay.some(({premium}) => premium);
  let totalPrice = allPrice * multiplyPrice;

  let {totalCost, saveCost} = generatePrice(allPrice, multiplyPrice, timeOfDay, annualOrMonthly.interval, premiumMultiplyPrice);

  if (findPremium) {
    let premiumPrice = totalPrice;
    totalPrice *= premiumMultiplyPrice;

    premiumPrice = (totalPrice - premiumPrice).toFixed(2);
    dispatch(setPremiumTimePrice(premiumPrice));
  }

  totalCost = totalCost.toFixed(2);

  await dispatch(setTotalPrice({totalCost: totalPrice.toFixed(2), saveCost: saveCost.toFixed(2)}));
  await dispatch(setNewPrice(totalCost));
  await dispatch(getAdditionalPrice());
  await dispatch(loadingCountPay(false));
};

const getAdditionalPrice = () => async (dispatch, getState) => {
  try {
    const {changeFrequency: {annualOrMonthly, scrapingSchedule}} = getState();
    const { response } = await ChangeFrequencyService.unUsedDailyFrequency({ annualOrMonthly, scrapingSchedule });

    if (!response.status) {
      throw new Error(response.message);
    }

    const { payPrice } = response;

    await dispatch(setPayPrice(payPrice));

  } catch (e) {
    errorToastify(e.message);
  }
};

const payDailyFrequency = (paymentData, redirect) => async (dispatch, getState) => {
  try {
    dispatch(payLoading(true));
    const {changeFrequency: { scrapingSchedule: { timeOfDay, selFrequency }, annualOrMonthly }, auth: { user }} = getState();

    const toSendData = {payment_methods: paymentData, annualOrMonthly, scrapingSchedule: { timeOfDay, selFrequency }};
    const { response } = await ChangeFrequencyService.paymentDailyFrequency(toSendData);

    if (!response.status) {
      throw new Error(response.message);
    }

    const { subscriptionInterval } = response;

    dispatch({type: UserActionsTypes.LOGIN_SUCCESS, payload: {...user, subscriptionInterval}});
    successToastify(response.message);
    redirect('dashboard/summary');

  } catch (e) {
    errorToastify(e.message);
  } finally {
    dispatch(payLoading(false));
  }
};

const getMarkets = (markets) => {
  return {
    type: UserActionsTypes.GET_MARKETS,
    payload: [...markets]
  };
};

const setNewPrice = (price) => {
  return {
    type: UserActionsTypes.SET_NEW_PRICE,
    payload: price,
  };
};

const setPremiumTimePrice = (price) => {
  return {
    type: UserActionsTypes.SET_PREMIUM_TIME_PRICE,
    payload: price
  };
};

const getScrapingSchedule = (scrapingSchedule) => {
  return {
    type: UserActionsTypes.GET_SCRAPING_SCHEDULE,
    payload: scrapingSchedule
  };
};

const setTotalPrice = (price) => {
  return {
    type: UserActionsTypes.SET_TOTAL_PRICE,
    payload: price
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

const selectTimeOfDays = (times) => {
  return {type: UserActionsTypes.TIME_OF_DAYS, payload: times};
};

const changeStep = (step) => {
  return {
    type: UserActionsTypes.CHANGE_STEP_FREQUENCY,
    payload: step
  };
};

const setPremiumPrice = (price) => {
  return {
    type: UserActionsTypes.SET_PREMIUM_PRICE_FOR_TIME,
    payload: price
  };
};

const setPayPrice = (price) => {
  return {
    type: UserActionsTypes.SET_PAY_PRICE,
    payload: price
  };
};

const payLoading = (loading) => {
  return {
    type: UserActionsTypes.PAY_FREQ_LOADING,
    payload: loading
  };
};

const loadingCountPay = (boolean) => {
  return {
    type: UserActionsTypes.COUNTING_PAY_LOADING,
    payload: boolean
  };
};

const loadingFreqData = (loading) => {
  return {
    type: UserActionsTypes.LOADING_FREQ_DATA,
    payload: loading
  };
};


export const ChangeFrequencyAction = {
  GetInitialData,
  updateDailyFrequency,
  changeFrequencyContinueToPayment,
  payDailyFrequency,
  selectAnnualOrMonthly,
  onHandleBack,
  onClickTime,
  onClickFrequency,
  changeStep,
  payLoading,
};
