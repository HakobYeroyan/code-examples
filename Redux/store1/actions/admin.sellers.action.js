import { successToastify, errorToastify } from 'utils/notification';

//Services
import { AdminSellersService } from 'services';

//actionTypes
import { UserActionsTypes } from 'store/types';

const initialSellersData = (name) => async (dispatch) => {
  try {
    dispatch(loadingSellerData(true));
    const { response } = await AdminSellersService.getSellers(name);

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(getSellersInitialData(response.missingSeller));

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loadingSellerData(false));
  }
};

const missingSellerData = (data) => async (dispatch) => {
  try {
    const { response } = await AdminSellersService.adminSellersMissingData(data);

    if (!response.status) {
      throw new Error(response.message);
    }

    successToastify(response.message);

    dispatch(updateSellersData(response.updatedSeller));

  } catch (err) {
    err.message && errorToastify(err.message);
  }
};

const getSellersInitialData = (sellers) => {
  return {
    type: UserActionsTypes.GET_ADMIN_SELLERS,
    payload: sellers,
  };
};

const updateSellersData = (seller) => {
  return {
    type: UserActionsTypes.UPDATE_ADMIN_SELLERS,
    payload: seller,
  };
};

const loadingSellerData = (boolean) => {
  return {
    type: UserActionsTypes.LOADING_ADMIN_SELLERS_DATA,
    payload: boolean,
  };
};


export const AdminSellersActions = {
  initialSellersData,
  missingSellerData,
};
