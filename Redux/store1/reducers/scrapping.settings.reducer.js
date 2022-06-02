import {UserActionsTypes} from 'store/types';

const initialState = {
  step: 1,
  annualOrMonthly: {},
  markets: {
    list: [],
    selectedMarketplaces: [],
    currentMarketPlaces: [],
    entry: {},
    isLoading: false
  },
  scrapingSchedule : {
    list: [],
    selFrequency: {},
    timeOfDay: [],
    entry: {},
    isLoading: false,
  },
  payPrice: 0,
  totalPrice: 0,
  totalCost: 0,
  toAddPrice: 0,
  saveCost: null,
  premiumMultiplyPrice: 0,
  loadingCountingPay: false,
  isLoading: false
};

const ScrappingSettingsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case UserActionsTypes.PAY_LOADING:
      return {
        ...state,
        isLoading: payload
      };
    case UserActionsTypes.GET_MARKETS:
      return {
        ...state,
        markets: {
          ...state.markets,
          list: [...payload]
        }
      };
    case UserActionsTypes.GET_SELECTED_MARKETS:
      return {
        ...state,
        markets: {
          ...state.markets,
          selectedMarketplaces: [...payload]
        }
      };
    case UserActionsTypes.GET_FREQUENCIES:
      return {
        ...state,
        scrapingSchedule: {
          ...state.scrapingSchedule,
          list: [...payload]
        }
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
    case UserActionsTypes.SET_PREMIUM_PRICE_FOR_TIME:
      return {
        ...state,
        premiumMultiplyPrice: payload
      };
    case UserActionsTypes.ON_SELECT_MARKETS:
      return {
        ...state,
        markets: {
          ...state.markets,
          entry: {...payload}
        }
      };
    case UserActionsTypes.LOADING_ADD_NEW_MARKET:
      return {
        ...state,
        markets: {
          ...state.markets,
          isLoading: payload
        }
      };
    case UserActionsTypes.SET_TOTAL_PRICE:
      return {
        ...state,
        totalPrice: payload.totalCost,
        saveCost: payload.saveCost
      };
    case UserActionsTypes.GET_SCRAPING_SCHEDULE:
      return {
        ...state,
        scrapingSchedule: {
          ...state.scrapingSchedule,
          selFrequency: {...payload.selFrequency},
          timeOfDay: [...payload.timeOfDay]
        }
      };
    case UserActionsTypes.CHANGE_STEP_ADD_NEW_MARKET:
      return {
        ...state,
        step: payload
      };
    case UserActionsTypes.SELECT_ANNUAL_OR_MONTHLY:
      return {
        ...state,
        annualOrMonthly: payload
      };
    case UserActionsTypes.SET_PAY_PRICE:
      return {
        ...state,
        payPrice: payload
      };
    case UserActionsTypes.SET_PREMIUM_TIME_PRICE:
      return {
        ...state,
        premiumTimePrice: payload
      };
    case UserActionsTypes.SET_CURRENT_MARKETPLACES:
      return {
        ...state,
        markets: {
          ...state.markets,
          currentMarketPlaces: [...payload]
        }
      };
    case UserActionsTypes.COUNTING_PAY_LOADING:
      return {
        ...state,
        loadingCountingPay: payload
      };
    default:
      return state;
  }
};

export default ScrappingSettingsReducer;

