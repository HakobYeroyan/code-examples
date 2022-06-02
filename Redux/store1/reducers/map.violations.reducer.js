import {UserActionsTypes} from 'store/types';
import {FILTER_OPTIONS} from 'utils/constant';
import {DateTime} from 'luxon';

const initialState = {
  products: {
    list: [],
    entry: {},
    entrySeller: {},
    pagination: {
      limit: 10,
      skip: 0,
      allMapCount: 0,
    },
    isLoading: false
  },
  filterOptions: {
    date: { ...FILTER_OPTIONS.list[0].options[0] },
    time: null
  },
  isLoading: false
};

const MapViolationsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case UserActionsTypes.GET_INITIAL_DATA_MAP_VIOLATION:
      return {
        ...state,
        products: {
          ...state.products,
          list: [...payload]
        }
      };
    case UserActionsTypes.GET_INITIAL_FILTER_OPTIONS:
      return {
        ...state,
        filterOptions: {
          ...state.filterOptions,
          date: payload.date.id === 'all' ? {...FILTER_OPTIONS.list[0].options[3]} : payload.date,
        }
      };
    case UserActionsTypes.MAP_CURRENT_PAGE:
      return {
        ...state,
        products: {
          ...state.products,
          pagination: {
            skip: payload,
            limit: 10,
          },
        },
      };
    case UserActionsTypes.ALL_MAP_COUNT:
      return {
        ...state,
        products: {
          ...state.products,
          pagination: {
            ...state.products.pagination,
            allMapCount: payload,
          },
        },
      };
    case UserActionsTypes.GET_SCRAPED_DATA_CHECKED:
      return {
        ...state,
        products: {
          ...state.products,
          entry: payload,
          list: state.products.list.map((item) => item._id === payload._id ? payload : item),
        },
      };
    case UserActionsTypes.SET_ENTRY_SELLER:
      return {
        ...state,
        products: {
          ...state.products,
          entrySeller: {...payload}
        }
      };
    case UserActionsTypes.SET_ENTRY_PRODUCT:
      return {
        ...state,
        products: {
          ...state.products,
          entry: {...payload}
        }
      };
    case UserActionsTypes.SET_ENTRY_CHANGED_MAP_PRODUCT:
      const updatedEntry = payload.find(elem => elem._id === state.products.entry._id);

      return {
        ...state,
        products: {
          ...state.products,
          list: payload,
          entry: updatedEntry,
        }
      };
    case UserActionsTypes.LOADING_PRODUCTS:
      return {
        ...state,
        isLoading: payload
      };
    case UserActionsTypes.NEW_ENTRY_VIOLATION:
      return {
        ...state,
        products: {
          ...state.products,
          list: payload,
        },
      };
    case UserActionsTypes.REPORTED_VIOLATION:
      const newEntry = {
        ...state.products.entry,
        scrapedData: state.products.entry.scrapedData.map((item) => item._id === payload._id ? payload : item),
      };

      return {
        ...state,
        products: {
          ...state.products,
          entry: newEntry,
          entrySeller: payload,
        },
      };
    case UserActionsTypes.SET_FILTER_DATE:
      return {
        ...state,
        filterOptions: {
          ...state.filterOptions,
          date: { ...payload }
        }
      };
    case UserActionsTypes.SET_FILTER_TIME:
      return {
        ...state,
        filterOptions: {
          ...state.filterOptions,
          time: payload ? { ...payload } : payload
        }
      };
    case UserActionsTypes.GET_REPORT_MAP:
      return {
        ...state,
        reportData: payload,
      };
    default: return state;
  }
};

export default MapViolationsReducer;
