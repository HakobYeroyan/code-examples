import {UserActionsTypes} from 'store/types';

const initialState = {
  retailers: {
    list: [],
    entry: {},
    isLoading: false
  },
  frequencyMultiple: {
    multiples: {
      single: 0,
      double: 0,
      triple: 0,
      quadruple: 0
    },
    premiumMultiplyPrice: 0
  },
  locationPaths: [],
  isLoading: false
};

const AdminRetailersReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case UserActionsTypes.GET_ADMIN_RETAILERS:
      return {
        ...state,
        retailers: {
          ...state.retailers,
          list: [...payload]
        }
      };
    case UserActionsTypes.LOADING_ADMIN_RETAILERS_DATA:
      return {
        ...state,
        retailers: {
          ...state.retailers,
          isLoading: payload
        }
      };
    case UserActionsTypes.EDIT_ADMIN_RETAILERS_DATA:
      return {
        ...state,
        retailers: {
          ...state.retailers,
          entry: {...payload}
        }
      };
    case UserActionsTypes.SET_FREQUENCY_MULTIPLE:
      return {
        ...state,
        frequencyMultiple: {...payload}
      };
    case UserActionsTypes.SET_RETAILER_LOCATION_PATHS:
      return {
        ...state,
        locationPaths: [...payload]
      };
    case UserActionsTypes.SET_EMPTY_RETAILER:
      return {
        ...state,
        retailers: {
          ...state.retailers,
          entry: payload,
        }
      };
    default:
      return state;
  }
};

export default AdminRetailersReducer;
