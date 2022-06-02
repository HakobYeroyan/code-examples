import {UserActionsTypes} from 'store/types';
import {errorToastify, successToastify} from 'utils/notification';
import {DateTime} from 'luxon';

import { SellersService } from 'services';

const GetInitialSellersData = (sellerName = null) => async (dispatch, getState) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_SELLERS, true));
    const { map: { filterOptions: { date: { value }, time } }, products: { markets: { entry: { _id } } } } = getState();

    const {response} = await SellersService.getInitialDataSellers(value, _id !== 'all' ? _id : null, time ? time.value : 'all', 10, 0, sellerName);

    if (!response.status) {
      throw new Error(response.message);
    }

    const { scrapedSellers, allSellersCount } = response;

    dispatch(setEntrySeller({}));
    dispatch(getSellers(scrapedSellers));
    dispatch(totalSellerCount(allSellersCount));

  } catch (e) {
    e.message && errorToastify(e.message);
  } finally {
    dispatch(loading(UserActionsTypes.LOADING_SELLERS, false));
  }
};

const sendCurrentPage = (page, searchValue) => async (dispatch, getState) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_SELLERS, true));
    dispatch(currentPage(page));

    const { map: { filterOptions: { date: { value }, time } }, products: { markets: { entry: { _id } } }, sellers: { sellers: {pagination: { limit, skip } } } } = getState();

    const {response} = await SellersService.getInitialDataSellers(value, _id !== 'all' ? _id : null, time ? time.value : 'all', 10, page, searchValue);

    if (!response.status) {
      throw new Error(response.message);
    }

    const { scrapedSellers, allSellersCount } = response;

    dispatch(setEntrySeller({}));
    dispatch(getSellers(scrapedSellers));
    dispatch(totalSellerCount(allSellersCount));

  } catch (e) {
    e.message && errorToastify(e.message);
  } finally {
    dispatch(loading(UserActionsTypes.LOADING_SELLERS, false));
  }
};

const getFilteredData = (searchValue) => async (dispatch, getState) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_SELLERS, true));
    const { map: { filterOptions: { date: { value }, time } }, products: { markets: { entry: { _id } } } } = getState();

    const {response} = await SellersService.getInitialDataSellers(value, _id !== 'all' ? _id : null, time ? time.value : 'all', 10, 0, searchValue);

    if (!response.status) {
      throw new Error(response.message);
    }

    const { scrapedSellers, allSellersCount } = response;

    dispatch(setEntrySeller({}));
    dispatch(getSellers(scrapedSellers));
    dispatch(totalSellerCount(allSellersCount));

  } catch (e) {
    e.message && errorToastify(e.message);
  } finally {
    dispatch(loading(UserActionsTypes.LOADING_SELLERS, false));
  }
};

const editSellerInfo = (data, redirect) => async (dispatch, getState) => {
  try {
    const { sellers: { sellers: { entrySellerInfo: { sellerId } } } } = getState();
    const toSendData = { sellerId, ...data };
    const { response } = await SellersService.editSellerInfo(toSendData);

    if (!response.status) {
      throw new Error(response.message);
    }

    successToastify(response.message);

    dispatch(GetInitialSellersData());
    redirect('/sellers');

  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const createSellerNotes = (data, redirect) => async (dispatch) => {
  try {
    const { response } = await SellersService.sellerNotes(data);

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(updatedNote(response.seller));

    successToastify(response.message);

    redirect('/sellers');

  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const editSellerNotes = (data, redirect) => async (dispatch) => {
  try {
    const { response } = await SellersService.editSellerNotes(data);

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(updatedNote(response.updatedSeller));

    successToastify(response.message);

    redirect('/sellers');

  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const deleteSellerNotes = (data, redirect) => async (dispatch) => {
  try {
    const { response } = await SellersService.deleteSellerNotes(data);

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(updatedNote(response.deletedNote));

    successToastify(response.message);

    redirect('/sellers');

  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const onChangeFilterDate = (date, searchValue) => async (dispatch) => {
  try {
    dispatch(setFilterDate(date));
    dispatch(getFilteredData(searchValue));
  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const onChangeTabs = (marketID, searchValue) => async (dispatch, getState) => {
  try {
    const { sellers: { sellers: { pagination: { allSellersCount } } } } = getState();
    dispatch(totalSellerCount(allSellersCount));
    dispatch(selectMarket(marketID));
    dispatch(getFilteredData(searchValue));
  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const onChangeFilterTime = (time, searchValue) => async (dispatch) => {
  try {
    dispatch(setFilterTime(!time ? null : time));
    dispatch(getFilteredData(searchValue));
  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const selectMarket = (_id) => async (dispatch, getState) => {
  try {
    const {products: {markets: {list}}} = getState();
    const entry = list.find((item) => _id === item._id);

    dispatch(setEntryMarket(entry));
  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const setEntryMarket = (entry) => {
  return {
    type: UserActionsTypes.SET_ENTRY_MARKET, payload: entry
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
    payload: time ? { ...time } : time
  };
};

const onExpandSellerRow = (seller) => async (dispatch, getState) => {
  try {
    const {sellers: { sellers: { list, entry } }} = getState();
    const newList = list.map(item => item._id === entry._id ? entry : item);

    dispatch(setEntrySeller(seller || {}));
    dispatch(newEntrySeller(newList));
  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const getSellerInfo = (_id, page) => async (dispatch) => {
  try {
    const {response} = await SellersService.getSellerInfo(_id, page);

    if (!response.status) {
      throw new Error(response.message);
    }

    const { seller } = response;

    dispatch(setEntrySellerInfo(seller));

  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const downloadReportSeller = (data) => async (dispatch) => {
  try {
    const {response} = await SellersService.sellerReport(data);

    if(!response) {
      throw new Error(response.message);
    }
    dispatch(reportSeller(response));

  } catch (e) {
    e.message && errorToastify(e.response);
  }
};

const sendReport = (data) => async (dispatch) => {
  try {
    const { response } = await SellersService.sendReport(data);

    if(!response.status) {
      throw new Error(response.message);
    }

    dispatch(reportedSeller(response.updatedProduct));

    successToastify(response.message);

  } catch (e) {
    errorToastify(e.message);
  }
};

const EditModalCancel = (redirect) => async (dispatch) => {
  try {
    dispatch(setEntrySeller({}));
    dispatch(setEntrySellerInfo(null));
    redirect('/sellers');
  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const closeReportModal = (redirect) => async (dispatch) => {
  try {
    dispatch(setEntrySeller({}));
    dispatch(setEntrySellerInfo(null));
    redirect('/sellers');
  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const EditModalOpen = (seller, redirect) => async () => {
  try {
    redirect({
      pathname: '/sellers',
      query: seller && seller._id ? {action: 'edit_seller', id: seller._id} : {}
    });
  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const onClickReportBtn = (seller, redirect) => async () => {
  try {
    redirect({
      pathname: '/sellers',
      query: seller && seller._id ? {action: 'report', sellerID: seller._id} : {}
    });
  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const EditNote = (note, redirect) => async (dispatch) => {
  try {
    dispatch(setEntryNote(note));
    redirect({
      pathName: '/sellers',
      query: note && note._id ? {action: 'edit_note', id: note._id} : {}
    });
  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const reportedSeller = (data) => {
  return {
    type: UserActionsTypes.REPORTED_SELLER,
    payload: data,
  };
};

const reportSeller = (data) => {
  return {
    type: UserActionsTypes.GET_REPORT_SELLER,
    payload: data,
  };
};

const setEntrySellerInfo = (seller) => {
  return {
    type: UserActionsTypes.SET_ENTRY_SELLER_INFO,
    payload: seller
  };
};

const setEntryNote = (note) => {
  return {
    type: UserActionsTypes.SET_ENTRY_NOTE,
    payload: note
  };
};

const closeEntryNote = () => {
  return {
    type: UserActionsTypes.EMPTY_ENTRY_NOTE,
  };
};

const getSellers = (sellers) => {
  return {
    type: UserActionsTypes.GET_SELLERS, payload: sellers
  };
};

const newEntrySeller = (entrySeller) => {
  return {
    type: UserActionsTypes.NEW_ENTRY_SELLER,
    payload: entrySeller,
  };
};

const currentPage = (page) => {
  return {
    type: UserActionsTypes.SELLERS_CURRENT_PAGE,
    payload: page,
  };
};

const totalSellerCount = (count) => {
  return {
    type: UserActionsTypes.ALL_SELLERS_COUNT,
    payload: count,
  };
};

const setEntrySeller = (seller) => {
  return {
    type: UserActionsTypes.SET_ENTRY_SELLER,
    payload: seller
  };
};

const updatedNote = (note) => {
  return {
    type: UserActionsTypes.UPDATE_ENTRY_NOTE,
    payload: note,
  };
};

const loading = (actionType, boolean) => {
  return {
    type: actionType, payload: boolean
  };
};

export const SellersActions = {
  GetInitialSellersData,
  onExpandSellerRow,
  EditModalCancel,
  closeReportModal,
  EditModalOpen,
  onClickReportBtn,
  getSellerInfo,
  EditNote,
  onChangeTabs,
  onChangeFilterDate,
  onChangeFilterTime,
  editSellerInfo,
  downloadReportSeller,
  sendCurrentPage,
  sendReport,
  createSellerNotes,
  closeEntryNote,
  editSellerNotes,
  deleteSellerNotes,
};
