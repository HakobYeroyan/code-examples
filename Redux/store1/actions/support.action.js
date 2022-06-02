import {successToastify, errorToastify, infoToastify} from 'utils/notification';
import {UserActionsTypes} from '../types';

//Services
import {SupportService} from 'services';

const getInitialSupportData = () => async (dispatch) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_SUPPORTS, true));
    const { response } = await SupportService.getClientRequest();

    if (!response.status) {
      throw new Error(response.message);
    }

    const { userRequests: supports } = response;
    dispatch(setSupports(supports));

  } catch (e) {
    console.log(e.message);
  } finally {
    dispatch(loading(UserActionsTypes.LOADING_SUPPORTS, false));
  }
};

const getNewSupportNotification = (support) => async (dispatch, getState) => {
  const {adminSupport: {support: {list,unSeenSupportsCount}}} = getState();
  const supportNotifications = [support, ...list];
  const notificationDescription = <span>New <a href="/support" className="support-link">support</a> request!</span>;
  const countUnseen = +unSeenSupportsCount + 1;

  infoToastify(notificationDescription);

  dispatch(getSupports(supportNotifications));
  dispatch(getSupportsCounts(countUnseen));
};

const saveData = (data, redirect) => async (dispatch, getState) => {
  try {
    const { supports: { locationPaths } } = getState();
    const { response } = await SupportService.saveClientRequest({...data, imagePath: locationPaths});

    if (!response.status) {
      throw new Error(response.message);
    }

    successToastify(response.message);
    dispatch(setLocationPaths([]));
    dispatch(getInitialSupportData());

    redirect('/support');

  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const onChangeTabs = (key) => async (dispatch) => {
  try {
    dispatch(setSupportRequestFilterKey(key));
  } catch (e) {
    errorToastify(e.message);
  }
};

const sendImages = (location) => async (dispatch, getState) => {
  try {
    const { supports: { locationPaths } } = getState();

    dispatch(setLocationPaths([...locationPaths, location]));

  } catch (e) {
    console.log(e.message);
  }
};

const deleteImage = (originFile) => async (dispatch, getState) => {
  try {
    const { supports: { locationPaths } } = getState();
    const { name: imageName, uid } = originFile;
    const { response } = await SupportService.removeImages(imageName, uid);

    if (!response.status) {
      throw new Error(response.message);
    }

    const filteredPaths = locationPaths.filter(({ uid: locUID }) => locUID !== uid );

    dispatch(setLocationPaths([...filteredPaths]));

  } catch (e) {
    errorToastify(e.message);
  }
};

const changeStatusRequest = (data) => async () => {
  try {
    const response = await SupportService.statusSupportRequest(data);

  } catch (e) {
    console.log(e.message);
  }
};

const getSupports = (supports) => {
  return {
    type: UserActionsTypes.GET_USER_SUPPORTS,
    payload: supports
  };
};

const getSupportsCounts = (count) => {
  return {
    type: UserActionsTypes.GET_UNSEEN_SUPPORT_COUNT,
    payload: count
  };
};

const setLocationPaths = (paths) => {
  return {
    type: UserActionsTypes.SET_LOCATION_PATHS,
    payload: [...paths]
  };
};


const setSupportRequestFilterKey = (key) => {
  return {
    type: UserActionsTypes.SET_FILTER_REQUEST_KEY,
    payload: key
  };
};

const setSupports = (supports) => {
  return {
    type: UserActionsTypes.SET_SUPPORTS,
    payload: supports
  };
};

const loading = (actionType, boolean) => {
  return {
    type: actionType, payload: boolean
  };
};

export const SupportActions = {
  getNewSupportNotification,
  saveData,
  getInitialSupportData,
  onChangeTabs,
  sendImages,
  deleteImage,
  changeStatusRequest,
};
