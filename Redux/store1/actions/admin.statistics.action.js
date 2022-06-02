import {errorToastify} from 'utils/notification';

//Services
import {AdminStatisticsService} from 'services';

//actionTypes
import {UserActionsTypes} from 'store/types';

const initialStatistics = () => async (dispatch) => {
  try {
    const {response} = await AdminStatisticsService.getStatistics();

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(getStatistics(response.recentTransactions));
  } catch (err) {
    console.log(err);
  }

};

const getStatistics = (statistics) => {
  return {
    type: UserActionsTypes.GET_ADMIN_STATISTICS,
    payload: statistics
  };
};

export const AdminStatisticsActions = {
  initialStatistics
};
