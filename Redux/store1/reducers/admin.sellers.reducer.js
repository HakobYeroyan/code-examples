import { UserActionsTypes } from 'store/types';

const initialState = {
  sellers: {
    list: [],
    isLoading: false
  },
  isLoading: false
};

const AdminSellersReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case UserActionsTypes.GET_ADMIN_SELLERS:
      return {
        ...state,
        sellers: {
          ...state.sellers,
          list: payload,
        }
      };
    case UserActionsTypes.LOADING_ADMIN_SELLERS_DATA:
      return {
        ...state,
        sellers: {
          ...state.sellers,
          isLoading: payload,
        }
      };
    case UserActionsTypes.UPDATE_ADMIN_SELLERS:
      return {
        ...state,
        sellers: {
          ...state.sellers,
          list: state.sellers.list.map((seller) => seller._id === payload._id ? payload : seller),
        }
      };
    default:
      return state;
  }
};

export default AdminSellersReducer;
