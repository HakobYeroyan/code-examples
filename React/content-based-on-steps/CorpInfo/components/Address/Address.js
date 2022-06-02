import React, {useEffect, useState, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useFormik} from "formik";
import store from "store";

import {corpInfoPrevState, corpInfoNextStep} from "../../../../actions/corpInfo";
import i18n from '../../../../i18n';

// Styles
import styles from './Address.module.scss';

// Components
import Back from "../../../../components/common/form/Back";
import Input from "../../../../components/common/form/Input";
import Select from "../../../../components/common/form/Select";
import CustomCheckbox from "../../../../components/common/form/CustomCheckbox";
import Submit from "../../../../components/common/form/Submit";
import Icon from "../../../../icons/icon";
import {numberRegexp} from "../../../../constants/helperExpressions";


const Address = ({data, step, dataLocalStorage}) => {
  const dispatch = useDispatch();
  const language = useSelector(state => state.languageReducer);
  const lang = i18n[language].bizAddress;
  const provinces = Object.values(i18n[language].provinces);
  const {loading} = useSelector(state => state.loaderMiddlewareReducer);
  const [isSameAddresses, setIsSameAddresses] = useState(false);
  const [timezone, setTimezone] = useState('');
  const [fields, setFields] = useState({
    biz_address: dataLocalStorage?.biz_address ?? data?.biz_address ?? '',
    biz_address2: dataLocalStorage?.biz_address2 ?? data?.biz_address2 ?? '',
    biz_city: dataLocalStorage?.biz_city ?? data?.biz_city ?? '',
    biz_province: dataLocalStorage?.biz_province ?? data?.biz_province ?? '',
    biz_postalcode: dataLocalStorage?.biz_postalcode ?? data?.biz_postalcode ?? '',
    mail_address: dataLocalStorage?.mail_address ?? data?.mail_address ?? '',
    mail_address2: dataLocalStorage?.mail_address2 ?? data?.mail_address2 ?? '',
    mail_city: dataLocalStorage?.mail_city ?? data?.mail_city ?? '',
    mail_province: dataLocalStorage?.mail_province ?? data?.mail_province ?? '',
    mail_postalcode: dataLocalStorage?.mail_postalcode ?? data?.mail_postalcode ?? ''
  });

  const {
    biz_address,
    biz_address2,
    biz_city,
    biz_province,
    biz_postalcode,
    mail_address,
    mail_address2,
    mail_city,
    mail_province,
    mail_postalcode
  } = fields;

  const isSame = useMemo(() => {
  const valuesExist = biz_address &&
    biz_address2 &&
    biz_city &&
    biz_province &&
    biz_postalcode &&
    mail_address &&
    mail_address2 &&
    mail_city &&
    mail_province &&
    mail_postalcode

    const isValuesSame = biz_address === mail_address
      && biz_address2 === mail_address2
      && biz_city === mail_city
      && biz_province === mail_province
      && biz_postalcode === mail_postalcode

    return valuesExist && isValuesSame;

  }, [fields]);

  useEffect(() => {

    if ('Intl' in window) {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }

    if(isSameAddresses) {
      setFields(prevState => {
        return {
          ...prevState,
          mail_address: fields.biz_address,
          mail_address2: fields.biz_address2,
          mail_city: fields.biz_city,
          mail_province: fields.biz_province,
          mail_postalcode: fields.biz_postalcode,
        };
      });
    }
    setIsSameAddresses(isSame);
  }, [isSameAddresses]);

  const handleSubmitForm = () => {
    if(!loading) {
        const data = {...fields};
        if (!fields.biz_address2) {
            delete data.biz_address2;
        }
        if(!fields.mail_address2){
            delete data.mail_address2;
        }
        dispatch(corpInfoNextStep({...data, id: store.get('SendDataId'),timezone}, 'corporation/step_two/page_one', step));
    }
  };

  const {handleSubmit, errors, setFieldValue, touched} = useFormik({
    initialValues: {
      biz_address,
      biz_address2,
      biz_city,
      biz_province,
      biz_postalcode,
      mail_address,
      mail_address2,
      mail_city,
      mail_province,
      mail_postalcode
    },

    validateOnChange: false,
    validateOnMount: false,

    onSubmit: () => {
      handleSubmitForm();
    },

    validate: values => {
      const errors = {};

      if(!biz_address.trim()) {
        errors.biz_address = lang.address1;
      }
      if(!biz_city.trim()) {
        errors.biz_city = lang.city;
      }
      if(!biz_province.trim()) {
        errors.biz_province = lang.province;
      }
      if(!biz_postalcode.trim() || biz_postalcode.length > 7) {
        errors.biz_postalcode = lang.postCode;
      }

      if(!mail_address.trim()) {
        errors.mail_address = lang.address1;
      }
      if(!mail_city.trim()) {
        errors.mail_city = lang.city;
      }
      if(!mail_province.trim()) {
        errors.mail_province = lang.province;
      }
      if(!mail_postalcode.trim() || mail_postalcode.length > 7) {
        errors.mail_postalcode = lang.postCode;
      }

      return errors;
    }
  });

  const handleClick = () => {
    dispatch(corpInfoPrevState(step));
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    if(value === '' || value.length < 50) {
      setFieldValue(name, value);
      setIsSameAddresses(false);
      setFields(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }

  };

  const handleSelectProvince = (name, value) => {
    setFieldValue(name, value);
    setIsSameAddresses(false);
    setFields(prevState => {
      return {
        ...prevState,
        [name]: value,
      }
    });
  }

  const handleNumberChange = (e) => {
    const {name, value} = e.target;
    if(value === '' || (numberRegexp.test(value))) {
      setFieldValue(name, value);
      setIsSameAddresses(false);
      setFields(prevState => {
        return {
          ...prevState,
          [name]: value,
        }
      });
    }
  }

  const toggleChange = () => {
    setIsSameAddresses(prevState => !prevState);
  };

    const linkProplsio = () => {
        if (language === 'fr') {
            return 'https://propulsio360.com/domiciliation/';
        }
        if (language === 'en') {
            return 'https://propulsio360.com/en/virtual-office/';
        }

    };

  return (
    <>
      <Back handleClick={handleClick} classes={styles['Address__back-btn']} />
      <form className={styles['Address-form']} onSubmit={handleSubmit}>
        <div className={styles['Address-form__business']}>
          <h6 className={styles['Address-form__heading']}>
              {lang.title}
          </h6>
          <div className={styles['Address-form__businessAddress']}>
            <div className={`${styles['Address-form__formGroup']} ${styles['Address-form__formGroup_addresses']}`}>
              <Input
                label={lang.address1}
                wrapperClassname={`${styles['Address-form__formItem_address']} ${styles['Address-form__formItem_address1']}`}
                handleChange={handleChange}
                name="biz_address"
                value={biz_address}
                touched={touched.biz_address}
                error={errors.biz_address}
                id="b_biz_address"
              />
              <Input
                label={lang.address2}
                wrapperClassname={`${styles['Address-form__formItem_address']} ${styles['Address-form__formItem_address2']}`}
                handleChange={handleChange}
                name="biz_address2"
                value={biz_address2}
                touched={touched.biz_address2}
                error={errors.biz_address2}
                id="b_biz_address2"
              />
            </div>
            <div className={`${styles['Address-form__formGroup']} ${styles['Address-form__formGroup_locations']}`}>
              <div className={styles['Address-form__formGroup_formRow']}>
                <div className={`custom-select ${styles['Province__custom-select']}`} style={{ "width": "50%"}}>
                  <Select
                      label={lang.province}
                      options={provinces}
                      value={biz_province}
                      error={errors.biz_province}
                      item=""
                      handleChange={(val) => handleSelectProvince('biz_province', val)}
                    />
                </div>
              
                <Input
                  label={lang.postCode}
                  wrapperClassname={`${styles['Address-form__formItem_postalCode']} ${styles['Address-form__formItem_location']}`}
                  handleChange={handleChange}
                  name="biz_postalcode"
                  value={biz_postalcode}
                  error={errors.biz_postalcode}
                  touched={touched.biz_postalcode}
                  id="b_biz_postalcode"

                />
              </div>
              <Input
                label={lang.city}
                wrapperClassname={`${styles['Address-form__formItem_city']} ${styles['Address-form__formItem_location']}`}
                handleChange={handleChange}
                name="biz_city"
                value={biz_city}
                error={errors.biz_city}
                touched={touched.biz_city}
                id="b_biz_city"

              />
            </div>
          </div>
        </div>

        <div className={styles['Address-form__divider']} />
        <div className={styles['Address-form__business']}>
          <h6 className={styles['Address-form__heading']}>
              {lang.title2}
          </h6>
          <CustomCheckbox
            label={lang.mailing}
            name="isAddressesSame"
            handleChange={toggleChange}
            checked={isSameAddresses}
          />
          {/*<input type="checkbox" checked={isSameAddresses} onChange={toggleChange} name="isSameAddresses" />*/}

          <div className={styles['Address-form__businessAddress']}>
            <div className={`${styles['Address-form__formGroup']} ${styles['Address-form__formGroup_addresses']}`}>
              <Input
                label={lang.address1}
                wrapperClassname={`${styles['Address-form__formItem_address']} ${styles['Address-form__formItem_address1']}`}
                handleChange={handleChange}
                name="mail_address"
                value={mail_address}
                error={errors.mail_address}
                touched={touched.mail_address}
                id="m_mail_address"
              />
              <Input
                label={lang.address2}
                wrapperClassname={`${styles['Address-form__formItem_address']} ${styles['Address-form__formItem_address2']}`}
                handleChange={handleChange}
                name="mail_address2"
                value={mail_address2}
                error={errors.mail_address2}
                touched={touched.mail_address2}
                id="m_mail_address2"

              />
            </div>
            <div className={`${styles['Address-form__formGroup']} ${styles['Address-form__formGroup_locations']}`}>
              <div className={styles['Address-form__formGroup_formRow']}>
              <div className={`custom-select ${styles['Province__custom-select']}`} style={{ "width": "50%"}}>
                  <Select
                      label={lang.province}
                      options={provinces}
                      value={mail_province}
                      error={errors.mail_province}
                      item=""
                      handleChange={(val) => handleSelectProvince('mail_province', val)}
                    />
                </div>

                <Input
                  label={lang.postCode}
                  wrapperClassname={`${styles['Address-form__formItem_postalCode']} ${styles['Address-form__formItem_location']}`}
                  handleChange={handleChange}
                  name="mail_postalcode"
                  value={mail_postalcode}
                  error={errors.mail_postalcode}
                  touched={touched.mail_postalcode}
                  type="text"
                  id="m_mail_postalcode"
                />
              </div>
              <Input
                label={lang.city}
                wrapperClassname={`${styles['Address-form__formItem_city']} ${styles['Address-form__formItem_location']}`}
                handleChange={handleChange}
                name="mail_city"
                value={mail_city}
                error={errors.mail_city}
                touched={touched.mail_city}
                id="m_mail_city"

              />
            </div>
          </div>
        </div>
        <div className={styles['Address-form__additional']}>
          <p className={styles['Address-form__additional_par']}>
              {lang.virtOffice}
          </p>
          <p className={styles['Address-form__additional_bill']}>
              {lang.price}
          </p>
          <a className={styles['Address-form__additional_link']} href={linkProplsio()} target="_blank">
            <span>{lang.propulsioVirtOffice}</span>
            <p className={styles['Address-form__additional_link_iconWrapper']}>
              <Icon name="external-link-icon" />
            </p>
          </a>
        </div>
        <p className={styles['Address-form__extra']}>
            
        </p>
        <Submit classes={styles['Address-form__submit']} label={lang.continue} icon="chevron-right" type="danger" height={45} padding={35}/>
      </form>
    </>
  );
};

export default Address;
