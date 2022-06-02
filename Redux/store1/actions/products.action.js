import {UserActionsTypes} from 'store/types';
import {errorToastify, successToastify} from 'utils/notification';
import {authCookie} from 'utils/auth';

import {DateTime} from 'luxon';

import Router from 'next/router';

//services
import {ProductsService, SellersService} from 'services';

const setInitialData = (router = null, productName = null, filteredRetailerId) => async (dispatch, getState) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_MARKETPLACES_PRODUCTS, true));
    dispatch(loading(UserActionsTypes.LOADING_PRODUCTS, true));
    dispatch(getAnalyticsData());
    const { map: { filterOptions, filterOptions: { date: { value }, time } } } = getState();
    let filterDate = {};
    if (router.query.startDate && router.query.endDate) {
      filterDate = { startDate: router.query.startDate, endDate: router.query.endDate};
    } else {
      filterDate = { ...value };
    }

    const { response } = await ProductsService.getInitialData(filterDate, filteredRetailerId, time ? time.value : 'all', 10, 0, productName);

    if (!response.status) {
      throw new Error(response.message);
    }

    const { listMarkets, products, marketCount, allProductCount } = response;
    const allowCount = marketCount - listMarkets.length;

    dispatch(setEntryProduct({}));
    dispatch(getMarket(listMarkets));
    dispatch(getProducts(products));
    dispatch(setAllowMarketsCount(allowCount));
    dispatch(initialFilterOptions(filterOptions));
    dispatch(totalProductCount(allProductCount));

    if (router) {
      const {query} = router;

      if (query.retailerId) {
        dispatch(selectMarket(query.retailerId));
      }

      if (query.productID) {
        const entry = products.find((prod) => prod._id === query.productID);
        dispatch(getEntryProduct(entry));
      }
    }

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loading(UserActionsTypes.LOADING_MARKETPLACES_PRODUCTS, false));
    dispatch(loading(UserActionsTypes.LOADING_PRODUCTS, false));
  }
};

const sendCurrentPage = (page, searchValue) => async (dispatch, getState) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_PRODUCTS, true));
    dispatch(currentPage(page));

    const { map: { filterOptions: { date: { value }, time } }, products: { markets: { entry: { _id } } } } = getState();

    const {response} = await ProductsService.getInitialData(value, _id, time ? time.value : 'all', 10, page, searchValue);

    if (!response.status) {
      throw new Error(response.message);
    }

    const {products, allProductCount} = response;

    dispatch(setEntryProduct({}));
    dispatch(getProducts(products));
    dispatch(totalProductCount(allProductCount));

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loading(UserActionsTypes.LOADING_PRODUCTS, false));
  }
};

const getFilteredData = (searchValue) => async (dispatch, getState) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_PRODUCTS, true));
    const { map: { filterOptions: { date: { value }, time } }, products: { markets: { entry: { _id } } } } = getState();

    const {response} = await ProductsService.getInitialData(value, _id, time ? time.value : 'all', 10, 0, searchValue);

    if (!response.status) {
      throw new Error(response.message);
    }

    const {products, allProductCount} = response;

    dispatch(setEntryProduct({}));
    dispatch(getProducts(products));
    dispatch(totalProductCount(allProductCount));

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

const onChangeTabs = (marketID, searchValue) => async (dispatch, getState) => {
  try {
    const { products: { products: { pagination: { allProductCount } } } } = getState();
    dispatch(totalProductCount(allProductCount));
    dispatch(setAllProductEmpty());
    dispatch(selectMarket(marketID));
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

const getAnalyticsData = () => async (dispatch) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_ANALYTICS_DATA, true));

    const {response} = await ProductsService.getAnalyticsData();

    if (!response.status) {
      throw new Error(response.message);
    }

    const {chartData} = response;

    dispatch(getChartData(chartData));

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loading(UserActionsTypes.LOADING_ANALYTICS_DATA, false));
  }
};

const setInitialDataAllProducts = (router = null) => async (dispatch) => {
  try {
    dispatch(getMarkets());

    const {response} = await ProductsService.getInitialDataAllProducts();

    if (!response.status) {
      throw new Error(response.message);
    }

    const {products} = response;

    dispatch(getProducts(products));

    if (router) {
      const {query} = router;

      if (query.retailerId) {
        dispatch(selectMarket(query.retailerId));
      }
    }

  } catch (err) {
    err.message && errorToastify(err.message);
  }
};

const getMarkets = () => async (dispatch) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_MARKETPLACES_PRODUCTS, true));

    const {response} = await ProductsService.getMarkets();

    if (!response.status) {
      throw new Error(response.message);
    }

    const {listMarkets, marketCount} = response;
    const allowCount = marketCount - listMarkets.length;

    dispatch(getMarket(listMarkets));
    dispatch(setAllowMarketsCount(allowCount));

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loading(UserActionsTypes.LOADING_MARKETPLACES_PRODUCTS, false));
  }
};

const getChartData = (chartData) => {
  return {
    type: UserActionsTypes.GET_ANALYTICS_DATA,
    payload: chartData
  };
};

const setAllowMarketsCount = (count) => {
  return {
    type: UserActionsTypes.ALLOW_MARKETS,
    payload: count
  };
};

const selectMarket = (_id) => async (dispatch, getState) => {
  try {
    const {products: {markets: {list}}} = getState();
    const entry = list.find((item) => _id === item._id);

    if (_id !== 'all' && !entry) {
      Router.push('/products/all');
    }

    dispatch(setEntryMarket(entry));
  } catch (err) {
    err.message && errorToastify(err.message);
  }
};

const deleteProduct = (_id) => async (dispatch, getState) => {
  try {
    const {products: {products: {list, pagination: {skip}}}} = getState();
    const whenErrorAddThisProd = list.find((prod) => prod._id === _id);
    const findAndDeleteProd = [...list].filter((prod) => prod._id !== _id);

    dispatch(getProducts(findAndDeleteProd));

    const {response} = await ProductsService.deleteProduct({productId: _id});

    if (!response.status) {
      dispatch(getProducts([...list, whenErrorAddThisProd]));
      throw new Error(response.message);
    }

    dispatch(getMarkets());
    dispatch(sendCurrentPage(skip));

    successToastify(response.message);

  } catch (err) {
    err.message && errorToastify(err.message);
  }
};

const removeAllProducts = (_id) => async (dispatch) => {
  try {

    dispatch(getAllProducts());
    const {response} = await ProductsService.deleteAllProducts(_id);

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(getMarkets());

    successToastify(response.message);

  } catch (err) {
    err.message && errorToastify(err.message);
  }
};

const onClickEditBtnProducts = (_id) => async (dispatch, getState) => {
  const {products: {products: {list}}} = getState();
  const entry = list.find((prod) => prod._id === _id);

  dispatch(getEntryProduct(entry));
};

const getEntryProduct = (entry = {}) => {
  return {
    type: UserActionsTypes.SET_ENTRY_PRODUCT,
    payload: entry
  };
};

const saveEditedProducts = (product) => async (dispatch) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_PRODUCTS, true));

    const {response} = await ProductsService.editProductSave({productId: product._id, product});

    if (!response.status) {
      throw new Error(response.message);
    }

    const {updateProduct} = response;

    successToastify(response.message);

   dispatch(editProduct(updateProduct));

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loading(UserActionsTypes.LOADING_PRODUCTS, false));
  }
};

const initialDataAllProduct = (router, name, filteredRetailerId) => async (dispatch) => {
  dispatch(setInitialData(router, name, filteredRetailerId));
};

const addProducts = (products, redirect) => async (dispatch) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_PRODUCTS, true));
    const {response} = await ProductsService.createProducts(products);

    if (!response.status) {
      throw new Error(response.message);
    }

    successToastify(response.message);
    dispatch(getProducts(response.products || []));
    dispatch(firstLogged(redirect));
    dispatch(setFirstAddProduct(response.isFirstProduct));

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loading(UserActionsTypes.LOADING_PRODUCTS, false));
  }
};

const downloadReportProduct = (data) => async (dispatch) => {
  try {
    const {response} = await ProductsService.productReport(data);

    if (!response) {
      throw new Error(response.message);
    }

    dispatch(reportProduct(response));

  } catch (err) {
    err.message && errorToastify(err.message);
  }
};

const reportProduct = (data) => {
  return {
    type: UserActionsTypes.GET_REPORT_PRODUCTS,
    payload: data,
  };
};

const onClickSellerName = (entry, redirect) => async (dispatch) => {
  try {
    dispatch(setEntrySeller(entry));
    const startDate = DateTime.fromJSDate(new Date(entry.createdAt)).toFormat('yyyy-MM-dd');
    const endDate = DateTime.local().toFormat('yyyy-MM-dd');

    redirect({
      pathname: '/products',
      query: entry && entry._id ? {action: 'edit', sellerID: entry._id, productID: entry.productID, startDate, endDate} : {}
    });

  } catch (err) {
    err.message && errorToastify(err.message);
  }
};

const closeSellerModal = (redirect) => async (dispatch) => {
  try {
    dispatch(setEntrySeller({}));
    redirect('/products');

  } catch (e) {
    console.log(e.message);
  }
};

const onExpandProductRow = (_id) => async (dispatch, getState) => {
  try {
    const {products: {products: { list, entry: updatedEntry } } } = getState();
    const entry = list.find((item) => _id === item._id);
    const newList = list.map(item => item._id === updatedEntry._id ? updatedEntry : item);

    dispatch(setEntryProduct(entry));
    dispatch(newEntryProducts(newList));

  } catch (err) {
    err.message && errorToastify(err.message);
  }
};

const editSellerInfoProducts = (data, redirect) => async (dispatch, getState) => {
  try {
    const { sellers: { sellers: { entrySellerInfo: { sellerId } } } } = getState();
    const { products: { products: { list } } } = getState();

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
    redirect('/products');

  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const getMarket = (markets) => {

  return {
    type: UserActionsTypes.GET_MARKETPLACES_PRODUCTS, payload: [...markets]
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

const setAllProductEmpty = () => {
  return {
    type: UserActionsTypes.SET_ALL_PRODUCTS_EMPTY,
  };
};

const initialFilterOptions = filterOptions => ({
  type: UserActionsTypes.GET_INITIAL_FILTER_OPTIONS,
  payload: filterOptions
});

const firstLogged = (redirect) => async (dispatch, getState) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_PRODUCTS, false));
    const { products: { markets: { entry: { _id } } } } = await getState();
    const {response} = await ProductsService.firstLogged();

    if (!response.status) {
      throw new Error(response.message);
    }

    const cookieData = authCookie.getDataJson('user');

    if (cookieData) {
      cookieData.firstLogged = true;
      await authCookie.setData('user', cookieData);
      dispatch({type: UserActionsTypes.LOGIN_SUCCESS, payload: {...cookieData}});
    }

    redirect('/products');

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loading(UserActionsTypes.LOADING_PRODUCTS, false));
  }
};

const newEntryProducts = (entrySeller) => {
  return {
    type: UserActionsTypes.NEW_ENTRY_PRODUCTS,
    payload: entrySeller,
  };
};

const setEntryChangedProduct = (seller) => {
  return {
    type: UserActionsTypes.SET_ENTRY_CHANGED_PRODUCT,
    payload: seller
  };
};

const setFirstAddProduct = (firstAddProduct) => {
  return {
    type: UserActionsTypes.FIRST_ADD_PRODUCT,
    payload: firstAddProduct
  };
};

const getProducts = (products) => {
  return {
    type: UserActionsTypes.GET_PRODUCTS, payload: [...products]
  };
};

const editProduct = (product) => {
  return {
    type: UserActionsTypes.EDIT_PRODUCTS, payload: product
  };
};

const getAllProducts = (products) => {
  return {
    type: UserActionsTypes.DELETE_ALL_PRODUCTS,
  };
};

const currentPage = (page) => {
  return {
    type: UserActionsTypes.PRODUCT_CURRENT_PAGE,
    payload: page,
  };
};

const totalProductCount = (count) => {
  return {
    type: UserActionsTypes.ALL_PRODUCT_COUNT,
    payload: count,
  };
};

const setEntryMarket = (entry) => {
  return {
    type: UserActionsTypes.SET_ENTRY_MARKET, payload: entry
  };
};

const loading = (actionType, boolean) => {
  return {
    type: actionType, payload: boolean
  };
};

export const ProductsAction = {
  setInitialData,
  setInitialDataAllProducts,
  selectMarket,
  addProducts,
  firstLogged,
  initialDataAllProduct,
  deleteProduct,
  removeAllProducts,
  onClickEditBtnProducts,
  getEntryProduct,
  saveEditedProducts,
  onExpandProductRow,
  onClickSellerName,
  closeSellerModal,
  onChangeFilterDate,
  onChangeFilterTime,
  onChangeTabs,
  downloadReportProduct,
  sendCurrentPage,
  editSellerInfoProducts,
  setFirstAddProduct,
};
