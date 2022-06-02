import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import store from 'store';
import {useDispatch, useSelector} from "react-redux";
import {withRouter} from 'react-router-dom';

import i18n from '../../../../i18n';

// styles
import styles from './Contact.module.scss';

// components
import Back from "../../../../components/common/form/Back";
import ContactQuestion from "./components/ContactQuestion";
import Submit from "../../../../components/common/form/Submit";

// constants
import contactQuestion from "../../../../constants/contactQuestions";

import {shareTaxPrevStep, shareTaxNextStep} from "../../../../actions/shareTax";

const Contact = (props) => {
  const {data, dataLocalStorage, step} = props;
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.loaderMiddlewareReducer);

  const language = useSelector(state => state.languageReducer);
  const lang = i18n[language];
  const contactQuestions = contactQuestion(lang);
  const [timezone, setTimezone] = useState('');

  const [fields, setFields] = useState({
    business_plan: dataLocalStorage?.business_plan ?? data?.business_plan ?? null,
    trademark: dataLocalStorage?.trademark ?? data?.trademark ?? null,
    virtualoffice: dataLocalStorage?.virtualoffice ?? data?.virtualoffice ?? null,
    subsidies: dataLocalStorage?.subsidies ?? data?.subsidies ?? null,
    maintenance_agreement: dataLocalStorage?.maintenance_agreement ?? data?.maintenance_agreement ?? null,
    shareholder_agreement: dataLocalStorage?.shareholder_agreement ?? data?.shareholder_agreement ?? null,
    employee_agreement: dataLocalStorage?.employee_agreement ?? data?.employee_agreement ?? null,
    services_consulting_agreement: dataLocalStorage?.services_consulting_agreement ?? data?.services_consulting_agreement ?? null,
    corporate_service_agreement: dataLocalStorage?.corporate_service_agreement ?? data?.corporate_service_agreement ?? null,
    NDA_agreement: dataLocalStorage?.NDA_agreement ?? data?.NDA_agreement ?? null,
  });

  const {
    business_plan,
    corporate_service_agreement,
    employee_agreement,
    maintenance_agreement,
    NDA_agreement,
    services_consulting_agreement,
    shareholder_agreement,
    subsidies,
    trademark,
    virtualoffice
  } = fields;

  useEffect(() => {
    if ('Intl' in window) {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  });

  const handleSubmitForm = () => {
    if(!loading) {
      dispatch(shareTaxNextStep({
        ...fields,
        id: store.get('SendDataId'),
        timezone
      }, 'corporation/step_four/page_two', step, true, props.history));
    }
  };

  const {handleSubmit, errors, setFieldValue, touched} = useFormik({
    initialValues: {
      business_plan,
      corporate_service_agreement,
      employee_agreement,
      maintenance_agreement,
      NDA_agreement,
      services_consulting_agreement,
      shareholder_agreement,
      subsidies,
      trademark,
      virtualoffice
    },

    onSubmit: () => {
      handleSubmitForm();
    },


    validateOnChange: false,
    validateOnMount: false,


    validate: values => {
      const errors = {};

      if(!business_plan) {

        errors.business_plan = lang.employeeAgreement;
      }
      if(!corporate_service_agreement) {
        errors.corporate_service_agreement = 'corporate_service_agreement';
      }
      if(!employee_agreement) {
        errors.employee_agreement = 'employee_agreement';
      }
      if(!maintenance_agreement) {
        errors.maintenance_agreement = 'maintenance_agreement';
      }
      if(!NDA_agreement) {
        errors.NDA_agreement = 'NDA_agreement';
      }
      if(!services_consulting_agreement) {
        errors.services_consulting_agreement = 'services_consulting_agreement';
      }
      if(!shareholder_agreement) {
        errors.shareholder_agreement = 'shareholder_agreement';
      }
      if(!subsidies) {
        errors.subsidies = 'subsidies';
      }
      if(!trademark) {
        errors.trademark = 'trademark';
      }
      if(!virtualoffice) {
        errors.virtualoffice = 'virtualoffice';
      }
      return errors;
    },
  });

    const handleChange = (e) => {
    const {name, value} = e.target;
    setFieldValue(name, value);
    setFields(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

    const handleBackClick = () => {
      dispatch(shareTaxPrevStep(step));
    };

  return (
    <>
      <Back handleClick={handleBackClick} classes={styles['Contact__back-btn']} />
      <form className={styles['Contact-form']} onSubmit={handleSubmit}>
        <h6 className={styles['Contact-form__heading']}>
          {lang.contact.weWillContactYou}
        </h6>
        {
          contactQuestions.map((contactQuestion) => {
            return (
              <ContactQuestion
                key={contactQuestion.id}
                id={contactQuestion.id}
                question={contactQuestion.question}
                hasFaq={contactQuestion.hasFaq}
                name={contactQuestion.name}
                value={fields[contactQuestion.name]}
                faqContent={contactQuestion.faqContent}
                handleChange={handleChange}
              />
            )
          })
        }
        <div className={styles['Contact-divider']}>
          {(
            errors.virtualoffice ||
            errors.trademark ||
            errors.subsidies ||
            errors.shareholder_agreement ||
            errors.NDA_agreement ||
            errors.employee_agreement ||
            errors.maintenance_agreement ||
            errors.corporate_service_agreement ||
            errors.business_plan ||
            errors.services_consulting_agreement
          ) && <p className={styles['Contact-errorMessage']}>{lang.contact.errMessage}</p>}
        </div>
        <Submit
          classes={styles['Contact-form__submit']}
          label={lang.contact.next}
          icon="chevron-right"
          height={45}
          padding={25}
          type="danger"
          isDisabled={loading}
        />
      </form>
    </>
  );
};

export default withRouter(Contact);
