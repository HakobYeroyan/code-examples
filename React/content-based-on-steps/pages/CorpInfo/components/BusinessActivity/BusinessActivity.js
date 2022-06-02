import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useFormik} from "formik";
import {corpInfoNextStep} from '../../../../actions/corpInfo';
import {withRouter} from 'react-router-dom';
import store from "store";

// styles
import styles from './BusinessActivity.module.scss';

// components
import Back from "../../../../components/common/form/Back";
import Input from "../../../../components/common/form/Input";
import RadioButton from "../../../../components/common/form/RadioButton";
import Submit from "../../../../components/common/form/Submit";
import Icon from "../../../../icons/icon";
import HelpText from "../../../../components/common/layout/HelpText";

// constants
import {numberOfEmployees} from "../../../../constants/helpTexts";

// utils
import i18n from '../../../../i18n';



const BusinessActivity = (props) => {
  const {data, step, dataLocalStorage} = props;
  const dispatch = useDispatch();
    const language = useSelector(state => state.languageReducer);
    const lang = i18n[language].bizActivity;
    const langHelpTexts = i18n[language].helpTexts;

    const numberOfEmployeesLang = numberOfEmployees(langHelpTexts);

  const {loading} = useSelector(state => state.loaderMiddlewareReducer);
  const [timezone, setTimezone] = useState('');

  const [fields, setFields] = useState({
    biz_activity1: dataLocalStorage?.biz_activity1 ?? data?.biz_activity1 ?? '',
    biz_activity2: dataLocalStorage?.biz_activity2 ?? data?.biz_activity2 ?? '',
    biz_employees: dataLocalStorage?.biz_employees ?? data?.biz_employees ?? '',
  });

  useEffect(() => {
    if ('Intl' in window) {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  });

  const {biz_activity1, biz_activity2, biz_employees} = fields;

  const handleSubmitForm = () => {
    if(!loading) {
      if(biz_activity2) {
        dispatch(corpInfoNextStep({...fields,id:store.get('SendDataId'),timezone}, 'corporation/step_one/page_one', step));
      } else {
        dispatch(corpInfoNextStep({biz_activity1, biz_employees,id:store.get('SendDataId'),timezone}, 'corporation/step_one/page_one', step));
      }
    }
  };

  const {handleSubmit, errors, setFieldValue, touched} = useFormik({
    initialValues: {
      biz_activity1,
      biz_activity2,
      biz_employees,
    },

    validateOnChange: false,
    validateOnMount: false,

    onSubmit: () => {

      handleSubmitForm();
    },

    validate: value => {
      const errors = {};

      if(!biz_activity1) {
        errors.biz_activity1 = lang.errQuestion1;
      }

      if(!biz_employees) {
        errors.biz_employees = lang.errQuestion2;
      }

      return errors;
    }

  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    if(value === '' || value.length <= 100) {
      setFieldValue(name, value);
      setFields(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const toggleChange = (e) => {
    const {name, value} = e.target;
    setFieldValue(name, value);
    setFields(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleClick = () => {
    props.history.push('/');
  };

  return (
  <>
    <Back handleClick={handleClick} classes={styles['BusinessActivity__back-btn']} />
    <form onSubmit={handleSubmit} className={styles['BusinessActivity-form']}>
      <div className={styles['BusinessActivity-form__formGroup']}>
        <h6 className={`${styles['BusinessActivity-form__label']} ${styles['BusinessActivity-form__label_primaryActivity']}`}>
            {lang.question1}
        </h6>
        <div className={styles['BusinessActivity-form__input_wrapper']}>
          {/*Todo: Change input to Textarea with its custom styles*/}
          <Input
            label={lang.description}
            wrapperClassname={styles['BusinessActivity-form__input']}
            name="biz_activity1"
            value={biz_activity1}
            handleChange={handleChange}
            touched={touched.biz_activity1}
            error={errors.biz_activity1}
          />
        </div>
      </div>

      <div className={`${styles['BusinessActivity-form__formGroup']} ${styles['BusinessActivity-form__formGroup_secondaryActivity']}`}>
        <h6 className={`${styles['BusinessActivity-form__label']} ${styles['BusinessActivity-form__label_primaryActivity']}`}>
            {lang.question2}
        </h6>
        <div className={styles['BusinessActivity-form__input_wrapper']}>
          {/*Todo: Change input to Textarea with its custom styles*/}
          <Input
            label={lang.description}
            wrapperClassname={styles['BusinessActivity-form__input']}
            name="biz_activity2"
            value={biz_activity2}
            handleChange={handleChange}
            touched={touched.biz_activity2}
            error={errors.biz_activity2}
          />
        </div>
      </div>

      <div className={`${styles['BusinessActivity-form__formGroup']} ${styles['BusinessActivity-form__formGroup_amounts']}`}>
        <div className={`${styles['BusinessActivity-form__label']} ${styles['BusinessActivity-form__label_amounts']}`}>
          <span>{lang.question3}</span>
          <button className={styles['BusinessActivity-form__label_amounts_faq']} type="button">
            <Icon name="faq-icon" />
          </button>
          <HelpText
            content={numberOfEmployeesLang}
            className={styles['BusinessActivity-HelpText']}
          />
        </div>
        <div className={styles['BusinessActivity-form__amounts']}>
          <div className={styles['BusinessActivity-form__amounts_wrapper']}>
            <RadioButton
                wrapperClassName={styles['BusinessActivity-form__amounts_amount']}
                label="0"
                value="0"
                name="biz_employees"
                handleChange={toggleChange}
                isChecked={biz_employees === '0'}
            />
            <RadioButton
              wrapperClassName={styles['BusinessActivity-form__amounts_amount']}
              label="1-5"
              value="1-5"
              isChecked={biz_employees === '1-5'}
              name="biz_employees"
              handleChange={toggleChange}
            />
            <RadioButton
              wrapperClassName={styles['BusinessActivity-form__amounts_amount']}
              label="6-10"
              value="6-10"
              name="biz_employees"
              isChecked={biz_employees === '6-10'}
              handleChange={toggleChange}
            />
            <RadioButton
              wrapperClassName={styles['BusinessActivity-form__amounts_amount']}
              label="11 +"
              value="11+"
              name="biz_employees"
              isChecked={biz_employees === '11+'}
              handleChange={toggleChange}
            />
          </div>
          {errors.biz_employees && <p className="errorMessage">{errors.biz_employees}</p>}
          <Submit
            height={45}
            padding={35}
            label={lang.continue}
            icon="chevron-right"
            type="danger"
            classes="continue test"
            isDisabled={loading}
          />
        </div>
      </div>
    </form>
  </>
);
};

export default withRouter(BusinessActivity);
