import {combineReducers} from 'redux';
import {UserActionsTypes} from 'store/types';

/* Reducers */
import AuthReducer from 'store/reducers/auth.reducer';
import AccountSettingsReducer from 'store/reducers/account.settigns.reducer';
import SignUpProcessReducer from 'store/reducers/signUpProcess.reducer';
import ProductsReducer from 'store/reducers/products.reducer';
import AdminRetailersReducer from 'store/reducers/admin.retailers.reducer';
import AdminStatisticsReducer from 'store/reducers/admin.statistics.reducer';
import AdminCustomersReducer from 'store/reducers/admin.customers.reducer';
import AdminSupportReducer from 'store/reducers/admin.support.reducer';
import AdminSellersReducer from 'store/reducers/admin.sellers.reducer';
import AdminCouponsReducer from 'store/reducers/admin.coupon.reducer';
import MapViolationsReducer from 'store/reducers/map.violations.reducer';
import ScrappingSettingsReducer from 'store/reducers/scrapping.settings.reducer';
import DashboardReducer from 'store/reducers/dashboard.reducer';
import SellersReducer from 'store/reducers/sellers.reducer';
import SupportReducer from 'store/reducers/support.reducer';
import ChangeFrequencyReducer from 'store/reducers/change.frequency.reducer';

const appReducer = combineReducers({
  auth: AuthReducer,
  signUpProcess: SignUpProcessReducer,
  accountSettings: AccountSettingsReducer,
  dashboard: DashboardReducer,
  products: ProductsReducer,
  map: MapViolationsReducer,
  sellers: SellersReducer,
  supports: SupportReducer,
  changeFrequency: ChangeFrequencyReducer,
  scrappingSettings: ScrappingSettingsReducer,
  adminRetailers: AdminRetailersReducer,
  adminStatistics: AdminStatisticsReducer,
  adminCustomers: AdminCustomersReducer,
  adminSupport: AdminSupportReducer,
  adminSellers: AdminSellersReducer,
  adminCoupons: AdminCouponsReducer
});

// reset the state of a redux store
const rootReducer = (state, action) => {
  if (action.type === UserActionsTypes.LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
