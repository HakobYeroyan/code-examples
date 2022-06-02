import {UserActionsTypes} from 'store/types';

const initialState = {
  products: {
    list: [],
    entry: {},
    entrySeller: {},
    isLoading: false,
    isProductListEmpty: false,
    firstAddProduct: false,
    pagination: {
      limit: 10,
      skip: 0,
      allProductCount: 0,
    }
  },
  markets: {
    list: [],
    entry: {},
    allowAddedMarketsCount: 0,
    isLoading: false
  },
  analytics: {
    chartData: [],
    isLoading: false
  },
  isLoading: false,
  isRequested: false,
};

const ProductsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case UserActionsTypes.GET_MARKETPLACES_PRODUCTS:
      return {
        ...state,
        markets: {
          ...state.markets,
          list: [...payload]
        }
      };
    case UserActionsTypes.GET_PRODUCTS:
      return {
        ...state,
        products: {
          ...state.products,
          list: [...payload]
        },
        isRequested: true,
      };
    case UserActionsTypes.PRODUCT_CURRENT_PAGE:
      return {
        ...state,
        products: {
          ...state.products,
          pagination: {
            skip: payload,
            limit: 10,
          },
        },
      };
    case UserActionsTypes.ALL_PRODUCT_COUNT:
      return {
        ...state,
        products: {
          ...state.products,
          pagination: {
            ...state.products.pagination,
            allProductCount: payload,
          },
        },
      };
    case UserActionsTypes.EDIT_PRODUCTS:
      const newProducts = state.products.list.map((item) => item._id === payload._id ? payload : item);

      return {
        ...state,
        products: {
          ...state.products,
          list: newProducts,
        },
      };
    case UserActionsTypes.DELETE_ALL_PRODUCTS:
      return {
        ...state,
        products: {
          ...state.products,
          list: []
        }
      };
    case UserActionsTypes.GET_REPORT_PRODUCTS:
      return {
        ...state,
        reportData: payload,
      };
    case UserActionsTypes.SET_ENTRY_MARKET:
      return {
        ...state,
        markets: {
          ...state.markets,
          entry: {...payload}
        }
      };
    case UserActionsTypes.SET_ENTRY_CHANGED_PRODUCT:
      const newEntry = payload.find(elem => elem._id === state.products.entry._id);

      return {
        ...state,
        products: {
          ...state.products,
          list: payload,
          entry: newEntry,
        }
      };
    case UserActionsTypes.NEW_ENTRY_PRODUCTS:
      return {
        ...state,
        products: {
          ...state.products,
          list: payload,
        },
      };
    case UserActionsTypes.SET_ENTRY_PRODUCT:
      return {
        ...state,
        products: {
          ...state.products,
          entry: {...payload}
        }
      };
    case UserActionsTypes.SET_ENTRY_SELLER:
      return {
        ...state,
        products: {
          ...state.products,
          entrySeller: {...payload}
        }
      };
    case UserActionsTypes.LOADING_MARKETPLACES_PRODUCTS:
      return {
        ...state,
        markets: {
          ...state.markets,
          isLoading: payload
        }
      };
    case UserActionsTypes.LOADING_PRODUCTS:
      return {
        ...state,
        products: {
          ...state.products,
          isLoading: payload
        }
      };
    case UserActionsTypes.GET_ANALYTICS_DATA:
      return {
        ...state,
        analytics: {
          ...state.analytics,
          chartData: [...payload]
        }
      };
    case UserActionsTypes.LOADING_ANALYTICS_DATA:
      return {
        ...state,
        analytics: {
          ...state.analytics,
          isLoading: payload
        }
      };
    case UserActionsTypes.FIRST_ADD_PRODUCT:
      return {
        ...state,
        products: {
          ...state.products,
          firstAddProduct: payload
        }
      };
    case UserActionsTypes.ALLOW_MARKETS:
      return {
        ...state,
        markets: {
          ...state.markets,
          allowAddedMarketsCount: payload
        }
      };
    case UserActionsTypes.SET_ALL_PRODUCTS_EMPTY:
      return {
        ...state,
        products: {
          ...state.products,
          isProductListEmpty: true,
        },
      };
    default:
      return state;
  }
};

export default ProductsReducer;
