import {UserActionsTypes} from 'store/types';

const initialState = {
  customers: {
    list: [],
    entry: {},
    isLoading: false
  },
  isLoading: false
};

const AdminCustomersReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case UserActionsTypes.GET_ADMIN_CUSTOMERS:
      return {
        ...state,
        customers: {
          ...state.customers,
          list: [...payload]
        },
      };
    case UserActionsTypes.GET_ADMIN_CUSTOMER:
      return {
        ...state,
        customers: {
          ...state.customers,
          entry: {...payload}
        }
      };
    case UserActionsTypes.LOADING_ADMIN_CUSTOMERS_DATA:
      return {
        ...state,
        customers: {
          ...state.customers,
          isLoading: payload,
        }
      };
    default:
      return state;
  }
};

export default AdminCustomersReducer;
