import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useFormik} from "formik";
import store from "store";
import {withRouter} from 'react-router-dom';

import i18n from '../../../../i18n';

import {shareTaxNextStep} from "../../../../actions/shareTax";

// styles
import styles from './WhatBusinessSell.module.scss';

// components
import WhatBusinessSellQuestion from "./components/WhatBusinessSellQuestion";
import Back from "../../../../components/common/form/Back";
import Submit from "../../../../components/common/form/Submit";

// constants
import businessSellQuestions from "../../../../constants/whatBusinessSellQuestions";

const WhatBusinessSell = (props) => {
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.loaderMiddlewareReducer);
  const {data, dataLocalStorage, step} = props;

  const language = useSelector(state => state.languageReducer);
  const lang = i18n[language].shareTax;
  const whatBusinessSellQuestions = businessSellQuestions(lang);
  const [timezone, setTimezone] = useState('');

    const [fields, setFields] = useState({
    alcohol: dataLocalStorage?.data?.alcohol ?? data?.data?.alcohol ?? '0',
    catering: dataLocalStorage?.data?.catering ?? data?.data?.catering ?? '0',
    tobacco: dataLocalStorage?.data?.tobacco ?? data?.data?.tobacco ?? '0',
    cannabis: dataLocalStorage?.data?.cannabis ?? data?.data?.cannabis ?? '0',
    fuel: dataLocalStorage?.data?.fuel ?? data?.data?.fuel ?? '0',
    textile: dataLocalStorage?.data?.textile ?? data?.data?.textile ?? '0',
    insurance_premiums: dataLocalStorage?.data?.insurance_premiums ?? data?.data?.insurance_premiums ?? '0',
    accommodation: dataLocalStorage?.data?.accommodation ?? data?.data?.accommodation ?? '0',
    vehicles: dataLocalStorage?.data?.vehicles ?? data?.data?.vehicles ?? '0',
    tires: dataLocalStorage?.data?.tires ?? data?.data?.tires ?? '0'
  });

  const {
    accommodation,
    alcohol,
    cannabis,
    catering,
    fuel,
    insurance_premiums,
    textile,
    tires,
    tobacco,
    vehicles
  } = fields;

  useEffect(() => {
    if ('Intl' in window) {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  });

  const handleSubmitForm = () => {
    if(!loading) {
      dispatch(shareTaxNextStep({data: fields, id: store.get('SendDataId'),timezone}, 'corporation/step_three/page_two', step));
    }
  }

  const {handleSubmit, errors, setFieldValue, touched} = useFormik({
    initialValues: {
      accommodation,
      alcohol,
      cannabis,
      catering,
      fuel,
      insurance_premiums,
      textile,
      tires,
      tobacco,
      vehicles
    },

    onSubmit: () => {
      handleSubmitForm();
    },


    validateOnChange: false,
    validateOnMount: false,

    validate: values => {
      const errors = {};

      if(!accommodation) {
        errors.accommodation = 'Accomodation';
      }
      if(!alcohol) {
        errors.alcohol = 'Alcohol';
      }
      if(!cannabis) {
        errors.cannabis = 'Cannabis';
      }
      if(!catering) {
        errors.catering = 'Catering';
      }
      if(!fuel) {
        errors.fuel = 'Fuel';
      }
      if(!insurance_premiums) {
        errors.insurance_premiums = 'Insurance Premiums';
      }
      if(!textile) {
        errors.textile = 'Textile';
      }
      if(!tires) {
        errors.tires = 'Tires';
      }
      if(!tobacco) {
        errors.tobacco = 'Tobacco';
      }
      if(!vehicles) {
        errors.vehicles = 'Vehicles';
      }

      console.log(errors)
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
    props.history.push('/corpInfo');
  }

  return (
    <>
      <Back handleClick={handleBackClick} classes={styles['WhatBusinessSell__back-btn']} />
      <form className={styles['WhatBusinessSell-form']} onSubmit={handleSubmit}>
        {
          whatBusinessSellQuestions.map((whatBusinessSellQuestion) => {
            return (
              <WhatBusinessSellQuestion
                key={whatBusinessSellQuestion.id}
                id={whatBusinessSellQuestion.id}
                name={whatBusinessSellQuestion.name}
                value={fields[whatBusinessSellQuestion.name]}
                question={whatBusinessSellQuestion.question}
                handleChange={handleChange}
              />
            );
          })
        }
        <div className={styles['WhatBusinessSell-divider']}>
          {(
            errors.accommodation ||
            errors.alcohol ||
            errors.cannabis ||
            errors.catering ||
            errors.fuel ||
            errors.insurance_premiums ||
            errors.textile ||
            errors.tires ||
            errors.tobacco ||
            errors.vehicles
          ) && <p className={styles['WhatBusinessSell-errorMessage']}>{lang.errMessage}</p>}
        </div>

        <Submit
          classes={styles['WhatBusinessSell-form__submit']}
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

export default withRouter(WhatBusinessSell);
