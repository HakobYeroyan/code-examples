import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useFormik} from "formik";
import store from "store";

import {shareTaxNextStep, shareTaxPrevStep} from "../../../../actions/shareTax";

// utils
import i18n from '../../../../i18n';

// styles
import styles from './Deductions.module.scss';

// components
import Back from "../../../../components/common/form/Back";
import RadioButton from "../../../../components/common/form/RadioButton";
import Input from "../../../../components/common/form/Input";
import Icon from "../../../../icons/icon";
import Submit from "../../../../components/common/form/Submit";
import HelpText from "../../../../components/common/layout/HelpText";

// constants
import {das as dasContent, fiscalYearEnd} from "../../../../constants/helpTexts";

import {maxDay, numberFieldValidation, numberRegexp} from "../../../../constants/helperExpressions";


const Deductions = ({data, dataLocalStorage, step}) => {
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.loaderMiddlewareReducer);

  const language = useSelector(state => state.languageReducer);
  const lang = i18n[language].deductions;
  const langHelpTexts = i18n[language].helpTexts;

  const yearend_year = dataLocalStorage?.yearend?.split?.('-')[0] ?? data?.yearend?.split?.('-')[0];
  const yearend_month = dataLocalStorage?.yearend?.split?.('-')[1] ?? data?.yearend?.split?.('-')[1];
  const yearend_day = dataLocalStorage?.yearend?.split?.('-')[2] ?? data?.yearend?.split?.('-')[2];

  const dasLang = dasContent(langHelpTexts);
  const fiscalYearEndLang = fiscalYearEnd(langHelpTexts);
  const [timezone, setTimezone] = useState('');

  const [fields, setFields] = useState({
    das: dataLocalStorage?.das ?? data?.das ?? '',
    income_tax: dataLocalStorage?.income_tax ?? data?.income_tax ?? '',
    minutebook: dataLocalStorage?.minutebook ?? data?.minutebook ?? language=='en'? 'English' : 'French',
    day: yearend_day ?? '',
    month: yearend_month ?? '',
    year: yearend_year ?? ''
  });


  const {month, day, year, das, income_tax, minutebook, yearend} = fields;

  useEffect(() => {
    if ('Intl' in window) {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  });

  const handleSubmitForm = () => {
    if(!loading) {
      const filteredDay = day.toString().length < 2 ? `0${day}` : day;
      const filteredMonth = month.toString().length < 2 ? `0${month}` : month;

      dispatch(shareTaxNextStep({
        das,
        income_tax,
        minutebook,
        yearend: `${year}-${filteredMonth}-${filteredDay}`,
        id: store.get("SendDataId"),
        timezone
      }, 'corporation/step_three/page_three', step));
    }
  };


  const {handleSubmit, errors, setFieldValue, touched} = useFormik({
    initialValues: {
      month,
      day,
      year,
      das,
      income_tax,
      minutebook,
      yearend
    },

    validateOnChange: false,
    validateOnMount: false,

    onSubmit: () => {
      handleSubmitForm();
    },

    validate: values => {
      const errors = {};

      if(!das) {
        errors.das = lang.errMessage;
      }

      if(!income_tax) {
        errors.income_tax = lang.errMessage;
      }

      if(!minutebook) {
        errors.minutebook = lang.errMessage;
      }

      if(!day || (+day > maxDay(month, year))) {
        errors.day = 'DD';
      }

      if(!month || +month > 12) {
        errors.month = 'MM';
      }

      if(!year) {
        errors.year = 'YYYY';
      }

      return errors;
    }
  });


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

  const toggleChange = (e) => {
    const {name, value} = e.target;
    setFieldValue(name, value);
    setFields(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleBackClick = () => {
    dispatch(shareTaxPrevStep(step));
  }

  return (
    <>
      <Back handleClick={handleBackClick} classes={styles['Deduction__back-btn']}/>
      <form className={styles['Deduction-form']} onSubmit={handleSubmit}>
        <div className={`${styles['Deduction-form__formGroup']} ${styles['Deduction-form__formGroup_DAS']}`}>
          <div className={styles['Deduction-form__question']}>
            <span>{lang.question1}</span>
            <button type="button" className={styles['Deduction-form__faq']}>
              <Icon name="faq-icon" />
            </button>
            <HelpText
              className={styles['Deduction-form__formGroup_DAS_helpText']}
              content={dasLang}
            />
          </div>
          <div className={styles['Deduction-form__radioRow']}>
            <RadioButton
              wrapperClassName={styles['Deduction-form__DAS_radio']}
              label={lang.yes}
              name="das"
              value="1"
              handleChange={toggleChange}
              id="das1"
              isChecked={das === '1'}
            />
            <RadioButton
              wrapperClassName={styles['Deduction-form__DAS_radio']}
              label={lang.no}
              name="das"
              value="0"
              handleChange={toggleChange}
              id="das0"
              isChecked={das === '0'}
            />
            <RadioButton
              wrapperClassName={styles['Deduction-form__DAS_radio']}
              label={lang.more}
              name="das"
              value="2"
              handleChange={toggleChange}
              id="das2"
              isChecked={das === '2'}
            />
          </div>
          {errors.das && <p className="errorMessage">{errors.das}</p>}
        </div>
        <div className={`${styles['Deduction-form__formGroup']} ${styles['Deduction-form__formGroup_incomeTax']}`}>
          <p className={styles['Deduction-form__question']}>
            <span>{lang.question2}</span>
          </p>
          <div className={styles['Deduction-form__radioRow']}>
            <RadioButton
              wrapperClassName={styles['Deduction-form__incomeTax_radio']}
              label={lang.yes}
              name="income_tax"
              value="1"
              handleChange={toggleChange}
              id="income_tax1"
              isChecked={income_tax === '1'}
            />
            <RadioButton
              wrapperClassName={styles['Deduction-form__incomeTax_radio']}
              label={lang.no}
              name="income_tax"
              value="0"
              handleChange={toggleChange}
              id="income_tax0"
              isChecked={income_tax === '0'}
            />
            <RadioButton
              wrapperClassName={styles['Deduction-form__incomeTax_radio']}
              label={lang.more}
              name="income_tax"
              value="2"
              handleChange={toggleChange}
              id="income_tax2"
              isChecked={income_tax === '2'}
            />
          </div>
          {errors.income_tax && <p className="errorMessage">{errors.income_tax}</p>}
        </div>
        <div className={styles['Deduction-form__divider']} style={{margin: '17px 0 21px'}} />
        <div className={`${styles['Deduction-form__formGroup']} ${styles['Deduction-form__formGroup_minuteBook']}`}>
          <p className={styles['Deduction-form__descriptionGroup']}>
            <span className={styles['Deduction-form__description']}>
              {lang.minuteBook}
            </span>
            <span className={styles['Deduction-form__subDescription']}>
                {lang.selectLanguage} 
            </span>
          </p>
          <div className={styles['Deduction-form__radioRow']}>
            <RadioButton
              wrapperClassName={styles['Deduction-form__minuteBox_radio']}
              label={lang.english}
              name="minutebook"
              value="English"
              handleChange={toggleChange}
              isChecked={minutebook === 'English'}
            />
            <RadioButton
              wrapperClassName={styles['Deduction-form__minuteBox_radio']}
              label={lang.french}
              name="minutebook"
              value="French"
              handleChange={toggleChange}
              isChecked={minutebook === 'French'}
            />
          </div>
          {errors.minutebook && <p className="errorMessage">{errors.minutebook}</p>}
        </div>
        <div className={styles['Deduction-form__divider']} style={{margin: '22px 0 11px'}} />
        <div className={`${styles['Deduction-form__fiscal']}`}>
          <p className={styles['Deduction-form__descriptionGroup']}>
            <span className={styles['Deduction-form__description']}>
              {lang.yearEnd}
            </span>
            <span className={styles['Deduction-form__subDescription']}>
                {lang.yearEndAbout}
            </span>
          </p>
          <div className={styles['Deduction-form__dataPicker']}>
            <div className={styles['Deduction-form__dataPicker_fields']}>
              {/* TODO: create custom styles for these fields */}
              <Input
                label={lang.DD}
                wrapperClassname={`${styles['Deduction-form__dataPicker_field']} ${styles['Deduction-form__dataPicker_field_day']}`}
                name="day"
                handleChange={handleNumberChange}
                type="text"
                value={day}
                error={errors.day}
                touched={touched.day}
              />
              <Input
                label={lang.MM}
                wrapperClassname={`${styles['Deduction-form__dataPicker_field']} ${styles['Deduction-form__dataPicker_field_month']}`}
                name="month"
                handleChange={handleNumberChange}
                type="text"
                value={month}
                error={errors.month}
                touched={touched.month}
              />
              <Input
                label={lang.YYYY}
                wrapperClassname={`${styles['Deduction-form__dataPicker_field']} ${styles['Deduction-form__dataPicker_field_year']}`}
                name="year"
                handleChange={handleNumberChange}
                type="text"
                value={year}
                error={errors.year}
                touched={touched.year}
              />
            </div>
            <div className={styles['Deduction-form__dataPicker_help']}>
              <button type="button" className={styles['Deduction-form__faq']}>
                <Icon name="faq-icon" />
              </button>
              <HelpText
                className={styles['Deduction-form__dataPicker_help_helpText']}
                content={fiscalYearEndLang}
              />
              <span>{lang.fiscalYearEnd}</span>
            </div>
          </div>
        </div>
        <div className={styles['Deduction-form__divider']} style={{margin: '22px 0 56px'}} />
        <Submit
          classes={styles['Deduction-form__submit']}
          label={lang.continue}
          icon="chevron-right"
          type="danger"
          height={45}
          padding={25}
          isDisabled={loading}
        />
      </form>
    </>
  );
};

export default Deductions;
