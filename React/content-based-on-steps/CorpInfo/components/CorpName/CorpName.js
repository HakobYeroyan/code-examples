import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useFormik} from "formik";
import {withRouter} from 'react-router-dom';

import {corpInfoNextStep, corpInfoPrevState} from "../../../../actions/corpInfo";
import i18n from '../../../../i18n';
// styles
import styles from './CorpName.module.scss';

// components
import Back from "../../../../components/common/form/Back";
import RadioButton from "../../../../components/common/form/RadioButton";
import Input from "../../../../components/common/form/Input";
import Submit from "../../../../components/common/form/Submit";
import store from "store";

const CorpName = (props) => {
  const {data, step, dataLocalStorage} = props;
  const dispatch = useDispatch();
  const language = useSelector(state => state.languageReducer);
  const lang = i18n[language].corpName;
  const errLang = i18n[language].errors;
  const {loading} = useSelector(state => state.loaderMiddlewareReducer);

  const [fields, setFields] = useState({
    biz_en_name: dataLocalStorage?.biz_en_name ?? data?.biz_en_name ?? '',
    biz_fr_name: dataLocalStorage?.biz_fr_name ?? data?.biz_fr_name ?? '',
    biz_name_inform: dataLocalStorage?.biz_name_inform ?? data?.biz_name_inform ?? '',
    named_numbered: dataLocalStorage?.named_numbered ?? data?.named_numbered ?? ''
  });
  const [timezone, setTimezone] = useState('');

  const {biz_en_name, biz_fr_name, biz_name_inform, named_numbered} = fields;

    useEffect(() => {
        if ('Intl' in window) {
            setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
        }
    });

  const handleSubmitForm = () => {
    if(!loading) {
      if (biz_en_name && biz_fr_name) {
        dispatch(corpInfoNextStep({...fields, id: store.get('SendDataId'),timezone}, 'corporation/step_one/page_two', step));
      } else if (biz_en_name) {
        dispatch(corpInfoNextStep({
          biz_en_name,
          biz_name_inform,
          named_numbered,
          id: store.get('SendDataId'),
          timezone
        }, 'corporation/step_one/page_two', step));
      } else {
        dispatch(corpInfoNextStep({
          biz_fr_name,
          biz_name_inform,
          named_numbered,
          id: store.get('SendDataId'),
          timezone
        }, 'corporation/step_one/page_two', step));
      }
    }
  };

  const {handleSubmit, errors, setFieldValue, touched} = useFormik({
    initialValues: {
      biz_fr_name,
      biz_en_name,
      biz_name_inform,
      named_numbered
    },

    onSubmit: () => {
      handleSubmitForm();
    },

    validateOnChange: false,
    validateOnMount: false,


    validate: values => {
      const errors = {};

      if (!biz_en_name.trim()) {
        errors.biz_en_name = lang.errCompName;
      }
      if(biz_en_name.length > 50) {
        errors.biz_en_name = lang.errMaxLength;

      }

      if(!biz_fr_name.trim()) {
        errors.biz_fr_name = lang.errCompName;
      }
      if(biz_fr_name.length > 50) {
        errors.biz_fr_name = lang.errMaxLength;
      }

      if (!biz_name_inform.trim()) {
        errors.biz_name_inform = lang.errReason;
      }
      if(biz_name_inform.length > 255) {
        errors.biz_name_inform = lang.errMaxLengthReason;
      }


      if (!named_numbered) {
        errors.named_numbered = lang.errNamNum;
      }
      return errors;
    },
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

  const toggleChange = (e) => {
    const {name, value} = e.target;
    setFieldValue(name, value);
    setFields(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleClick = () => {
    dispatch(corpInfoPrevState(step));
  }

  return (
    <>
      <Back handleClick={handleClick} classes={styles['CorpName__back-btn']}/>
      <form className={styles['CorpName-form']} onSubmit={handleSubmit}>
        <h6 className={styles['CorpName-form__heading']}>
            {lang.title}
        </h6>
        <div className={styles['CorpName-form__radioRow']}>
          <RadioButton
            wrapperClassName={`${styles['CorpName-form__radio']} ${styles['CorpName-form__radio_named']}`}
            name="named_numbered"
            value="named"
            label={lang.named}
            handleChange={toggleChange}
            isChecked={named_numbered === 'named'}
          />
          <RadioButton
            wrapperClassName={`${styles['CorpName-form__radio']}`}
            name="named_numbered"
            value="numbered"
            label={lang.numbered}
            isChecked={named_numbered === 'numbered'}
            handleChange={toggleChange}
          />
        </div>
        {errors.named_numbered && <p className="errorMessage">{errors.named_numbered}</p>}
        <div className={styles['CorpName-form__parContainer']}>
          <p className={styles['CorpName-form__par']}>
              {lang.obautPage}
          </p>
          <p className={styles['CorpName-form__extra']}>
              {lang.obautPage2}
          </p>
        </div>
        <div className={styles['CorpName-form__formGroup']}>
          <Input
            wrapperClassname={`${styles['CorpName-form__input']} ${styles['CorpName-form__input_english']}`}
            name="biz_en_name"
            label={lang.engName}
            type="text"
            value={biz_en_name}
            error={errors.biz_en_name}
            touched={touched.biz_en_name}
            handleChange={handleChange}
          />
          <Input
            wrapperClassname={`${styles['CorpName-form__input']} ${styles['CorpName-form__input_french']}`}
            name="biz_fr_name"
            label={lang.frname}
            type="text"
            value={biz_fr_name}
            error={errors.biz_fr_name}
            touched={touched.biz_fr_name}
            handleChange={handleChange}
          />
          <Input
            wrapperClassname={`${styles['CorpName-form__input']} ${styles['CorpName-form__input_why']}`}
            name="biz_name_inform"
            label={lang.obautName}
            type="text"
            value={biz_name_inform}
            error={errors.biz_name_inform}
            touched={touched.biz_name_inform}
            handleChange={handleChange}
          />
        </div>
        <Submit
          classes={`${styles['CorpName-form_submit']} continue`}
          label={lang.continue}
          type="danger"
          height={45}
          padding={35}
          icon="chevron-right"
          isDisabled={loading}
        />
      </form>
    </>
  );
};

export default withRouter(CorpName);
