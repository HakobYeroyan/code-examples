import { successToastify, errorToastify } from 'utils/notification';

import {UserActionsTypes} from 'store/types';
import {AdminCouponService} from 'services';

const getInitialCoupons = (router = null, query = null) => async (dispatch) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_COUPONS, true));
    const { response } = await AdminCouponService.getAllCoupons(query);

    if (!response.status) {
      throw new Error(response.message);
    };

    const { allCoupons } = response;
    dispatch(setInitialCoupons(allCoupons));

    if (router) {
      const {query} = router;
      const action = query.action;

      if (action && action === 'edit' && query.id) {
        dispatch(onClickEditBtn(query.id, router.push));
      }
    }

  } catch (e) {
    console.log(e.message);
  } finally {
    dispatch(loading(UserActionsTypes.LOADING_COUPONS, false));
  }
};


const createCoupon = (data, redirect, reset) => async (dispatch) => {
  try {
    const sentData = {...data, validUntil: data.validUntil.toJSON()};
    const { response } = await AdminCouponService.createCoupon(sentData);

    if (!response.status) {
      throw new Error(response.message);
    };

    successToastify(response.message);
    dispatch(getInitialCoupons());

    redirect('/admin/coupons');
    reset({ couponName: '', code: '', category: data.category, value: data.value });

  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const changeStatus = (_id, value, redirect) => async (dispatch) => {
  try {
    const { response } = await AdminCouponService.changeCouponStatus({couponId: _id, status: value});

    if (!response.status) {
      throw new Error(response.message);
    };

    successToastify(response.message);
    dispatch(getInitialCoupons());

    redirect('/admin/coupons');

  } catch (e) {
    errorToastify(e.message);
  }
};

const handleDeleteCoupon = (couponId) => async (dispatch) => {
  try {
    const { response } = await AdminCouponService.deleteCoupon({couponId});

    if(!response.status) {
      throw new Error(response.message);
    }

    dispatch(getInitialCoupons());
    successToastify(response.message);

  } catch (e) {
    errorToastify(e.message);
  }
};

const getEntry = (entry = {}) => {
  return {
    type: UserActionsTypes.EDIT_ADMIN_COUPONS_DATA,
    payload: entry
  };
};

const setInitialCoupons = (coupons) => {
  return {
   type: UserActionsTypes.GET_COUPONS,
   payload: [...coupons]
  };
};

const loading = (actionType, boolean) => {
  return {
    type: actionType, payload: boolean
  };
};

export const AdminCouponsAction = {
  getInitialCoupons,
  createCoupon,
  handleDeleteCoupon,
  getEntry,
  changeStatus
};
