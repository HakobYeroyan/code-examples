import {successToastify, errorToastify} from 'utils/notification';
import {DateTime} from 'luxon';

//Services
import {DashboardService} from 'services';

//actionTypes
import {UserActionsTypes} from 'store/types';

const loadingInitialDataForDashboard = () => async (dispatch, getState) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_MAP_VIOLATION_DATA_FOR_DASHBOARD, true));
    dispatch(getScrapSettingsData());
    const { map: { filterOptions, filterOptions: { date: { value }, time } } } = getState();

    const {response: dashboardDataRes} = await DashboardService.loadingInitialScrapSettings(value, time ? time.value : 'all');

    if (!dashboardDataRes.status) {
      throw new Error(dashboardDataRes.message);
    }

    const {mapViolationsList} = dashboardDataRes;

    dispatch(getMapViolationDashboard(mapViolationsList));
    dispatch(initialFilterOptions(filterOptions));

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loading(UserActionsTypes.LOADING_MAP_VIOLATION_DATA_FOR_DASHBOARD, false));
  }
};

const getMapViolationsForDashboard = () => async (dispatch, getState) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_MAP_VIOLATION_DATA_FOR_DASHBOARD, true));
    const { map: { filterOptions: { date, time } } } = getState();

    const {response: dashboardDataRes} = await DashboardService.loadingInitialScrapSettings(date.value, time ? time.value : 'all');

    if (!dashboardDataRes.status) {
      throw new Error(dashboardDataRes.message);
    }

    const {mapViolationsList} = dashboardDataRes;

    dispatch(getMapViolationDashboard(mapViolationsList));

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loading(UserActionsTypes.LOADING_MAP_VIOLATION_DATA_FOR_DASHBOARD, false));
  }
};

const getBrandStrengthCardData = () => async (dispatch, getState) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_BRAND_STRENGTH_DATA_FOR_DASHBOARD, true));

    const { map: { filterOptions: { date: { value }, time } } } = getState();

    const {response} = await DashboardService.brandStrengthCard(value, time ? time.value : 'all');

    if (!response.status) {
      throw new Error(response.message);
    }

    const {brandStrength} = response;

    dispatch({type: UserActionsTypes.GET_BRAND_STRENGTH_DATA_FOR_DASHBOARD, payload: brandStrength});

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loading(UserActionsTypes.LOADING_BRAND_STRENGTH_DATA_FOR_DASHBOARD, false));
  }
};


const loadingDailyReportData = () => async (dispatch) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_DAILY_REPORTS_MAP_VIOLATION_DATA_FOR_DASHBOARD, true));

    const {response: dailyReportRes} = await DashboardService.dailyReports();

    if (!dailyReportRes.status) {
      throw new Error(dailyReportRes.message);
    }

    const {reportsStats, dailyReportsMapViolations} = dailyReportRes;

    dispatch(getDailyReportViolationDashboard(dailyReportsMapViolations));
    dispatch(getDashboardReportStats(reportsStats));

  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loading(UserActionsTypes.LOADING_DAILY_REPORTS_MAP_VIOLATION_DATA_FOR_DASHBOARD, false));
  }
};

const getDashboardReportStats = (stats) => {
  return {
    type: UserActionsTypes.GET_STATS_DASHBOARD,
    payload: stats
  };
};

const getMapViolationDashboard = (mapViolations) => {
  return {
    type: UserActionsTypes.GET_MAP_VIOLATION_DATA_FOR_DASHBOARD,
    payload: mapViolations
  };
};

const getDailyReportViolationDashboard = (dailyReportMapViolations) => {
  return {
    type: UserActionsTypes.GET_DAILY_REPORTS_MAP_VIOLATION_DATA_FOR_DASHBOARD,
    payload: dailyReportMapViolations
  };
};

const getScrapSettingsData = () => async (dispatch) => {
  try {
    dispatch(loading(UserActionsTypes.LOADING_SETTINGS_DATA_FOR_DASHBOARD, true));

    const {response: scrapingSettingsData} = await DashboardService.scrapingSettings();

    if (!scrapingSettingsData.status) {
      throw new Error(scrapingSettingsData.message);
    }

    const {scraps, selFrequency} = scrapingSettingsData;

    dispatch({
      type: UserActionsTypes.GET_SCRAP_SETTINGS_DATA_FOR_DASHBOARD,
      payload: {scraps, frequency: selFrequency}
    });
  } catch (err) {
    err.message && errorToastify(err.message);
  } finally {
    dispatch(loading(UserActionsTypes.LOADING_SETTINGS_DATA_FOR_DASHBOARD, false));
  }
};

const onChangeFilterDate = (date) => async (dispatch) => {
  try {
    dispatch(setFilterDate(date));
    dispatch(getMapViolationsForDashboard());
  } catch (err) {
    err.message && errorToastify(err.message);
  }
};

const onChangeFilterTime = (time) => async (dispatch) => {
  try {
    dispatch(setFilterTime(time));
    dispatch(getMapViolationsForDashboard());
  } catch (err) {
    err.message && errorToastify(err.message);
  }
};

const initialFilterOptions = filterOptions => ({
  type: UserActionsTypes.GET_INITIAL_FILTER_OPTIONS,
  payload: filterOptions
});

const setFilterDate = (date) => {
  return {
    type: UserActionsTypes.SET_FILTER_DATE,
    payload: { ...date }
  };
};

const setFilterTime = (time) => {
  return {
    type: UserActionsTypes.SET_FILTER_TIME,
    payload: time,
  };
};

const loading = (actionType, boolean) => {
  return {
    type: actionType, payload: boolean
  };
};

export const DashboardActions = {
  loadingInitialDataForDashboard,
  loadingDailyReportData,
  getScrapSettingsData,
  getBrandStrengthCardData,
  getMapViolationsForDashboard,
  onChangeFilterDate,
  onChangeFilterTime,
};
