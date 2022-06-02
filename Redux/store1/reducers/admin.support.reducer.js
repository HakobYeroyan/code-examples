import {UserActionsTypes} from 'store/types';

const initialState = {
  support: {
    list: [],
    unSeenSupportsCount: 0,
    entry: {},
    isLoading: false
  },
  isLoading: false
};

const AdminSupportReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case UserActionsTypes.GET_ADMIN_SUPPORTS:
      return {
        ...state,
        support: {
          ...state.support,
          list: [...payload]
        },
      };
    case UserActionsTypes.GET_UNSEEN_SUPPORTS_COUNT:
      return {
        ...state,
        support: {
          ...state.support,
          unSeenSupportsCount: payload
        }
      };
    default:
      return state;
  }
};

export default AdminSupportReducer;
