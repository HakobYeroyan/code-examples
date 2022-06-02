import {infoToastify, successToastify} from 'utils/notification';

//Services
import {AdminSupportsService} from 'services';

//actionTypes
import {UserActionsTypes} from 'store/types';

const initialSupports = () => async (dispatch) => {
  try {
    const {response} = await AdminSupportsService.getSupports();

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(getSupports(response.allRequests));
  } catch (err) {
    console.log(err);
  }
};

const getUnSeenSupportsCount = () => async (dispatch) => {
  try {
    const { response } = await AdminSupportsService.getUnSeenSupportsCount();

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(getSupportsCounts(response.unSeenRequests));

  } catch (e) {
    console.log(e);
  }
};

const updateSupportStatus = (supportRequest) => async (dispatch, getState) => {
  try {
    const { adminSupport: { support: { list } } } = getState();
    const { response } = await AdminSupportsService.updateSupport(supportRequest);

    if (!response.status) {
      throw new Error(response.message);
    }
    const updatedSupportID = list.findIndex(support => support._id === response.updatedRequest._id);
    list.splice(updatedSupportID, 1, response.updatedRequest);

    dispatch(getSupports(list));
    dispatch(getUnSeenSupportsCount());

  } catch (e) {
    console.log(e);
  }
};

const getNewSupportNotification = (support) => async (dispatch, getState) => {
  const {adminSupport: {support: {list,unSeenSupportsCount}}} = getState();
  const supportNotifications = [support, ...list];
  const notificationDescription = <span>New <a href="/admin/support" className="support-link">support</a> request!</span>;
  const countUnseen = +unSeenSupportsCount + 1;

  infoToastify(notificationDescription);

  dispatch(getSupports(supportNotifications));
  dispatch(getSupportsCounts(countUnseen));
};

const sendMessage = (data) => async () => {
  try {
    const { response } = await AdminSupportsService.sendMessage(data);

    if (!response.status) {
      throw new Error(response.message);
    }

  } catch (e) {
    console.log(e.message);
  }
};

const getSupports = (supports) => {
  return {
    type: UserActionsTypes.GET_ADMIN_SUPPORTS,
    payload: supports
  };
};

const getSupportsCounts = (count) => {
  return {
    type: UserActionsTypes.GET_UNSEEN_SUPPORTS_COUNT,
    payload: count
  };
};


export const AdminSupportsActions = {
  sendMessage,
  initialSupports,
  getUnSeenSupportsCount,
  updateSupportStatus,
  getNewSupportNotification,
};
