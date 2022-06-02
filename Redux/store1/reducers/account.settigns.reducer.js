import { UserActionsTypes } from 'store/types';

const initialState = {
  firstLogged: false,
  user: {},
  scrappingSettings: {
    markets: [],
    scrapingSchedule: {},
    paidForSubscription: false,
    totalCost: 0,
    premiumMultiplyPrice: 0,
    cardNumberLast4: null,
  },
  emailTemplates: {
    list: [],
    listForReport: {},
    isLoading: false
  },
  notifications: {
    timeOfDay: [],
    emailsForAlert: [],
    status: true,
  },
  isLoading: false,
  isLoadingButton: false,
};

const AccountSettingsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case UserActionsTypes.LOADING_TEMPLATES:
      return {
        ...state,
        emailTemplates: {
          ...state.emailTemplates,
          isLoading: payload
        }
      };
    case UserActionsTypes.REGISTER_REQUEST_OR_LOGIN:
      return {
        ...state,
        isLoading: payload,
      };
    case UserActionsTypes.LOADING_BUTTON:
      return {
        ...state,
        isLoadingButton: payload,
      };
    case UserActionsTypes.SET_EMAIL_TEMPLATES:
      return {
        ...state,
        emailTemplates: {
          ...state.emailTemplates,
          list: [...payload]
        }
      };
    case UserActionsTypes.SET_LIST_FOR_REPORT:
      return {
        ...state,
        emailTemplates: {
          ...state.emailTemplates,
          listForReport: {...payload}
        }
      };
    case UserActionsTypes.SET_USER_NOTIFICATIONS:
      return {
        ...state,
        notifications: {
          timeOfDay: payload.timeOfDay,
          emailsForAlert: payload.emailsForAlert,
        }
      };
    case UserActionsTypes.UPDATE_USER_NOTIFICATIONS:
      return {
        ...state,
        notifications: {
          ...state.notifications,
          timeOfDay: payload.scrapingSchedule.timeOfDay,
          emailsForAlert: payload.emailsForAlert,
        }
      };
    case UserActionsTypes.REMOVE_ADDITIONAL_EMAIL:
      const updatedEmailsForAlert = state.notifications.emailsForAlert.filter(item => item._id !== payload);

      return {
        ...state,
        notifications: {
          ...state.notifications,
          emailsForAlert: updatedEmailsForAlert,
        }
      };
    case UserActionsTypes.UPDATE_ADDITIONAL_EMAIL:
      const updatedEmail = state.notifications.emailsForAlert.map(item => item._id === payload._id ? payload : item);

      return {
        ...state,
        notifications: {
          ...state.notifications,
          emailsForAlert: updatedEmail,
        }
      };
    default: return state;
  }
};

export default AccountSettingsReducer;
