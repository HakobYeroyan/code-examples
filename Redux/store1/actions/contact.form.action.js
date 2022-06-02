import {successToastify, errorToastify} from 'utils/notification';

//Services
import {ContactFormService} from 'services';

//actionTypes
import {UserActionsTypes} from 'store/types';


const contactFormData = (data) => async (dispatch) => {
  try {
    const { response } = await ContactFormService.contactForm(data);

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(contactFormInfo(data));

    successToastify(response.message);

  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const contactFormInfo = (data) => {
  return {
    type: UserActionsTypes.SET_CONTACT_FORM,
    payload: data
  };
};

export const ContactActions = {
  contactFormData,
};
