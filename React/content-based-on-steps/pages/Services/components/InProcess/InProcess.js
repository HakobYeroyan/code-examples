import React, {useState} from "react";
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {
  CardElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import store from 'store';
import axiosApi from "../../../../axiosApi";
// styles
import styles from './InProcess.module.scss';

import i18n from '../../../../i18n';

// components
import Input from "../../../../components/common/form/Input";
import Select from "../../../../components/common/form/Select";
import Submit from "../../../../components/common/form/Submit";
import Icon from "../../../../icons/icon";

import {servicesSetPageStateFailed, servicesSetPageStateSuccessful, servicesSetPageStateCart} from "../../../../actions/payment";
import {numberFieldValidation, numberRegexp} from "../../../../constants/helperExpressions";


const InProcess = () => {
  const dispatch = useDispatch();

  const language = useSelector(state => state.languageReducer);
  const lang = i18n[language].services;
  const provinces = Object.values(i18n[language].provinces);
  const toPay = lang.peyNow + " - $" + store.get('BillingDetails').total
  

  const [fields, setFields] = useState({
    address_line1: '',
    address_state: '',
    address_city: '',
    postal_code: ''
  });

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmitForm = async () => {

    try {
      const card = elements.getElement(CardElement);

      const {token, error} = await stripe.createToken(card, fields);

      const {data} = await axiosApi.post('payment', {card_token: token.id, id: store.get('SendDataId'), billing_details: store.get('BillingDetails')});

      if(data.status) {
        dispatch(servicesSetPageStateSuccessful());
      } else {
        dispatch(servicesSetPageStateFailed());
      }

    } catch (e) {
      dispatch(servicesSetPageStateFailed());
    }


  };

  const {address_city, address_line1, address_state, postal_code} = fields

  const {handleSubmit, errors, setFieldValue, touched} = useFormik({
    initialValues: {
      address_city,
      address_line1,
      address_state,
      postal_code
    },

    validateOnChange: false,
    validateOnMount: false,

    onSubmit: () => {
      handleSubmitForm();
    },

    validate: values => {
      const errors = {};

      if(!address_city.trim() || address_city.length > 40) {
        errors.address_city = 'City';
      }

      if(!address_line1.trim() || address_line1.length > 40) {
        errors.address_line1 = 'Address';
      }

      if(!address_state.trim() || address_state.length > 40) {
        errors.address_state = 'Province';
      }

      if(!postal_code.trim() || postal_code.length > 7) {
        errors.postal_code = 'Postal Code';
      }

      return errors;
    }
  });


  const handleChange = (e) => {
    const {name, value} = e.target;
    if(value === '' || value.length < 255) {
      setFieldValue(name, value);
      setFields(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSelectProvince = (name, value) => {
    setFieldValue(name, value);
    setFields(prevState => {
      return {
        ...prevState,
        [name]: value,
      }
    });
  }

  const handleNumberChange = (e) => {
    const {name, value} = e.target;
    const lengthValidation = numberFieldValidation(name, value.length);
    if(value === '' || (numberRegexp.test(value) && lengthValidation)) {
      setFieldValue(name, value);
      setFields(prevState => {
        return {
          ...prevState,
          [name]: value,
        }
      });
    }
  }

  const handleCancel = () => {
    dispatch(servicesSetPageStateCart());
  }

  return (
    <div className={styles['InProcess']}>
      <form onSubmit={handleSubmit} className={styles['InProcess-content']}>
        <div className={styles['InProcess-top']}>
          <h5 className={styles['InProcess-top__heading']}>
              {lang.paymentTitle}
          </h5>
          <button className={styles['InProcess-top__cancel']} onClick={handleCancel}>
            <Icon name="close-button-icon" />
          </button>
        </div>
        <div className={styles['InProcess-StripeFieldWrapper']}>
          <CardElement
            options={{
              style: {
                base: {
                  color: '#303238',
                  fontSize: '16px',
                  fontFamily: '"Open Sans", sans-serif',
                  fontSmoothing: 'antialiased',
                  '::placeholder': {
                    color: '#666b79',
                  },
                },
                invalid: {
                  color: '#e5424d',
                  ':focus': {
                    color: '#303238',
                  },
                },
              }
            }}
          />
        </div>

        <div className={styles['InProcess-additional']}>
          <h6 className={styles['InProcess-additional__heading']}>
              {lang.billingAddress}
          </h6>
          <div className={styles['InProcess-additional__fields']}>
            <Input
              wrapperClassname={styles['InProcess-additional__fields_field']}
              label={lang.address}
              handleChange={handleChange}
              name="address_line1"
              error={errors.address_line1}
              touched={touched.address_line1}
              value={address_line1}
            />
            
            <div className={`custom-select ${styles['InProcess-additional__fields_field']}`}>
              <Select
                  label={lang.province}
                  options={provinces}
                  value={address_state}
                  error={errors.address_state}
                  item=""
                  handleChange={(val) => handleSelectProvince('address_state', val)}
                />
            </div>

            <Input
              wrapperClassname={styles['InProcess-additional__fields_field']}
              label={lang.city}
              handleChange={handleChange}
              name="address_city"
              error={errors.address_city}
              touched={touched.address_city}
              value={address_city}
            />
            <Input
              wrapperClassname={styles['InProcess-additional__fields_field']}
              label={lang.postCode}
              handleChange={handleChange}
              type="text"
              name="postal_code"
              error={errors.postal_code}
              touched={touched.postal_code}
              value={postal_code}
            />
          </div>
        </div>

        <Submit
          label={toPay}
          type="danger"
          icon="chevron-right"
          classes={styles['InProcess-submit']}
          padding={13}
          height={37}
        />
      </form>
  </div>
  );
};

export default InProcess;
