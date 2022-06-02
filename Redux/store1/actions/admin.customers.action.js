import {errorToastify, successToastify} from 'utils/notification';


//Services
import {AdminCustomersService} from 'services';

//actionTypes
import {UserActionsTypes} from 'store/types';

const initialCustomers = (name) => async (dispatch) => {
  try {
    dispatch(loadingCustomersData(true));
    const {response} = await AdminCustomersService.getAllCustomers(name);

    if (response.status !== undefined && response.status === false) {
      throw new Error(response.message);
    }

    dispatch(getCustomers(response.users));
  } catch (err) {
    console.log(err);
  }
    finally {
    dispatch(loadingCustomersData(false));
  }
};

const getCustomers = (customers) => {
  return {
    type: UserActionsTypes.GET_ADMIN_CUSTOMERS,
    payload: customers
  };
};

const initialCustomer = (id) => async (dispatch) => {
  try {
    const {response} = await AdminCustomersService.getCustomerById(id);

    if (response.status !== undefined && response.status === false) {
      throw new Error(response.message);
    }

    dispatch(getCustomer(response.user));
  } catch (err) {
    console.log(err);
  }

};

const createCustomer = (data, redirect) => async (dispatch) => {
  try {
    const { response } = await AdminCustomersService.createCustomer(data);

    if (!response.status) {
      throw new Error(response.message);
    }

    dispatch(initialCustomers());
    successToastify(response.message);

    redirect('/admin/customers');

  } catch (e) {
    e.message && errorToastify(e.message);
  }
};

const getCustomer = (customer) => {
  return {
    type: UserActionsTypes.GET_ADMIN_CUSTOMER,
    payload: customer
  };
};

const loadingCustomersData = (boolean) => {
  return {
    type: UserActionsTypes.LOADING_ADMIN_CUSTOMERS_DATA,
    payload: boolean
  };
};

export const AdminCustomersActions = {
  initialCustomers,
  initialCustomer,
  createCustomer
};
