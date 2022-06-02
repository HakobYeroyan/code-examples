import {UserActionsTypes} from 'store/types';

const initialState = {
  supports: {
    list: [],
    unSeenSupportsCount: 0,
    entry: [],
    isLoading: false,
  },
  locationPaths: [],
  filterRequestKey: null,
  isLoading: false
};

const SellersReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case UserActionsTypes.LOADING_SUPPORTS:
      return {
        ...state,
        supports: {
          ...state.supports,
          isLoading: payload
        }
      };
    case UserActionsTypes.SET_SUPPORTS:
      return {
        ...state,
        supports: {
          ...state.supports,
          list: [...payload]
        }
      };
    case UserActionsTypes.SET_FILTER_REQUEST_KEY:
      return {
        ...state,
        filterRequestKey: payload
      };
    case UserActionsTypes.SET_LOCATION_PATHS:
      return {
        ...state,
        locationPaths: [...payload]
      };
    case UserActionsTypes.GET_USER_SUPPORTS:
      return {
        ...state,
        support: {
          ...state.support,
          list: [...payload]
        },
      };
    case UserActionsTypes.GET_UNSEEN_SUPPORT_COUNT:
      return {
        ...state,
        supports: {
          ...state.supports,
          unSeenSupportsCount: payload,
        }
      };
    default: return state;
  }
};

export default SellersReducer;
