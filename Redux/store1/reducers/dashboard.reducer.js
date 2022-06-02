import {UserActionsTypes} from 'store/types';

const initialState = {
  summary: {
    brandStrength: {
      list: [],
      isLoading: false
    },
    scrapingSettings: {
      list: [],
      frequency: {},
      isLoading: false
    },
    mapViolations: {
      list: [],
      entry: {},
      isLoading: false
    },
    isLoading: false
  },
  dailyReports: {
    listOfViolations: [],
    reportsStats: [],
    isLoading: false
  },
  isLoading: false
};

const DashboardReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case UserActionsTypes.GET_SCRAP_SETTINGS_DATA_FOR_DASHBOARD:
      return {
        ...state,
        summary: {
          ...state.summary,
          scrapingSettings:{
            ...state.summary.scrapingSettings,
            list: [...payload.scraps],
            frequency: {...payload.frequency}
          }
        }
      };
    case UserActionsTypes.GET_BRAND_STRENGTH_DATA_FOR_DASHBOARD:
      return {
        ...state,
        summary: {
          ...state.summary,
          brandStrength: {
            ...state.summary.brandStrength,
            list: [...payload],
          }
        }
      };
    case UserActionsTypes.LOADING_BRAND_STRENGTH_DATA_FOR_DASHBOARD:
      return {
        ...state,
        summary: {
          ...state.summary,
          brandStrength: {
            ...state.summary.brandStrength,
            isLoading: payload,
          }
        }
      };
    case UserActionsTypes.LOADING_SETTINGS_DATA_FOR_DASHBOARD:
      return {
        ...state,
        summary: {
          ...state.summary,
          scrapingSettings:{
            ...state.summary.scrapingSettings,
            isLoading: payload
          }
        }
      };
    case UserActionsTypes.GET_MAP_VIOLATION_DATA_FOR_DASHBOARD:
      return {
        ...state,
        summary: {
          ...state.summary,
          mapViolations:{
            ...state.summary.mapViolations,
            list: [...payload]
          }
        }
      };
    case UserActionsTypes.LOADING_MAP_VIOLATION_DATA_FOR_DASHBOARD:
      return {
        ...state,
        summary: {
          ...state.summary,
          mapViolations:{
            ...state.summary.mapViolations,
            isLoading: payload
          }
        }
      };
    case UserActionsTypes.GET_DAILY_REPORTS_MAP_VIOLATION_DATA_FOR_DASHBOARD:
      return {
        ...state,
        dailyReports: {
          ...state.dailyReports,
          listOfViolations: [...payload]
        }
      };
    case UserActionsTypes.LOADING_DAILY_REPORTS_MAP_VIOLATION_DATA_FOR_DASHBOARD:
      return {
        ...state,
        dailyReports: {
          ...state.dailyReports,
          isLoading: payload
        }
      };
    case UserActionsTypes.GET_STATS_DASHBOARD:
      return {
        ...state,
        dailyReports: {
          ...state.dailyReports,
          reportsStats: [...payload]
        }
      };
    default:
      return state;
  }
};

export default DashboardReducer;
