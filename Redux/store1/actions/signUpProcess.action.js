import {PAYMENT_TIME, SCRAPING_SCHEDULE_TIMES, STEPS_SIGN_IN_PROCESS} from 'utils/constant';
import {successToastify, errorToastify} from 'utils/notification';
import {authCookie} from 'utils/auth';

//services
import {SignUpProcessService} from 'services';

//actionTypes
import {UserActionsTypes} from 'store/types';

const percentPlus = 100 / Object.values(STEPS_SIGN_IN_PROCESS).length;

const InitializeSignUpProcess = () => async (dispatch) => {
  try {
    dispatch(signUpProcessPageLoadings(true));

    const {response} = await SignUpProcessService.initializeDataSignUpProcess();

    if (!response.status) {
      throw new Error(response.message);
    }

    const {frequency, scrapingSchedule, marketPlaces, selectedMarketplaces, personalInfo, premiumMultiplyPrice} = response;

    dispatch(getMarketplaces(marketPlaces));
    dispatch(selectedMarkets(selectedMarketplaces));
    dispatch(getScrapingFrequencyAndPremiumPrice({frequency, premiumMultiplyPrice}));

    if (scrapingSchedule) {
      dispatch(selectScheduleCard(scrapingSchedule.selFrequency));
      dispatch(selectedTimeOfDay(scrapingSchedule.timeOfDay));
    }

    dispatch(toCountTotalPrice(selectedMarketplaces, scrapingSchedule?.selFrequency, scrapingSchedule?.timeOfDay, premiumMultiplyPrice));
    dispatch(selectAnnualOrMonthly(PAYMENT_TIME[0]));
    dispatch(setPersonalInfoUser(personalInfo));

  } catch (e) {
    e.message && errorToastify(e.message);
  } finally {
    dispatch(signUpProcessPageLoadings(false));
  }
};

const selectMarketplace = (marketplaces) => async (dispatch, getState) => {
  try {
    const {signUpProcess: {premiumMultiplyPrice, selectedValues: {selectedMarketplaces, scrapingScheduleSelectedData: {timeOfDay, selFrequency}}}} = getState();

    //add from the beginning market, and filter by id
    selectedMarketplaces.unshift(marketplaces);

    const filteredMarketPlaceById = selectedMarketplaces.reduce((acc, current) => {
      const findMarket = acc.find(item => item._id === current._id);
      if (!findMarket) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    dispatch(selectedMarkets(filteredMarketPlaceById));
    dispatch(toCountTotalPrice(filteredMarketPlaceById, selFrequency, timeOfDay, premiumMultiplyPrice));
  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const selectedMarkets = (selectedMarketplaces) => {
  return {type: UserActionsTypes.SELECT_MARKETPLACES, payload: selectedMarketplaces};
};

const getMarketplaces = (marketplaces) => {
  return {
    type: UserActionsTypes.GET_MARKETPLACES, payload: [...marketplaces]
  };
};

const selectScheduleCard = (checkedFrequency) => async (dispatch, getState) => {
  try {
    const {frequency} = checkedFrequency;
    const {signUpProcess: {premiumMultiplyPrice, selectedValues: {selectedMarketplaces, scrapingScheduleSelectedData: {timeOfDay}}}} = getState();
    let times = [...timeOfDay];

    if (+frequency < times.length) {
      const length = times.length - frequency;

      for (let i = 0; i < length; i++) {
        times.pop();
      }

      dispatch(selectedTimeOfDay(times));
    }

    //when user clicks on 4x frequency,should by default select all timeOfDays
    if (frequency === 4) {
      times = [...SCRAPING_SCHEDULE_TIMES];
      dispatch(selectedTimeOfDay(times));
    }

    dispatch(toCountTotalPrice(selectedMarketplaces, checkedFrequency, times, premiumMultiplyPrice));
    dispatch({type: UserActionsTypes.ON_SELECT_SCRAPING_SCHEDULE, payload: {...checkedFrequency}});
  } catch (err) {
    errorToastify(err.message);
  }
};

const onSelectTimeLine = (time, checkOrUncheck) => async (dispatch, getState) => {
  try {
    const {signUpProcess: {selectedValues: {selectedMarketplaces,totalPrice, scrapingScheduleSelectedData: {timeOfDay, selFrequency}}, premiumMultiplyPrice}} = getState();
    const {frequency} = selFrequency;
    const times = [...timeOfDay];

    let updatedTimes = [];

    //checkOrUncheck - variable when checked or unchecked timeOfDays
    if (checkOrUncheck) {
      const length = times.length;
      if (+frequency <= length) {
        times.pop();
      }

      times.push(time);

      updatedTimes = times.reduce((acc, current) => {
        const findMarket = acc.find(item => item._id === current._id);

        if (!findMarket) {
          return acc.concat([current]);
        }

        return acc;
      }, []);

    } else {
      updatedTimes = times.filter((item) => item._id !== time._id);
    }

    dispatch(toCountTotalPrice(selectedMarketplaces, selFrequency, updatedTimes, premiumMultiplyPrice));
    dispatch(selectedTimeOfDay(updatedTimes));
  } catch (err) {
    errorToastify(err.message);
  }
};

const setPremiumPrice = (premiumPrice) => {
  return {
    type: UserActionsTypes.SET_PREMIUM_TIME_PRICE, payload: premiumPrice
  };
};

const getScrapingFrequencyAndPremiumPrice = (scheduleFrequencyAndPremium) => {
  return {
    type: UserActionsTypes.ON_SET_SCRAPING_SCHEDULE_FREQUENCY, payload: scheduleFrequencyAndPremium
  };
};

const selectedTimeOfDay = (times) => {
  return {type: UserActionsTypes.ON_SELECT_SCRAPING_TIME_OF_DAY, payload: [...times]};
};

const toCountTotalPrice = (checkedMarketplaces, scrapingSchedule, timeOfDaysScraping = null, premiumMultiplyPrice = null) => async (dispatch, getState) => {
  try {
    let totalPrice = checkedMarketplaces.reduce((acc, current) => {
      return acc + +current.price;
    }, 0);

    if (scrapingSchedule && scrapingSchedule.frequency) {
      totalPrice *= +scrapingSchedule.multiplyPrice;

      // premium time price
      if (timeOfDaysScraping && premiumMultiplyPrice) {
        const findPremiumTime = timeOfDaysScraping.some((time) => time.premium === true);

        if (findPremiumTime) {
          let premiumPrice = totalPrice;

          totalPrice *= +premiumMultiplyPrice;
          premiumPrice = (totalPrice - premiumPrice).toFixed(2);
          dispatch(setPremiumPrice(premiumPrice));
        }
      }
    }

    totalPrice = +totalPrice.toFixed(2);
    dispatch({type: UserActionsTypes.CHANGE_TOTAL_COST, payload: totalPrice});
  } catch (err) {
    errorToastify(err.message);
  }
};

const setPersonalInfoUser = (personalInfo) => {
  return {
    type: UserActionsTypes.ON_SET_PERSONAL_INFORMATION, payload: personalInfo
  };
};

const selectAnnualOrMonthly = (annualOrMonthly) => async (dispatch, getState) => {
  const {signUpProcess: {selectedValues: { totalPrice }}} = getState();
  const save = ((+totalPrice * 12) * (10 / 100)).toFixed(2);
  let payload = {annualOrMonthly: {...annualOrMonthly}, save};

  if (annualOrMonthly.interval === 'year') {
    payload.payPrice = ((+totalPrice * 12) - save).toFixed(2);
  } else if (annualOrMonthly.interval === 'month') {
    payload.payPrice = totalPrice.toFixed(2);
  }

  dispatch(changeReferralDiscountPrice(0));
  dispatch(changeCouponDiscountPrice(0));

  dispatch({type: UserActionsTypes.SELECT_ANNUAL_OR_MONTHLY, payload: payload});
};

const onSetPaymentMethod = (payload) => {
  return {
    type: UserActionsTypes.SET_PAYMENT_METHOD_ID, payload: payload
  };
};

const onResetMarketplace = (_id) => async (dispatch, getState) => {
  try {
    const {signUpProcess: {premiumMultiplyPrice, selectedValues: {totalPrice, payment: { annualOrMonthly }, selectedMarketplaces, scrapingScheduleSelectedData: {timeOfDay, selFrequency}}}} = getState();
    const timeOfDaysShallowCopy = [...timeOfDay];
    const selectedFrequencyShallowCopy = {...selFrequency};
    const selectedMarketplacesShallowCopy = [...selectedMarketplaces];
    const filterSelectedMarketplaces = selectedMarketplacesShallowCopy.filter((market) => _id !== market._id);
    const requestData = {
      resetScrapingSchedule: false,
      selectedMarketplaces: filterSelectedMarketplaces,
      annualOrMonthly: annualOrMonthly,
    };

    if (!filterSelectedMarketplaces.length) {
      dispatch({type: UserActionsTypes.ON_SELECT_SCRAPING_SCHEDULE, payload: {}});
      dispatch(selectedTimeOfDay([]));
      requestData.resetScrapingSchedule = true;
    }

    dispatch(selectedMarkets(filterSelectedMarketplaces));
    dispatch(toCountTotalPrice(filterSelectedMarketplaces, selFrequency, timeOfDay, premiumMultiplyPrice));
    requestData.totalCost = totalPrice;

    const {response} = await SignUpProcessService.priceBreakdown(requestData);

    const {payPrice} = response;

    dispatch(changePayPrice(payPrice));

    if (!response.status) {
      dispatch(selectedMarkets(selectedMarketplacesShallowCopy));
      dispatch({type: UserActionsTypes.ON_SELECT_SCRAPING_SCHEDULE, payload: selectedFrequencyShallowCopy});
      dispatch(selectedTimeOfDay(timeOfDaysShallowCopy));
      throw new Error(response.message);
    }

  } catch (err) {
    errorToastify(err.message);
  }
};

const onContinueStep = (redirect) => async (dispatch, getState) => {
  try {
    dispatch(signUpProcessPageLoadings(true));

    const {signUpProcess: {selectedValues: {selectedMarketplaces, scrapingScheduleSelectedData, totalPrice, personalInfo, payment}, activeStep}} = getState();

    let res = null;
    let selectedData = {activeStep};

    switch (activeStep) {
      case STEPS_SIGN_IN_PROCESS.MARKETPLACES:
        selectedData.selectedMarketplaces = selectedMarketplaces;
        selectedData.totalCost = totalPrice;
        res = await SignUpProcessService.onSaveMarketPlaces(selectedData);
        break;
      case STEPS_SIGN_IN_PROCESS.SCRAPING_SCHEDULE:
        selectedData.scrapingScheduleSelectedData = scrapingScheduleSelectedData;
        selectedData.totalCost = totalPrice;
        res = await SignUpProcessService.onSaveScrapingSchedule(selectedData);
        break;
      case STEPS_SIGN_IN_PROCESS.PERSONAL_INFORMATION:
        selectedData = {...selectedData, ...personalInfo, activeStep};
        res = await SignUpProcessService.onSavePersonalInformation(selectedData);
        dispatch(selectAnnualOrMonthly(PAYMENT_TIME[0]));
        break;
      case STEPS_SIGN_IN_PROCESS.PAYMENT:
        selectedData = {...selectedData, ...payment, totalPrice};
        res = await SignUpProcessService.payment(selectedData);
        break;
    }

    if (res) {
      const {response} = res;

      if (!response.status) {
        throw new Error(response.message);
      }

      const {activeStep, url} = response;

      if (response.token && +activeStep === +STEPS_SIGN_IN_PROCESS.PAYMENT) {
        const {token, user} = response;

        authCookie.setData('user', user);
        authCookie.setToken(token);

        dispatch({
          type: UserActionsTypes.LOGIN_SUCCESS, payload: {...user}
        });


        successToastify(response.message);

        return redirect(url);
      } else {
        redirect(url);
        dispatch(changeStep(activeStep));
      }
    }

  } catch (err) {
    errorToastify(err.message);
  } finally {
    dispatch(signUpProcessPageLoadings(false));
  }
};

const onBackStep = (activeStep, redirect) => async (dispatch) => {
  try {
    dispatch(signUpProcessPageLoadings(true));

    const {response} = await SignUpProcessService.onBackSignUpProcess({activeStep});

    if (!response.status) {
      throw new Error(response.message);
    }

    const {step} = response;

    dispatch(changeStep(step));

    redirect({
      pathname: '/sign-up-process',
      query: {step: activeStep}
    });

  } catch (err) {
    errorToastify(err.message);
  } finally {
    dispatch(signUpProcessPageLoadings(false));
  }
};

const discountReferralPayPrice = (data) => async (dispatch, getState) => {
  try {
    dispatch(signUpProcessPageLoadings(true));
    const { signUpProcess: { selectedValues: { payment: { annualOrMonthly } } } } = getState();

    const { response } = await SignUpProcessService.referralCodeDiscount(data);

    if (!response.status) {
      throw new Error(response.message);
    }

    const { payPrice, saving, success } = response;

    !success && errorToastify(response.message);

    dispatch(changeReferralDiscountPrice(saving));
    dispatch(changePayPrice(payPrice));

  } catch (e) {
    errorToastify(e.message);
    const { signUpProcess: { selectedValues: { codesDiscount: { referral }, payment: { payPrice } } } } = getState();

    dispatch(changePayPrice(((+payPrice) + (+referral)).toFixed(2)));
    dispatch(changeReferralDiscountPrice(0));
  } finally {
    dispatch(signUpProcessPageLoadings(false));
  }
};

const discountCouponPayPrice = (data) => async (dispatch, getState) => {
  try {
    dispatch(signUpProcessPageLoadings(true));
    const { signUpProcess: { selectedValues: { payment: { annualOrMonthly }, scrapingScheduleSelectedData: { selFrequency, timeOfDay } } } } = getState();
    const toSendData = {...data, annualOrMonthly};
    const { response } = await SignUpProcessService.couponCodeDiscount(toSendData);

    if (!response.status) {
      throw new Error(response.message);
    }
    const { payPrice, saving, success } = response;

    !success && errorToastify(response.message);

    dispatch(changeCouponDiscountPrice(saving));
    dispatch(changePayPrice(payPrice));

  } catch (e) {
    errorToastify(e.message);
    const { signUpProcess: { selectedValues: { codesDiscount: { coupon }, payment: { payPrice } } } } = getState();
    dispatch(changePayPrice(((+payPrice) + (+coupon)).toFixed(2)));
    dispatch(changeCouponDiscountPrice(0));
  } finally {
    dispatch(signUpProcessPageLoadings(false));
  }
};

const handleFreeTrail = (redirect) => async (dispatch, getState) => {
  try {
    const { signUpProcess: {activeStep, selectedValues: {totalPrice, payment: { annualOrMonthly, payPrice }} } } = getState();
    const toSendData = { activeStep, annualOrMonthly, totalPrice, payPrice };

    const { response } = await SignUpProcessService.continueWithFreeTrial(toSendData);

    if (!response.status) {
     throw new Error(response.message);
    }

    const {activeStep: activeStepResponse, url} = response;

    if (response.token && +activeStepResponse === +STEPS_SIGN_IN_PROCESS.PAYMENT) {
      const {token, user} = response;

      authCookie.setData('user', user);
      authCookie.setToken(token);

      dispatch({
        type: UserActionsTypes.LOGIN_SUCCESS, payload: {...user}
      });

      successToastify(response.message);

      redirect(url);
    } else {
      redirect(url);
      dispatch(changeStep(activeStepResponse));
    }

  } catch (e) {
    errorToastify(e.message);
  }
};

const signUpProcessPageLoadings = (boolean) => {
  return {
    type: UserActionsTypes.LOADING_DATA_SIGN_UP_PROCESS, payload: boolean
  };
};

const changeStep = (step) => {
  const percent = +step * (+percentPlus);

  return {
    type: UserActionsTypes.CHANGE_STEP, payload: {percent, step}
  };
};

const changePayPrice = (payPrice) => {
  return {
    type: UserActionsTypes.CHANGE_PAY_PRICE,
    payload: payPrice
  };
};
const changeReferralDiscountPrice = (price) => {
  return {
    type: UserActionsTypes.CHANGE_REFERRAL_CODE_DISCOUNT,
    payload: price
  };
};
const changeCouponDiscountPrice = (price) => {
  return {
    type: UserActionsTypes.CHANGE_COUPON_CODE_DISCOUNT,
    payload: price
  };
};

export const SignUpProcessActions = {
  InitializeSignUpProcess,
  onContinueStep,
  selectScheduleCard,
  onSelectTimeLine,
  setPersonalInfoUser,
  selectAnnualOrMonthly,
  onSetPaymentMethod,
  onResetMarketplace,
  onBackStep,
  selectMarketplace,
  changeStep,
  discountReferralPayPrice,
  discountCouponPayPrice,
  handleFreeTrail,
  signUpProcessPageLoadings,
};
