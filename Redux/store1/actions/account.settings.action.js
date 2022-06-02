import {successToastify, errorToastify} from 'utils/notification';
import {authCookie} from 'utils/auth';
import { AuthActions } from 'store/actions';

//Services
import {AccountService} from 'services';

//actionTypes
import {UserActionsTypes} from 'store/types';

const requestGetData = () => async (dispatch, getState) => {
  try {
    const { auth: { user } } = getState();
    const { response } = await AccountService.getUserData();

    if (!response.status) {
      throw new Error(response.message);
    }

    authCookie.setData('user', {...user, ...response.user});

    dispatch(changeAccountInfo({...response.user}));

  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const sendDigitCodeToEmail = (email, setTimer, setOpenConfirmDigits, setSentEmail) => async () => {
  try {
    const { response: { message, status } } = await AccountService.verifyEmail(email);

    if (!status) {
      throw new Error(message);
    }

    setSentEmail(email);
    setTimer({minutes: '5', seconds: '0'});
    setOpenConfirmDigits(true);
    successToastify(message);

  } catch (e) {
    e.message && errorToastify(e.message);
  }

};

const confirmEmail = (data, intervalRef, setOpenConfirmDigits, setTimer, email, setSentEmail) => async (dispatch, getState) => {
  try {
    const { auth } = getState();
    const toSendData = {...email, ...data};
    const { response: { message, status, user } } = await AccountService.confirmEmail(toSendData);

    if (!status) {
      throw new Error(message);
    }

    setOpenConfirmDigits(false);
    clearInterval(intervalRef.current);
    setTimer({minutes: '5', seconds: '0'});
    setSentEmail({});

    successToastify(message);

    authCookie.setData('user', {...user, ...auth.user});

    dispatch(changeAccountInfo(user));

  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const requestChangeAccountInfo = (changedField) => async (dispatch, getState) => {
  try {
    const {auth: {user}} = getState();

    const sendData = changedField.city
      ? {
          address: { ...user.address, city: changedField.city }
        }
      : changedField;

    const {response} = await AccountService.changeAccountInfo(sendData);

      if (!response.status) {
        throw new Error(response.message);
      }

      successToastify(response.message);

    const updatedUser = {...user, ...response.user};

    authCookie.setData('user', updatedUser);

    dispatch(changeAccountInfo(updatedUser));

  } catch (err) {
    err.message && errorToastify(err.message);
  }

};

const pauseScrapingData = (data) => async (dispatch) => {
  try {
    dispatch(loading(true));
    const {response} = await AccountService.pauseScraping(data);

    if (!response.status) {
      throw new Error(response.message);
    }

    successToastify(response.message);

    dispatch(getSubscriptionAndBilling());

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loading(false));
  }
};

const cancelScrapingData = (data) => async (dispatch) => {
  try {
    dispatch(loading(true));
    const {response} = await AccountService.cancelScraping(data);

    if (!response.status) {
      throw new Error(response.message);
    }

    successToastify(response.message);

    dispatch(getSubscriptionAndBilling());

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loading(false));
  }
};

const verifyPhone = (phoneNumber, setTimer, setOpenConfirmDigits) => async (dispatch) => {
  try {
    dispatch(loading(true));
    const { response } = await AccountService.verifyPhone(phoneNumber);

    if (!response.status) {
      throw new Error(response.message);
    }

    authCookie.setData('phoneNumber', phoneNumber.phoneNumber);

    setTimer({minutes: '5', seconds: '0'});
    setOpenConfirmDigits(true);

    successToastify(response.message);

  } catch (e) {
    e.message && errorToastify(e.message);
  } finally {
    dispatch(loading(false));
  }
};

const confirmPhone = (data, intervalRef, setTimer, setOpenConfirmDigits, setDisable) => async (dispatch, getState) => {
  try {
    dispatch(loading(true));
    const { auth: { user } } = getState();
    const { response } = await AccountService.confirmPhone(data);

    if (!response.status) {
      throw new Error(response.message);
    }

    setTimer({minutes: '5', seconds: '0'});
    setOpenConfirmDigits(false);
    clearInterval(intervalRef.current);
    setDisable(false);
    authCookie.removeCookieByKey('phoneNumber');

    successToastify(response.message);

    dispatch(changeAccountInfo({...user, ...response.user}));

  } catch (e) {
    e.message && errorToastify(e.message);
  } finally {
    dispatch(loading(false));
  }
};

const getReferralCode = () => async (dispatch, getState) => {
  try {
    const { auth: { user } } = getState();
    const { response } = await AccountService.getReferralCode();

    if (!response.status) {
      throw new Error(response.message);
    }

    const { referralCode } = response;

    const updatedUser = {...user, referralCode};

    authCookie.setData('user', updatedUser);

    dispatch(changeAccountInfo(updatedUser));

  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const getAvatar = () => async (dispatch) => {
  try {
    const { response } = await AccountService.getUserAvatar();

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(changeAccountInfo({avatar_path: response.avatar_path}));

  } catch (e) {
    console.log(e.message);
  }
};

const uploadAvatar = (data) => async (dispatch) => {
  try {
    const { response } = await AccountService.uploadAvatar(data);

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(AccountActions.getAvatar());

    successToastify(response.message);

  } catch (e) {
    console.log(e.message);
  }
};

const removeAvatar = () => async (dispatch) => {
  try {
    const { response } = await AccountService.removeAvatar();

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(AccountActions.getAvatar());

    successToastify(response.message);

  } catch (e) {
    errorToastify(e.message);
  }
};

const changePassword = (passwords) => async () => {
  try {
    const { response } = await AccountService.changePassword(passwords);

    if (!response.status) {
      throw new Error(response.message);
    }

    successToastify(response.message);

  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const getSubscriptionAndBilling = () => async (dispatch) => {
  try {
    dispatch(loading(true));
    const { response } = await AccountService.getUserSubscriptionAndBilling();

    if (!response.status) {
      throw new Error(response.message);
    }

    const { totalCost, markets, couponData, referral, scrapingSchedule, premiumMultiplyPrice, planInterval, periodEndTime, invoiceTime, cardNumberLast4, cardType } = response.subscription;

    dispatch(changeAccountInfo({
      totalCost,
      markets,
      couponData,
      referral,
      scrapingSchedule,
      premiumMultiplyPrice,
      planInterval,
      periodEndTime,
      invoiceTime,
      cardNumberLast4,
      cardType: cardType ? cardType : '',
    }));

  } catch (e) {
    e.message && errorToastify(e.message);
  } finally {
    dispatch(loading(false));
  }
};

const changeCreditCard = (data) => async (dispatch) => {
  try {
    const { response } = await AccountService.editUserCreditCard(data);

    if(!response.status) {
      throw new Error(response.message);
    }

    successToastify(response.message);
    const { cardNumberLast4, cardType } = response;
    dispatch(changeAccountInfo( { cardNumberLast4, cardType } ));

  } catch (e) {
    errorToastify(e.message);
  }
};

const getEmailTemplates = () => async (dispatch) => {
  try {
    const { response } = await AccountService.getEmailTemplates();

    if (!response.status) {
      throw new Error(response.message);
    }

    const { userTemplates } = response;

    dispatch(setEmailTemplates(userTemplates));

  } catch (e) {
    e.message && errorToastify(e.message);
  }

};

const createEmailTemplate = (data, close) => async (dispatch) => {
  try {
    dispatch(loadingTemplates(true));
    const { response } = await AccountService.createEmailTemplate(data);

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(getEmailTemplates());

    successToastify(response.message);
    close(false);

  } catch (e) {
    e.message && errorToastify(e.message);
  } finally {
    dispatch(loadingTemplates(false));
  }
};

const editEmailTemplate = (formData, close) => async (dispatch) => {
  try {
    dispatch(loadingTemplates(true));
    const { response } = await AccountService.editEmailTemplate(formData);

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(getEmailTemplates());
    successToastify(response.message);

    close(false);

  } catch (e) {
    e.message && errorToastify(e.message);
  } finally {
    dispatch(loadingTemplates(false));
  }
};

const getTemplatesForReport = () => async (dispatch) => {
  try {
    const { response } = await AccountService.getTemplateForReport();

    if (!response.status) {
      throw new Error(response.message);
    }

    const { allTemplates } = response;

    dispatch(setTemplatesForReport({...allTemplates}));

  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const deleteAccount = (redirect) => async (dispatch) => {
  try {
    const { response } = await AccountService.deleteUser();

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(AuthActions.logOut(redirect));

    successToastify(response.message);

  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const confirmDeleteAccount = (redirect, password) => async (dispatch) => {
  try {
    dispatch(loading(true));
    const { response } = await AccountService.checkPassword(password);

    if (!response.status) {
      throw new Error(response.message);
    }

    await dispatch(deleteAccount(redirect));

  } catch (e) {
    errorToastify(e.message);
  } finally {
    dispatch(loading(false));
  }
};

const getUserNotifications = () => async (dispatch) => {
  try {
    dispatch(loading(true));
    const { response } = await AccountService.getMapNotification();

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(setNotifications(response));

  } catch (e) {
    e.message && errorToastify(e.message);
  } finally {
    dispatch(loading(false));
  }
};

const editUserNotifications = (data) => async (dispatch) => {
  try {
    dispatch(loading(true));

    const { response } = await AccountService.editMapNotification(data);

    if(!response.status) {
      throw new Error(response.message);
    }

    dispatch(editNotifications(response.updatedUser));
    successToastify(response.message);

  } catch (e) {
    e.message && errorToastify(e.message);
  } finally {
    dispatch(loading(false));
  }
};

const deleteAdditionalEmail = (emailId) => async (dispatch) => {
  try {
    const { response } = await AccountService.deleteAdditionalEmail(emailId);

    if(!response.status) {
      throw new Error(response.message);
    }

    successToastify(response.message);
    dispatch(removeEmailAddress(emailId));

  } catch(e) {
    errorToastify(e.message);
  }
};

const editAdditionalEmail = (data) => async (dispatch) => {
  try {
    const { response } = await AccountService.editAdditionalEmail(data);

    if(!response.status) {
      throw new Error(response.message);
    }

    successToastify(response.message);
    dispatch(updateEmailAddress(data));

  } catch(e) {
    errorToastify(e.message);
  }
};

const setNotifications = (time) => {
  return {
    type: UserActionsTypes.SET_USER_NOTIFICATIONS,
    payload: time,
  };
};

const editNotifications = (time) => {
  return {
    type: UserActionsTypes.UPDATE_USER_NOTIFICATIONS,
    payload: time,
  };
};

const removeEmailAddress = (email) => {
  return {
    type: UserActionsTypes.REMOVE_ADDITIONAL_EMAIL,
    payload: email,
  };
};

const updateEmailAddress = (emailId) => {
  return {
    type: UserActionsTypes.UPDATE_ADDITIONAL_EMAIL,
    payload: emailId,
  };
};

const setTemplatesForReport = (templates) => {
  return {
    type: UserActionsTypes.SET_LIST_FOR_REPORT,
    payload: {...templates}
  };
};

const setEmailTemplates = (templates) => {
  return {
    type: UserActionsTypes.SET_EMAIL_TEMPLATES,
    payload: [...templates]
  };
};


const changeAccountInfo = (changedField) => {
  return {
    type: UserActionsTypes.ACCOUNT_SETTINGS_CHANGE_FIELD,
    payload: changedField
  };
};

const loadingTemplates = (boolean) => {
  return {
    type: UserActionsTypes.LOADING_TEMPLATES,
    payload: boolean
  };
};

const buttonLoading = (boolean) => {
  return {
    type: UserActionsTypes.LOADING_BUTTON,
    payload: boolean,
  };
};

const loading = (boolean) => {
  return {
    type: UserActionsTypes.REGISTER_REQUEST_OR_LOGIN,
    payload: boolean
  };
};


export const AccountActions = {
  requestChangeAccountInfo,
  requestGetData,
  sendDigitCodeToEmail,
  confirmEmail,
  verifyPhone,
  confirmPhone,
  getAvatar,
  uploadAvatar,
  changePassword,
  removeAvatar,
  getSubscriptionAndBilling,
  changeCreditCard,
  getReferralCode,
  createEmailTemplate,
  editEmailTemplate,
  getEmailTemplates,
  getTemplatesForReport,
  deleteAccount,
  confirmDeleteAccount,
  pauseScrapingData,
  cancelScrapingData,
  getUserNotifications,
  editUserNotifications,
  deleteAdditionalEmail,
  editAdditionalEmail,
  buttonLoading,
};
