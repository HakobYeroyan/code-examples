import {UserActionsTypes} from 'store/types';

const initialState = {
  statistics: {
    list: [],
    entry: {},
    isLoading: false
  },
  isLoading: false
};

const AdminStatisticsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case UserActionsTypes.GET_ADMIN_STATISTICS:
      return {
        ...state,
        statistics: {
          ...state.statistics,
          list: [...payload]
        },
      };
    default:
      return state;
  }
};

export default AdminStatisticsReducer;
