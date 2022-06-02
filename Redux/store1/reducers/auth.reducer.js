import {UserActionsTypes} from 'store/types';
import {authCookie} from 'utils/auth';

let user = authCookie.getDataJson('user');
const initialState = {
  user: user ? {...user} : user,
  twoFactorToken: null,
  isLoading: false,
};

const AuthReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case UserActionsTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: {...payload}
      };
    case UserActionsTypes.REGISTER_REQUEST_OR_LOGIN:
      return {
        ...state,
        isLoading: payload
      };
    case UserActionsTypes.ACCOUNT_SETTINGS_CHANGE_FIELD:
      return {
        ...state,
        user: {
          ...state.user,
          ...payload
        }
      };
    case UserActionsTypes.SET_TWO_FACTOR_TOKEN: {
      return {
        ...state,
        twoFactorToken: payload
      };
    }
    default:
      return state;
  }
};

export default AuthReducer;
