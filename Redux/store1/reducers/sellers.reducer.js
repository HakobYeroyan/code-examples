import {UserActionsTypes} from 'store/types';

const initialState = {
  sellers: {
    list: [],
    entry: {},
    entrySellerInfo: null,
    entryNote: {},
    pagination: {
      limit: 10,
      skip: 0,
      allSellersCount: 0,
    },
    isLoading: false
  },
  isLoading: false
};

const SellersReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case UserActionsTypes.LOADING_SELLERS:
      return {
        ...state,
        sellers: {
          ...state.sellers,
          isLoading: payload
        }
      };
    case UserActionsTypes.GET_SELLERS:
      return {
        ...state,
        sellers: {
          ...state.sellers,
          list: [...payload]
        }
      };
    case UserActionsTypes.SELLERS_CURRENT_PAGE:
      return {
        ...state,
        sellers: {
          ...state.sellers,
          pagination: {
            skip: payload,
            limit: 10,
          },
        },
      };
    case UserActionsTypes.ALL_SELLERS_COUNT:
      return {
        ...state,
        sellers: {
          ...state.sellers,
          pagination: {
            ...state.sellers.pagination,
            allSellersCount: payload,
          },
        },
      };
    case UserActionsTypes.NEW_ENTRY_SELLER:
      return {
        ...state,
        sellers: {
          ...state.sellers,
          list: payload,
        },
      };
    case UserActionsTypes.REPORTED_SELLER:
      const newEntry = {
        ...state.sellers.entry,
        mapViolations: state.sellers.entry.mapViolations.map((item) => item._id === payload._id ? payload : item),
      };

      return {
        ...state,
        sellers: {
          ...state.sellers,
          list: state.sellers.list.map((item) => item._id === payload._id ? payload : item),
          entry: newEntry,
        },
      };
    case UserActionsTypes.SET_ENTRY_SELLER:
      return {
        ...state,
        sellers: {
          ...state.sellers,
          entry: payload
        }
      };
    case UserActionsTypes.SET_ENTRY_NOTE:
      return {
        ...state,
        sellers: {
          ...state.sellers,
          entryNote: payload
        }
      };
    case UserActionsTypes.UPDATE_ENTRY_NOTE:
      const oldEntry = state.sellers.entry;
      const newList = state.sellers.list.map((item) => item._id === payload.sellerId ? {...item, notes: payload.notes} : item);

      return {
        ...state,
        sellers: {
          ...state.sellers,
          list: newList,
          entry: {
            ...oldEntry,
            notes: payload.notes,
          },
        }
      };
    case UserActionsTypes.EMPTY_ENTRY_NOTE:
      return {
        ...state,
        sellers: {
          ...state.sellers,
          entryNote: {},
        }
      };
    case UserActionsTypes.SET_ENTRY_SELLER_INFO:
      return {
        ...state,
        sellers: {
          ...state.sellers,
          entrySellerInfo: payload
        }
      };
    case UserActionsTypes.GET_REPORT_SELLER:
      return {
        ...state,
        reportData: payload,
      };
    default: return state;
  }
};

export default SellersReducer;
