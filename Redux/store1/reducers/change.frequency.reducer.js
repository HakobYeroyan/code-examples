import { UserActionsTypes } from 'store/types';

const initialState = {
  step: '1',
  annualOrMonthly: {},
  scrapingSchedule : {
    list: [],
    selFrequency: {},
    timeOfDay: [],
    timeOfDaysIds: [],
    entry: {},
    isLoading: false,
  },
  premiumTimePrice: 0,
  totalCost: 0,
  payPrice: 0,
  toAddPrice: 0,
  saveCost: 0,
  premiumMultiplyPrice: 0,
  loadingCountingPay: false,
  isLoading: false,
  payLoading: false
};

const ChangeFrequencyReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case UserActionsTypes.LOADING_FREQ_DATA:
      return {
        ...state,
        isLoading: payload
      };
    case UserActionsTypes.PAY_FREQ_LOADING:
      return {
        ...state,
        payLoading: payload
      };
    case UserActionsTypes.CHANGE_STEP_FREQUENCY:
      return {
        ...state,
        step: payload
      };
    case UserActionsTypes.SET_PREMIUM_PRICE_FOR_TIME:
      return {
        ...state,
        premiumMultiplyPrice: payload
      };
    case UserActionsTypes.GET_FREQUENCIES:
      return {
        ...state,
        scrapingSchedule: {
          ...state.scrapingSchedule,
          list: [...payload]
        }
      };
    case UserActionsTypes.SELECT_ANNUAL_OR_MONTHLY:
      return {
        ...state,
        annualOrMonthly: payload
      };
    case UserActionsTypes.SET_TOTAL_PRICE:
      return {
        ...state,
        totalPrice: payload.totalCost,
        saveCost: payload.saveCost
      };
    case UserActionsTypes.SET_PAY_PRICE:
      return {
        ...state,
        payPrice: payload
      };
    case UserActionsTypes.SELECT_FREQUENCY:
      return {
        ...state,
        scrapingSchedule: {
          ...state.scrapingSchedule,
          selFrequency: {...payload}
        }
      };
    case UserActionsTypes.TIME_OF_DAYS:
      return {
        ...state,
        scrapingSchedule: {
          ...state.scrapingSchedule,
          timeOfDay: [...payload]
        }
      };
    case UserActionsTypes.GET_SCRAPING_SCHEDULE:
      return {
        ...state,
        scrapingSchedule: {
          ...state.scrapingSchedule,
          selFrequency: {...payload.selFrequency},
          timeOfDay: [...payload.timeOfDay],
          timeOfDaysIds: payload.timeOfDay.map(item => item._id)
        }
      };
    case UserActionsTypes.SET_PREMIUM_TIME_PRICE:
      return {
        ...state,
        premiumTimePrice: payload
      };
    case UserActionsTypes.SET_NEW_PRICE:
      return {
        ...state,
        newPrice: payload
      };
    case UserActionsTypes.GET_MARKETS:
      return {
        ...state,
        markets: {
          ...state.markets,
          list: [...payload]
        }
      };
    case UserActionsTypes.COUNTING_PAY_LOADING:
      return {
        ...state,
        loadingCountingPay: payload
      };
    default: return state;
  }
};

export default ChangeFrequencyReducer;
