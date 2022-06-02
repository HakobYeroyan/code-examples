import {UserActionsTypes} from 'store/types';

const initialState = {
  coupons: {
    list: [],
    entry: {},
    isLoading: false
  },
  isLoading: false
};

const AdminCouponsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case UserActionsTypes.GET_COUPONS:
      return {
        ...state,
        coupons: {
          ...state.coupons,
          list: [...payload]
        }
      };
    case UserActionsTypes.LOADING_COUPONS:
      return {
        ...state,
        coupons: {
          ...state.coupons,
          isLoading: payload
        }
      };
    case UserActionsTypes.EDIT_ADMIN_COUPONS_DATA:
      return {
        ...state,
        coupons: {
          ...state.coupons,
          entry: {...payload}
        }
      };
    default : return state;
  }
};

export default AdminCouponsReducer;
