import {successToastify, errorToastify} from 'utils/notification';

import {UserActionsTypes} from 'store/types';

//Services
import {MapViolationsService, SellersService} from 'services';
import {DateTime} from 'luxon';

const getProducts = (productName = null) => async (dispatch, getState) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_PRODUCTS, true));
    const { map: { filterOptions, filterOptions: { date: { value }, time } } } = getState();

    const { response } = await MapViolationsService.getMapProducts(value, time ? time.value : 'all', 10, 0, productName);

    if (!response.status) {
      throw new Error(response.message);
    }

    const { products, allMapCount } = response;

    dispatch(setEntryProduct({}));
    dispatch(initialProducts(products));
    dispatch(initialFilterOptions(filterOptions));
    dispatch(totalMapCount(allMapCount));

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loading(UserActionsTypes.LOADING_PRODUCTS, false));
  }
};

const sendCurrentPage = (page, searchValue) => async (dispatch, getState) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_PRODUCTS, true));
    dispatch(currentPage(page));

    const { map: { filterOptions: { date: { value }, time } } } = getState();

    const { response } = await MapViolationsService.getMapProducts(value, time ? time.value : 'all', 10, page, searchValue);

    if (!response.status) {
      throw new Error(response.message);
    }

    const { allMapCount } = response;

    dispatch(setEntryProduct({}));
    dispatch(initialProducts(response.products));
    dispatch(totalMapCount(allMapCount));

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loading(UserActionsTypes.LOADING_PRODUCTS, false));
  }
};

const getFilteredData = (searchValue) => async (dispatch, getState) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_PRODUCTS, true));
    const { map: { filterOptions: { date: { value }, time } } } = getState();

    const { response } = await MapViolationsService.getMapProducts(value, time ? time.value : 'all', 10, 0, searchValue);

    if (!response.status) {
      throw new Error(response.message);
    }

    const { products, allMapCount } = response;

    dispatch(setEntryProduct({}));
    dispatch(initialProducts(products));
    dispatch(totalMapCount(allMapCount));

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loading(UserActionsTypes.LOADING_PRODUCTS, false));
  }
};

const onChangeFilterDate = (date, searchValue) => async (dispatch) => {
  try {
    dispatch(setFilterDate(date));
    dispatch(getFilteredData(searchValue));
  } catch (err) {
    err.message && errorToastify(err.message);
  }
};

const onChangeFilterTime = (time, searchValue) => async (dispatch) => {
  try {
    dispatch(setFilterTime(time));
    dispatch(getFilteredData(searchValue));
  } catch (err) {
    err.message && errorToastify(err.message);
  }
};

const onExpandProductRow = (_id) => async (dispatch, getState) => {
  try {
    const {map: {products: { list, entry: updatedEntry } } } = getState();
    const entry = list.find((item) => _id === item._id);
    const newList = list.map(item => item._id === updatedEntry._id ? updatedEntry : item);

    dispatch(setEntryProduct(entry));
    dispatch(newEntryViolation(newList));

  } catch (e) {
    errorToastify(e.message);
  }
};

const editSellerInfoViolation = (data, redirect) => async (dispatch, getState) => {
  try {
    const { sellers: { sellers: { entrySellerInfo: { sellerId } } } } = getState();
    const { map: { products: { list } } } = getState();

    const toSendData = { sellerId, ...data };
    const { response } = await SellersService.editSellerInfo(toSendData);

    const newList = list.map(elem => {
      const scrapedElem = elem.scrapedData.map(item => {
        if(item.sellerId === response.seller.MySQL_Market_Seller_ID) {
          return {...item, authorized: response.seller.authorized};
        }

        return {...item};
      });

      return {...elem, scrapedData: scrapedElem};
    });

    if (!response.status) {
      throw new Error(response.message);
    }

    successToastify(response.message);

    dispatch(setEntryChangedProduct(newList));
    redirect('/map-violations');

  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const onClickSellerName = (entry, redirect) => async (dispatch) => {
  try {
    dispatch(setEntrySeller(entry));
    const startDate = DateTime.fromJSDate(new Date(entry.createdAt)).toFormat('yyyy-MM-dd');
    const endDate = DateTime.local().toFormat('yyyy-MM-dd');

    redirect({
      pathname: '/map-violations',
      query: entry && entry._id ? {action: 'edit', sellerID: entry._id, productID: entry.productID, startDate, endDate} : {}
    });

  } catch (e) {
    errorToastify(e.message);
  }
};

const getSellerEmail = (entry) => async (dispatch) => {
  try {
    const { response } = await MapViolationsService.getMapEmail(entry.sellerId);

    dispatch(setEntrySeller({...entry, seller_Email: response.seller_Email}));

  } catch (e) {
    console.log(e.message);
  }
};

const closeSellerModal = (redirect) => async (dispatch) => {
  try {
    dispatch(setEntrySeller({}));
    redirect('/map-violations');

  } catch (e) {
    console.log(e.message);
  }
};

const onClickReportBtn = (entry, redirect) => async (dispatch) => {
  try {
    dispatch(setEntrySeller(entry));
    const startDate = DateTime.fromJSDate(new Date(entry.createdAt)).toFormat('yyyy-MM-dd');
    const endDate = DateTime.local().toFormat('yyyy-MM-dd');

    redirect({
      pathname: '/map-violations',
      query: entry && entry._id ? {action: 'report', sellerID: entry._id, productID: entry.productID, startDate, endDate} : {}
    });

  } catch (e) {
    console.log(e.message);
  }
};

const sendReport = (data) => async (dispatch) => {
  try {
    const { response } = await MapViolationsService.sendReport(data);

    if(!response.status) {
      throw new Error(response.message);
    }

    dispatch(reportedViolation(response.updatedProduct));

    successToastify(response.message);

  } catch (e) {
    errorToastify(e.message);
  }
};

const sendScrapedDataIds = (data, id) => async (dispatch) => {
  try {
    const { response } = await MapViolationsService.scrapedMapData({scrapedDataIds: data, productId: id});

    if (!response.status) {
      throw new Error(response.message);
    }
    dispatch(checkedMapElement(response.product, response._id));

  } catch (e) {
    console.log(e.message);
  }
};

const checkedMapElement = checked => ({
  type: UserActionsTypes.GET_SCRAPED_DATA_CHECKED,
  payload: checked,
});

const closeReportModal = (redirect) => async (dispatch) => {
  try {
    dispatch(setEntrySeller({}));
    redirect('/map-violations');

  } catch (e) {
    console.log(e.message);
  }
};

const downloadReportMap = (data) => async (dispatch) => {
  try {
    const {response} = await MapViolationsService.mapReport(data);

    if(!response) {
      throw new Error(response.message);
    }

    dispatch(reportMap(response));

  } catch (err) {
    err.message && errorToastify(err.response);
  }
};

const reportMap = (data) => {
  return {
    type: UserActionsTypes.GET_REPORT_MAP,
    payload: data,
  };
};

const reportedViolation = (data) => {
  return {
    type: UserActionsTypes.REPORTED_VIOLATION,
    payload: data,
  };
};

const newEntryViolation = (entrySeller) => {
  return {
    type: UserActionsTypes.NEW_ENTRY_VIOLATION,
    payload: entrySeller,
  };
};

const setFilterDate = (date) => {
  return {
    type: UserActionsTypes.SET_FILTER_DATE,
    payload: { ...date }
  };
};

const setFilterTime = (time) => {
  return {
    type: UserActionsTypes.SET_FILTER_TIME,
    payload: time
  };
};

const setEntrySeller = (entry) => {
  return {
    type: UserActionsTypes.SET_ENTRY_SELLER,
    payload: entry
  };
};

const setEntryProduct = (entry) => {
  return {
    type: UserActionsTypes.SET_ENTRY_PRODUCT,
    payload: entry
  };
};

const setEntryChangedProduct = (seller) => {
  return {
    type: UserActionsTypes.SET_ENTRY_CHANGED_MAP_PRODUCT,
    payload: seller
  };
};

const currentPage = (page) => {
  return {
    type: UserActionsTypes.MAP_CURRENT_PAGE,
    payload: page,
  };
};

const totalMapCount = (count) => {
  return {
    type: UserActionsTypes.ALL_MAP_COUNT,
    payload: count,
  };
};

const initialProducts = products => ({
  type: UserActionsTypes.GET_INITIAL_DATA_MAP_VIOLATION,
  payload: products
});

const initialFilterOptions = filterOptions => ({
  type: UserActionsTypes.GET_INITIAL_FILTER_OPTIONS,
  payload: filterOptions
});

const loading = (actionType, boolean) => ({
  type: actionType, payload: boolean
});

export const MapActions = {
  getProducts,
  onExpandProductRow,
  onClickReportBtn,
  getSellerEmail,
  closeReportModal,
  onClickSellerName,
  closeSellerModal,
  onChangeFilterDate,
  onChangeFilterTime,
  sendScrapedDataIds,
  downloadReportMap,
  sendReport,
  sendCurrentPage,
  editSellerInfoViolation,
};
