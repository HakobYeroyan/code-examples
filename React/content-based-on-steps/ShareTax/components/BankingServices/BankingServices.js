import React, {useEffect, useState} from "react";
import store from "store";
import {useDispatch, useSelector} from "react-redux";
import {useFormik} from "formik";

import i18n from '../../../../i18n';

import {shareTaxNextStep, shareTaxPrevStep} from "../../../../actions/shareTax";

// styles
import styles from './BankingServices.module.scss';

// components
import Back from "../../../../components/common/form/Back";
import RadioButton from "../../../../components/common/form/RadioButton";
import Input from "../../../../components/common/form/Input";
import Submit from "../../../../components/common/form/Submit";

const BankingServices = ({data, dataLocalStorage, step}) => {
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.loaderMiddlewareReducer);

  const language = useSelector(state => state.languageReducer);
  const lang = i18n[language].bankingServices;

  const [questions, setQuestions] = useState({
    banking: dataLocalStorage?.chosenBanking ?? data?.chosenBanking ?? null,
    accounting: dataLocalStorage?.chosenAccounting ?? data?.chosenAccounting ?? null
  });
  const [timezone, setTimezone] = useState('');

  const {banking: chosenBanking, accounting: chosenAccounting} = questions;

  useEffect(() => {
    if ('Intl' in window) {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  });

  const handleSubmitForm = () => {
    if(!loading) {

      dispatch(shareTaxNextStep({
        banking: !chosenBanking ? '0' : '1',
        accounting: !chosenAccounting ? '0' : '1',
        id: store.get('SendDataId'),
        timezone
      }, 'corporation/step_four/page_one', step))
          .then(() => {
            const stepsDataStorage = store.get('stepsData');
            stepsDataStorage.shareTax[2].chosenBanking = chosenBanking;
            stepsDataStorage.shareTax[2].chosenAccounting = chosenAccounting;
            store.set('stepsData', stepsDataStorage);
          });
    }
  }

  const {handleSubmit, errors, setFieldValue, touched} = useFormik({
    initialValues: {
      chosenBanking,
      chosenAccounting
    },

    validateOnChange: false,
    validateOnMount: false,

    onSubmit: () => {
      handleSubmitForm();
    },

    validate: values => {
      const errors = {};

      if(chosenBanking === null) {
        errors.chosenBanking = lang.selectOpt;
      }
      if(chosenAccounting === null) {
        errors.chosenAccounting = lang.selectOpt;
      }
      return errors;
    },
  });

  const toggleChange = (e) => {
    const {name, value} = e.target;
    setQuestions(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleBackClick = () => {
    dispatch(shareTaxPrevStep(step));
  }


  return (
    <>
      <Back handleClick={handleBackClick} classes={styles['BankingServices__back-btn']} />
      <div className={styles['BankingServices-divider']} style={{margin: '17px 0'}} />
      <form className={styles['BankingServices-form']} onSubmit={handleSubmit}>
        <div className={`${styles['BankingServices-form__formGroup']} ${styles['BankingServices-form__formGroup_banking']}`}>
          <p className={styles['BankingServices-form__question']}>
              {lang.question1}
          </p>
          <p className={styles['BankingServices-form__subQuestion']}>
              {lang.question1About}
          </p>
          <div className={styles['BankingServices-form__radioRow']}>
            <RadioButton
              wrapperClassName={styles['BankingServices-form__radio']}
              label={lang.yes}
              name="banking"
              handleChange={toggleChange}
              value={true}
              id="banking1"
              isChecked={chosenBanking === true}
            />
            <RadioButton
              wrapperClassName={styles['BankingServices-form__radio']}
              label={lang.no}
              name="banking"
              handleChange={toggleChange}
              value={false}
              id="banking0"
              isChecked={chosenBanking === false}
            />
          </div>
          {errors.chosenBanking && <p style={{color: 'red', fontSize: '14px'}}>{errors.chosenBanking}</p>}
        </div>
        <div className={styles['BankingServices-divider']} style={{margin: '26px 0 20px'}} />
        <div className={`${styles['BankingServices-form__formGroup']} ${styles['BankingServices-form__formGroup_accounting']}`}>
          <p className={styles['BankingServices-form__question']}>
              {lang.question2}
          </p>
          <div className={styles['BankingServices-form__radioRow']}>
            <RadioButton
              wrapperClassName={styles['BankingServices-form__radio']}
              label={lang.yes}
              name="accounting"
              handleChange={toggleChange}
              value={true}
              id="accounting1"
              isChecked={chosenAccounting === true}
            />
            <RadioButton
              wrapperClassName={styles['BankingServices-form__radio']}
              label={lang.no}
              name="accounting"
              handleChange={toggleChange}
              value={false}
              id="accounting0"
              isChecked={chosenAccounting === false}
            />
          </div>
          {errors.chosenAccounting && <p style={{color: 'red', fontSize: '14px'}}>{errors.chosenAccounting}</p>}
        </div>
        <Submit
          classes={styles['BankingServices-form__submit']}
          label={lang.continue}
          type="danger"
          icon="chevron-right"
          height={45}
          padding={25}
          isDisabled={loading}
        />
      </form>
    </>
  );
};

export default BankingServices;
