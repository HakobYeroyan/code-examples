import {successToastify, errorToastify} from 'utils/notification';

//Services
import {AdminRetailersService} from 'services';

//actionTypes
import {UserActionsTypes} from 'store/types';

const InitialRetailers = (router = null, name = null) => async (dispatch) => {
  try {
    dispatch(loadingRetailerData(true));
    const {response} = await AdminRetailersService.getRetailers(name);

    if (!response.status) {
      throw new Error(response.message);
    }
    const {retailers} = response;

    dispatch(getRetailers(retailers));

    if (router) {
      const {query} = router;
      const action = query.action;

      if (action && action === 'edit' && query.id) {
        dispatch(onClickEditBtn(query.id, router.push));
      }
    }

    dispatch(initialFrequencyMultiple());

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loadingRetailerData(false));
  }
};

const initialFrequencyMultiple = () => async (dispatch) => {
  try {
    const { response } = await AdminRetailersService.getFrequencyMultiple();

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(setFrequencyMultiple({...response.frequencyData}));

  } catch (e) {
    console.log(e.message);
  }
};

const onClickEditBtn = (_id, redirect) => async (dispatch, getState) => {
  const {adminRetailers: {retailers: {list}}} = getState();
  const entry = list.find((retailer) => retailer._id === _id);

  dispatch(getEntry(entry));

  redirect({
    pathname: '/admin/retailers',
    query: entry && entry._id ? {action: 'edit', id: _id} : {}
  });
};

const editRetailer = (redirect, data) => async (dispatch, getState) => {
  try {
    dispatch(loadingRetailerData(true));
    const {adminRetailers: {locationPaths}} = getState();
    const {response} = await AdminRetailersService.editRetailer({...data, logo: locationPaths[locationPaths.length - 1]?.path});

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(InitialRetailers());
    successToastify(response.message);
    redirect('/admin/retailers');

    dispatch(setEmptyRetailer({}));

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loadingRetailerData(false));
  }
};

const createRetailer = (redirect, data) => async (dispatch, getState) => {
  try {
    dispatch(loadingRetailerData(true));
    const {adminRetailers: {locationPaths}} = getState();
    const {response} = await AdminRetailersService.createRetailer({...data, logo: locationPaths[0].path});

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(InitialRetailers());
    successToastify(response.message);
    redirect('/admin/retailers');

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loadingRetailerData(false));
  }
};

const uploadImageRetailer = (location) => (dispatch, getState) => {

  const {adminRetailers: {locationPaths}} = getState();

  dispatch(setLocationPaths([...locationPaths, location]));
};

const setOffline = (_id,status) => async (dispatch) => {
  try {
    dispatch(loadingRetailerData(true));
    const {response} = await AdminRetailersService.setOffline({_id, status});

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(InitialRetailers());
    successToastify(response.message);


  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loadingRetailerData(false));
  }
};

const deleteRetailer = (_id) => async (dispatch) => {
  try {
    dispatch(loadingRetailerData(true));
    const {response} = await AdminRetailersService.deleteRetailer({_id});

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(InitialRetailers());
    successToastify(response.message);

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loadingRetailerData(false));
  }
};

const getEntry = (entry = {}) => {
  return {
    type: UserActionsTypes.EDIT_ADMIN_RETAILERS_DATA,
    payload: entry
  };
};

const updateFrequencyMultiples = (data, setFrequencyMultipleVisible) => async (dispatch) => {
  try {
    const { premiumMultiplyPrice, single, double, triple, quadruple } = data;
    const sendData = {
      frequencyData: {
        prices: { single, double, triple, quadruple },
        premiumMultiplyPrice
      },
    };

    const { response } = await AdminRetailersService.updateFrequencyMultiple(sendData);

    if (!response.status) {
      throw new Error(response.message);
    }

    successToastify(response.message);
    setFrequencyMultipleVisible(false);
    dispatch(initialFrequencyMultiple());

  } catch (err) {
    err.message && errorToastify(err.message);
  }
};

const setLocationPaths = (paths) => {
  return {
    type: UserActionsTypes.SET_RETAILER_LOCATION_PATHS,
    payload: [...paths]
  };
};

const setEmptyRetailer = (retailer) => {
  return {
    type: UserActionsTypes.SET_EMPTY_RETAILER,
    payload: retailer,
  };
};

const loadingRetailerData = (boolean) => {
  return {
    type: UserActionsTypes.LOADING_ADMIN_RETAILERS_DATA,
    payload: boolean
  };
};

const getRetailers = (retailers) => {
  return {
    type: UserActionsTypes.GET_ADMIN_RETAILERS,
    payload: retailers
  };
};

const setFrequencyMultiple = (frequencyMultiples) => {
  return {
    type: UserActionsTypes.SET_FREQUENCY_MULTIPLE,
    payload: frequencyMultiples
  };
};


export const AdminRetailersActions = {
  InitialRetailers,
  onClickEditBtn,
  getEntry,
  editRetailer,
  createRetailer,
  setOffline,
  deleteRetailer,
  initialFrequencyMultiple,
  updateFrequencyMultiples,
  uploadImageRetailer,
};
