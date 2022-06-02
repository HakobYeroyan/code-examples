import {successToastify, errorToastify, warningToastify} from 'utils/notification';
import {loginProcessGeneratePath} from 'utils/helpers';
import {authCookie} from 'utils/auth';
import {ROLE_TYPES} from 'utils/constant';

//Services
import {AuthService} from 'services';

//actionTypes
import {UserActionsTypes} from 'store/types';
import {DateTime} from 'luxon';

const signUp = (dataForm, redirect) => async dispatch => {
  try {
    dispatch(requestSignInOrSignUp(true));
    const {response} = await AuthService.signUp(dataForm);

    if (!response.status) {
      throw new Error(response.message);
    }

    successToastify(response.message);

    redirect({
      pathname: '/sign-in',
      query: !response.alreadyExist ? {email: dataForm.email} : {}
    });
  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(requestSignInOrSignUp(false));
  }
};

const signIn = (dataForm, redirect) => async dispatch => {
  try {
    dispatch(requestSignInOrSignUp(true));
    const {response} = await AuthService.signIn(dataForm);

    if (!response.status) {
      throw new Error(response.message);
    }

    const timeValues = response.user?.roleType === ROLE_TYPES.USER && response.user.scrapingSchedule.timeOfDay.sort((a, b) => a._id - b._id).map(item => item.value);
    const diff = timeValues && DateTime.now().diff(DateTime.fromISO(timeValues[0], {zone: 'America/Los_Angeles'}), ['hours', 'minutes']).toObject();

    if (response.user && response.pathname) {
      const {token, user, expiresIn} = response;

      authCookie.setData('user', user, expiresIn);
      authCookie.setToken(token,expiresIn);
      dispatch(loginSuccess(user));

      await redirect(response.pathname);

      if((diff?.hours < 0 || diff?.minutes < 0) && response.user?.productAvailability) {
        warningToastify('Data is currently being refreshed for Today.');
      }

      return;
    }

    if (response.twoFactor && !response.user) {
      const { twoFactorToken } = response;
      dispatch(setUserTwoFactorToken(twoFactorToken));

      successToastify(response.message);

      redirect('/confirm-two-factor-auth');
      return;
    }

    if (!response.twoFactor && response.user) {
      const {token, user, signUpProcess, expiresIn} = response;

      const path = loginProcessGeneratePath(user, signUpProcess);

      authCookie.setData('user', user, expiresIn);
      authCookie.setToken(token,expiresIn);
      dispatch(loginSuccess(user));

      await redirect({
        pathname: path,
        query: user.activeStep ? {step: user.activeStep} : {}
      });

      if((diff?.hours < 0 || diff?.minutes < 0) && response.user?.productAvailability) {
        warningToastify('Data is currently being refreshed for Today.');
      }
    }
  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(requestSignInOrSignUp(false));
  }
};

const loginSuccess = (user) => {
  return {
    type: UserActionsTypes.LOGIN_SUCCESS, payload: {...user}
  };
};

const forgotPasswordSendEmail = (email, redirect) => async dispatch => {
  try {
    dispatch(requestSignInOrSignUp(true));

    const {response} = await AuthService.sendForgotPasswordEmail(email);

    if (!response.status) {
      throw new Error(response.message);
    }

    redirect('/sign-in');

    successToastify(response.message);
  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(requestSignInOrSignUp(false));
  }
};

const changePassword = (data, redirect) => async dispatch => {
  try {
    dispatch(requestSignInOrSignUp(true));

    const {response} = await AuthService.changePassword(data);

    if (!response.status) {
      throw new Error(response.message);
    }

    redirect('/sign-in');

    successToastify(response.message);
  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(requestSignInOrSignUp(false));
  }
};

const checkTokenConfirmPass = (token, redirect) => async dispatch => {
  try {
    dispatch(requestSignInOrSignUp(true));

    const {response} = await AuthService.checkTokenConfirmPassword({token});

    if (!response.status) {
      throw new Error(response.message);
    }

    successToastify(response.message);
  } catch (err) {
    redirect('/forgot-password');
    err.message && errorToastify(err.message);
  } finally {
    dispatch(requestSignInOrSignUp(false));
  }
};

const resendEmail = (email) => async dispatch => {
  try {
    dispatch(requestSignInOrSignUp(true));
    const {response} = await AuthService.resendEmail(email);

    if (!response.status) {
      throw new Error(response.message);
    }

    successToastify(response.message);
  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(requestSignInOrSignUp(false));
  }

};

const confirmAccount = (confirm, redirect) => async dispatch => {
  try {
    dispatch(requestSignInOrSignUp(true));
    const {response} = await AuthService.confirmAccount(confirm);

    if (!response.status) {
      throw new Error(response.message);
    }

    successToastify(response.message);
    redirect('sign-in');
  } catch (err) {
    err.message && errorToastify(err.message);
    redirect('sign-in');
  } finally {
    dispatch(requestSignInOrSignUp(false));
  }
};

const verifyUUID = (redirect, {setTimerStart, setEndTime, setTimer}) => async (dispatch, getState) => {
  try {
    const { auth: { twoFactorToken } } = getState();
    const { response } = await AuthService.verifyTwoFactorID({ twoFactorToken });

    if (!response.status) {
      throw new Error(response.message);
    }
    const { date } = response;
    const endDate = DateTime.fromJSDate(new Date(date));

    const diffTimer = endDate.diffNow(['minutes', 'seconds']).toObject();
    const toSetTimer = { ...diffTimer, seconds: Math.floor(diffTimer.seconds) };

    await setEndTime(endDate);
    await setTimer(toSetTimer);
    await setTimerStart(true);

  } catch (err) {
    err.message && errorToastify(err.message);
    redirect('/sign-in');
  }
};

const onSubmitVerifySignIn = (formData, redirect, { setEndTime, setTimerStart, setTimer }) => async (dispatch, getState) => {
  try {
    dispatch(requestSignInOrSignUp(true));
    const { auth: { twoFactorToken } } = getState();
    const { response } = await AuthService.verifySignIn({...formData, twoFactorToken});

    if (!response.status) {
      throw new Error(response.message);
    }

    if (response.user) {
      const {token, user, signUpProcess, expiresIn} = response;

      const path = loginProcessGeneratePath(user, signUpProcess);

      authCookie.setData('user', user, expiresIn);
      authCookie.setToken(token,expiresIn);
      dispatch(loginSuccess(user));
      dispatch(setUserTwoFactorToken(null));

      setTimerStart(false);
      setEndTime(null);
      setTimer({});

      redirect({
        pathname: path,
        query: user.activeStep ? {step: user.activeStep} : {}
      });
    }

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(requestSignInOrSignUp(false));
  }
};

const logOut = (redirect) => {
  authCookie.removeCookieByKey('user');
  authCookie.removeCookieByKey('token');
  redirect('/sign-in');
  return {
    type: UserActionsTypes.LOGOUT, payload: {}
  };
};

const setUserTwoFactorToken = (token) => {
  return {
    type: UserActionsTypes.SET_TWO_FACTOR_TOKEN,
    payload: token
  };
};

const requestSignInOrSignUp = (boolean) => {
  return {
    type: UserActionsTypes.REGISTER_REQUEST_OR_LOGIN, payload: boolean
  };
};

export const AuthActions = {
  signUp,
  signIn,
  forgotPasswordSendEmail,
  changePassword,
  checkTokenConfirmPass,
  logOut,
  loginSuccess,
  confirmAccount,
  resendEmail,
  verifyUUID,
  onSubmitVerifySignIn
};
