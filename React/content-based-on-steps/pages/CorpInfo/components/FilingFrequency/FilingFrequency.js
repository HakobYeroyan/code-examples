import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {corpInfoNextStep, corpInfoPrevState} from "../../../../actions/corpInfo";
import store from "store";
import {withRouter} from 'react-router-dom';
import {useFormik} from "formik";

import i18n from '../../../../i18n';
//styles
import styles from './FilingFrequency.module.scss';
import RadioButton from "../../../../components/common/form/RadioButton";

// components
import Back from "../../../../components/common/form/Back";
import SwitchButton from "../../../../components/common/form/SwitchButton";
import Icon from "../../../../icons/icon";
import Input from "../../../../components/common/form/Input";
import Submit from "../../../../components/common/form/Submit";
import HelpText from "../../../../components/common/layout/HelpText";

// constants
import {fillingFrequency, shareStructure} from "../../../../constants/helpTexts";

// helper expressions
import {numberFieldValidation, numberRegexp} from "../../../../constants/helperExpressions";

const FilingFrequency = (props) => {
  const {data, step, dataLocalStorage} = props;
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.loaderMiddlewareReducer);

  const language = useSelector(state => state.languageReducer);
  const lang = i18n[language].filingFrequency;
  const langHelpTexts = i18n[language].helpTexts;
  const [timezone, setTimezone] = useState('');

  const fillingFrequencyLang = fillingFrequency(langHelpTexts);
  const shareStructureLang = shareStructure(langHelpTexts);

  
  const setGstQst = () =>  {
    if(dataLocalStorage && dataLocalStorage.gst_qst) {
      return Boolean(Number(dataLocalStorage?.gst_qst));
    }

    if(data && data.gst_qst) {
      return Boolean(Number(data?.gst_qst));
    }

    return true;
  }

  const [fields, setFields] = useState({
    gst_qst: setGstQst(),
    gst_frequency: dataLocalStorage?.gst_frequency ?? data?.gst_frequency ?? '',
    revenue: dataLocalStorage?.revenue ?? data?.revenue ?? '',
    estimating_sales: dataLocalStorage?.estimating_sales ?? data?.estimating_sales ?? '',
    shares: dataLocalStorage?.shares ?? data?.shares ?? ''
  });

  const {gst_qst, revenue, estimating_sales, gst_frequency, shares} = fields;


  useEffect(() => {
    if ('Intl' in window) {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  });

    const handleSubmitForm = () => {
    if(!loading) {
      if(!gst_qst) {
        dispatch(corpInfoNextStep({
          revenue,
          estimating_sales,
          shares: String(Number(shares)),
          gst_qst: String(Number(gst_qst)),
          id: store.get('SendDataId'),
          timezone
        }, 'corporation/step_three/page_one', step, true, props.history));
      } else {
        dispatch(corpInfoNextStep({
          revenue,
          estimating_sales,
          shares: String(Number(shares)),
          gst_qst: String(Number(gst_qst)),
          gst_frequency,
          id: store.get('SendDataId'),
          timezone
        }, 'corporation/step_three/page_one', step, true, props.history));
      }
    }
  }

  const {handleSubmit, errors, setFieldValue, touched} = useFormik({
    initialValues: {
      gst_qst,
      revenue,
      estimating_sales,
      gst_frequency,
      shares
    },

    onSubmit: () => {
      handleSubmitForm();
    },

    validateOnChange: false,
    validateOnMount: false,

    validate: values => {
      const errors = {};

      if(gst_qst) {
        if(!gst_frequency) {
          errors.gst_frequency = lang.PleaseChoose;
        }
      }
      if(!estimating_sales) {
        errors.estimating_sales = lang.PleaseChoose;
      }
      if(!shares) {
        errors.shares = lang.PleaseChoose;
      }
      if(!revenue) {
        errors.revenue = lang.estimatedRevenue;
      }

      return errors;
    }
  });

  const toggleChange = (e) => {
    const {name, checked} = e.target;
    setFieldValue(name, checked);
    setFields(prevState => ({
      ...prevState,
      gst_qst: !prevState.gst_qst
    }));
  };

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

  const toggleChangeRadio = (e) => {
    const {name, value} = e.target;
    setFieldValue(name, value);
    setFields(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleClick = () => {
    dispatch(corpInfoPrevState(step));
  }

  return (
    <>
      <Back handleClick={handleClick} classes={styles['FillingFrequency__back-btn']} />
      <form className={styles['FillingFrequency-form']} onSubmit={handleSubmit}>
        <div className={styles['FillingFrequency-form__top']}>
          <p className={styles['FillingFrequency-form__question']}>
              {lang.gst_qst}
          </p>
          <SwitchButton
            label={{prefix: lang.no, suffix: lang.yes}}
            name="gst_qst"
            checked={gst_qst}
            handleChange={toggleChange}
          />
        </div>
        {fields.gst_qst && <div
          className={`${styles['FillingFrequency-form__formGroup']} ${styles['FillingFrequency-form__filingFrequency']}`}>
          <div
            className={`${styles['FillingFrequency-form__secondaryQuestion']} ${styles['FillingFrequency-form__filingFrequency_question']}`}>
            <span>{lang.frequency}</span>
            <button type="button">
              <Icon name="faq-icon"/>
            </button>
            <HelpText
              content={fillingFrequencyLang}
              className={styles['FillingFrequency-form__filingFrequency_helpText']}
            />
          </div>
          <div className={styles['FillingFrequency-form__filingFrequency__radioRow']}>
            <RadioButton
              label={lang.quarterly}
              wrapperClassName={styles['FillingFrequency-form__filingFrequency__radio']}
              value="quarterly"
              name="gst_frequency"
              handleChange={toggleChangeRadio}
              isChecked={gst_frequency === 'quarterly'}
            />
            <RadioButton
              label={lang.monthly}
              wrapperClassName={styles['FillingFrequency-form__filingFrequency__radio']}
              value="monthly"
              name="gst_frequency"
              handleChange={toggleChangeRadio}
              isChecked={gst_frequency === 'monthly'}
            />
            <RadioButton
              label={lang.annually}
              wrapperClassName={styles['FillingFrequency-form__filingFrequency__radio']}
              value="annually"
              name="gst_frequency"
              handleChange={toggleChangeRadio}
              isChecked={gst_frequency === 'annually'}
            />
            {errors.gst_frequency && <p className="errorMessage">{errors.gst_frequency}</p>}
          </div>
        </div>}
        <div className={`${styles['FillingFrequency-form__formGroup']} ${styles['FillingFrequency-form__estimatedRevenue']}`}>
          <p className={`${styles['FillingFrequency-form__secondaryQuestion']}`}>
              {lang.revenue}
          </p>
          <Input
            wrapperClassname={styles['FillingFrequency-form__estimatedRevenue_input']}
            label={lang.estimatedRevenue}
            prefix="$"
            name="revenue"
            value={revenue}
            handleChange={handleNumberChange}
            error={errors.revenue}
            touched={touched.revenue}
            type="text"
          />
        </div>
        <div className={`${styles['FillingFrequency-form__formGroup']} ${styles['FillingFrequency-form__help']}`}>
          <p className={`${styles['FillingFrequency-form__secondaryQuestion']}`}>
              {lang.questionHelp}
          </p>
          <p className={styles['FillingFrequency-form__help_description']}>
              {lang.questionHelpAbout1}<br/>{lang.questionHelpAbout2}
          </p>
          <div className={styles['FillingFrequency-form__help_radioCol']}>
            <RadioButton
              label={lang.answer1}
              wrapperClassName={styles['FillingFrequency-form__help__radio']}
              value="1"
              name="estimating_sales"
              handleChange={toggleChangeRadio}
              isChecked={estimating_sales === '1'}
            />
            <RadioButton
              label={lang.answer2}
              wrapperClassName={styles['FillingFrequency-form__help__radio']}
              value="0"
              name="estimating_sales"
              handleChange={toggleChangeRadio}
              isChecked={estimating_sales === '0'}
            />
            {errors.estimating_sales && <p className="errorMessage">{errors.estimating_sales}</p>}
          </div>
        </div>
        <div className={`${styles['FillingFrequency-form__question']} ${styles['FillingFrequency-form__questionGroup']}`}>
          <span>{lang.questionShare}</span>
          <button type="button">
            <Icon name="faq-icon" />
          </button>
          <HelpText
            content={shareStructureLang}
            className={styles['FillingFrequency-form__questionGroup_helpText']}
          />
        </div>
        <div className={`${styles['FillingFrequency-form__formGroup']} ${styles['FillingFrequency-form__structure']}`}>
          <RadioButton
            label={lang.shareAnswer1}
            wrapperClassName={styles['FillingFrequency-form__help__radio']}
            value="1"
            name="shares"
            handleChange={toggleChangeRadio}
            isChecked={shares == '1'}
          />
          <RadioButton
            label={lang.shareAnswer2}
            wrapperClassName={styles['FillingFrequency-form__help__radio']}
            value="0"
            name="shares"
            handleChange={toggleChangeRadio}
            isChecked={shares == '0'}
          />
          {errors.shares && <p className="errorMessage">{errors.shares}</p>}
        </div>
        <Submit
          label={lang.next}
          type="danger"
          icon="chevron-right"
          height={45}
          padding={35}
          classes={styles['FillingFrequency-form__submit']}
          isDisabled={loading}
        />
      </form>
    </>
  );
};

export default withRouter(FilingFrequency);
