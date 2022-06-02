import {UserActionsTypes} from 'store/types';

const initialState = {
  activeStep: '1',
  percent: 0,
  marketPlaces: [],
  scrapingScheduleFrequency: [],
  premiumMultiplyPrice: 1,
  isLoading: false,
  selectedValues: {
    totalPrice: 0,
    premiumTimePrice: 0,
    selectedMarketplaces: [],
    codesDiscount: {
      referral: 0,
      coupon: 0
    },
    scrapingScheduleSelectedData: {
      selFrequency: {},
      timeOfDay: [],
    },
    personalInfo: {},
    payment: {
      annualOrMonthly: {},
      payment_methods: {},
      payPrice: 0,
      save: null
    }
  },
};

const signUpProcessReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case UserActionsTypes.SELECT_MARKETPLACES:
      return {
        ...state,
        selectedValues: {
          ...state.selectedValues,
          selectedMarketplaces: [...payload]
        }
      };
    case UserActionsTypes.GET_MARKETPLACES:
      return {
        ...state,
        marketPlaces: [...payload]
      };
    case UserActionsTypes.ON_SET_SCRAPING_SCHEDULE_FREQUENCY:
      return {
        ...state,
        scrapingScheduleFrequency: [...payload.frequency],
        premiumMultiplyPrice: payload.premiumMultiplyPrice
      };
    case UserActionsTypes.ON_SELECT_SCRAPING_SCHEDULE:
      return {
        ...state,
        selectedValues: {
          ...state.selectedValues,
          scrapingScheduleSelectedData: {
            ...state.selectedValues.scrapingScheduleSelectedData,
            selFrequency: {...payload},
          }
        }
      };
    case UserActionsTypes.ON_SELECT_SCRAPING_TIME_OF_DAY:
      return {
        ...state,
        selectedValues: {
          ...state.selectedValues,
          scrapingScheduleSelectedData: {
            ...state.selectedValues.scrapingScheduleSelectedData,
            timeOfDay: [...payload],
          }
        }
      };
    case UserActionsTypes.SET_PREMIUM_TIME_PRICE:
      return {
        ...state,
        selectedValues: {
          ...state.selectedValues,
          premiumTimePrice: payload
        }
      };
    case UserActionsTypes.SELECT_ANNUAL_OR_MONTHLY:
      return {
        ...state,
        selectedValues: {
          ...state.selectedValues,
          payment: {
            ...state.selectedValues.payment,
            annualOrMonthly: {...payload.annualOrMonthly},
            payPrice: payload.payPrice,
            save: payload.save
          }
        }
      };
    case UserActionsTypes.SET_PAYMENT_METHOD_ID:
      return {
        ...state,
        selectedValues: {
          ...state.selectedValues,
          payment: {
            ...state.selectedValues.payment,
            payment_methods: payload,
          }
        }
      };
    case UserActionsTypes.ON_SET_PERSONAL_INFORMATION:
      return {
        ...state,
        selectedValues: {
          ...state.selectedValues,
          personalInfo: {...payload},
        }
      };
    case UserActionsTypes.CHANGE_STEP:
      return {
        ...state,
        activeStep: payload.step,
        percent: payload.percent
      };
    case UserActionsTypes.CHANGE_TOTAL_COST:
      return {
        ...state,
        selectedValues: {
          ...state.selectedValues,
          totalPrice: payload
        }
      };
    case UserActionsTypes.LOADING_DATA_SIGN_UP_PROCESS:
      return {
        ...state,
        isLoading: payload
      };
    case UserActionsTypes.CHANGE_PAY_PRICE:
      return {
        ...state,
        selectedValues: {
          ...state.selectedValues,
          payment: {
            ...state.selectedValues.payment,
            payPrice: payload
          }
        }
      };
    case UserActionsTypes.CHANGE_REFERRAL_CODE_DISCOUNT:
      return {
        ...state,
        selectedValues: {
          ...state.selectedValues,
          codesDiscount: {
            ...state.selectedValues.codesDiscount,
            referral: payload
          },
          payment: {
            ...state.selectedValues.payment,
            savePrice: payload,
          }
        }
      };
    case UserActionsTypes.CHANGE_COUPON_CODE_DISCOUNT:
      return {
        ...state,
        selectedValues: {
          ...state.selectedValues,
          codesDiscount: {
            ...state.selectedValues.codesDiscount,
            coupon: payload
          },
          payment: {
            ...state.selectedValues.payment,
            savePrice: payload,
          }
        }
      };
    default:
      return state;
  }
};

export default signUpProcessReducer;
