import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useFormik} from "formik";
import store from "store";

// actions
import {corpInfoNextStep, corpInfoPrevState} from "../../../../actions/corpInfo";

// styles
import styles from './Directors.module.scss';

// components
import Back from "../../../../components/common/form/Back";
import Select from "../../../../components/common/form/Select";
import Director from "./components/Director";
import i18n from '../../../../i18n';

// Helper expressions
import {emailRegexp, numberFieldValidation, numberRegexp} from "../../../../constants/helperExpressions";

const Directors = ({data, step, dataLocalStorage}) => {
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.loaderMiddlewareReducer);
  const language = useSelector(state => state.languageReducer);
  const lang = i18n[language].directors;
  const [directorCount, setDirectorCount] = useState(1);
  const [timezone, setTimezone] = useState('');
  const [directors, setDirectors] = useState({
    dir1: {
      fname: dataLocalStorage?.directors?.dir1?.fname ?? data?.directors?.dir1?.fname ?? '',
      lname: dataLocalStorage?.directors?.dir1?.lname ?? data?.directors?.dir1?.lname ?? '',
      address: dataLocalStorage?.directors?.dir1?.address ?? data?.directors?.dir1?.address ?? '',
      address2: dataLocalStorage?.directors?.dir1?.address2 ?? data?.directors?.dir1?.address2 ?? '',
      city: dataLocalStorage?.directors?.dir1?.city ?? data?.directors?.dir1?.city ?? '',
      province: dataLocalStorage?.directors?.dir1?.province ?? data?.directors?.dir1?.province ?? '',
      postalcode: dataLocalStorage?.directors?.dir1?.postalcode ?? data?.directors?.dir1?.postalcode ?? '',
      email: dataLocalStorage?.directors?.dir1?.email ?? data?.directors?.dir1?.email ?? '',
      sin: dataLocalStorage?.directors?.dir1?.sin ?? data?.directors?.dir1?.sin ?? false,
      officer: dataLocalStorage?.directors?.dir1?.officer ?? data?.directors?.dir1?.officer ?? false,
      role: dataLocalStorage?.directors?.dir1?.role ?? data?.directors?.dir1?.role ?? '',
      shareholder: dataLocalStorage?.directors?.dir1?.shareholder ?? data?.directors?.dir1?.shareholder ?? ''
    },
    dir2: {
      fname: dataLocalStorage?.directors?.dir2?.fname ?? data?.directors?.dir2?.fname ?? '',
      lname: dataLocalStorage?.directors?.dir2?.lname ?? data?.directors?.dir2?.lname ?? '',
      address: dataLocalStorage?.directors?.dir2?.address ?? data?.directors?.dir2?.address ?? '',
      address2: dataLocalStorage?.directors?.dir2?.address2 ?? data?.directors?.dir2?.address2 ?? '',
      city: dataLocalStorage?.directors?.dir2?.city ?? data?.directors?.dir2?.city ?? '',
      province: dataLocalStorage?.directors?.dir2?.province ?? data?.directors?.dir2?.province ?? '',
      postalcode: dataLocalStorage?.directors?.dir2?.postalcode ?? data?.directors?.dir2?.postalcode ?? '',
      email: dataLocalStorage?.directors?.dir2?.email ?? data?.directors?.dir2?.email ?? '',
      sin: dataLocalStorage?.directors?.dir2?.sin ?? data?.directors?.dir2?.sin ?? false,
      officer: dataLocalStorage?.directors?.dir2?.officer ?? data?.directors?.dir2?.officer ?? false,
      role: dataLocalStorage?.directors?.dir2?.role ?? data?.directors?.dir2?.role ?? '',
      shareholder: dataLocalStorage?.directors?.dir2?.shareholder ?? data?.directors?.dir2?.shareholder ?? ''
    },
    dir3: {
      fname: dataLocalStorage?.directors?.dir3?.fname ?? data?.directors?.dir3?.fname ?? '',
      lname: dataLocalStorage?.directors?.dir3?.lname ?? data?.directors?.dir3?.lname ?? '',
      address: dataLocalStorage?.directors?.dir3?.address ?? data?.directors?.dir3?.address ?? '',
      address2: dataLocalStorage?.directors?.dir3?.address2 ?? data?.directors?.dir3?.address2 ?? '',
      city: dataLocalStorage?.directors?.dir3?.city ?? data?.directors?.dir3?.city ?? '',
      province: dataLocalStorage?.directors?.dir3?.province ?? data?.directors?.dir3?.province ?? '',
      postalcode: dataLocalStorage?.directors?.dir3?.postalcode ?? data?.directors?.dir3?.postalcode ?? '',
      email: dataLocalStorage?.directors?.dir3?.email ?? data?.directors?.dir3?.email ?? '',
      sin: dataLocalStorage?.directors?.dir3?.sin ?? data?.directors?.dir3?.sin ?? false,
      officer: dataLocalStorage?.directors?.dir3?.officer ?? data?.directors?.dir3?.officer ?? false,
      role: dataLocalStorage?.directors?.dir3?.role ?? data?.directors?.dir3?.role ?? '',
      shareholder: dataLocalStorage?.directors?.dir3?.shareholder ?? data?.directors?.dir3?.shareholder ?? ''
    },
  });

  const {
    dir1 : {
      fname: fname_1,
      lname: lname_1,
      address: address_1,
      address2: address2_1,
      city: city_1,
      province: province_1,
      postalcode: postalcode_1,
      email: email_1,
      sin: sin_1,
      officer: officer_1,
      role: role_1,
      shareholder: shareholder_1,
    },
    dir2 :{
      fname: fname_2,
      lname: lname_2,
      address: address_2,
      address2: address2_2,
      city: city_2,
      province: province_2,
      postalcode: postalcode_2,
      email: email_2,
      sin: sin_2,
      officer: officer_2,
      role: role_2,
      shareholder: shareholder_2,
    },
    dir3 : {
      fname: fname_3,
      lname: lname_3,
      address: address_3,
      address2: address2_3,
      city: city_3,
      province: province_3,
      postalcode: postalcode_3,
      email: email_3,
      sin: sin_3,
      officer: officer_3,
      role: role_3,
      shareholder: shareholder_3,
    }
  } = directors;

  useEffect(() => {
    if ('Intl' in window) {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  });

  const handleSubmitForm = () => {
    if(!loading) {
      const data = {};
      for(let i = 1; i <= directorCount; i++) {
        if(Number(directors[`dir${i}`]['sin']) && Number(directors[`dir${i}`].officer)) {
          data[`dir${i}`] = {
            fname: directors[`dir${i}`].fname,
            lname: directors[`dir${i}`].lname,
            address: directors[`dir${i}`].address,
            address2: directors[`dir${i}`].address2,
            city: directors[`dir${i}`].city,
            province: directors[`dir${i}`].province,
            postalcode: directors[`dir${i}`].postalcode,
            email: directors[`dir${i}`].email,
            sin: String(Number(directors[`dir${i}`]['sin'])),
            officer: String(Number(directors[`dir${i}`].officer)),
            role: directors[`dir${i}`].role,
            shareholder: directors[`dir${i}`].shareholder,
          }
        } else if(!Number(directors[`dir${i}`]['sin']) && Number(directors[`dir${i}`].officer)) {
          data[`dir${i}`] = {
            fname: directors[`dir${i}`].fname,
            lname: directors[`dir${i}`].lname,
            address: directors[`dir${i}`].address,
            address2: directors[`dir${i}`].address2,
            city: directors[`dir${i}`].city,
            province: directors[`dir${i}`].province,
            postalcode: directors[`dir${i}`].postalcode,
            email: directors[`dir${i}`].email,
            sin: String(Number(directors[`dir${i}`]['sin'])),
            officer: String(Number(directors[`dir${i}`].officer)),
            role: directors[`dir${i}`].role,
          }
        } else if(Number(directors[`dir${i}`]['sin']) && !Number(directors[`dir${i}`].officer)) {
          data[`dir${i}`] = {
            fname: directors[`dir${i}`].fname,
            lname: directors[`dir${i}`].lname,
            address: directors[`dir${i}`].address,
            address2: directors[`dir${i}`].address2,
            city: directors[`dir${i}`].city,
            province: directors[`dir${i}`].province,
            postalcode: directors[`dir${i}`].postalcode,
            email: directors[`dir${i}`].email,
            sin: String(Number(directors[`dir${i}`]['sin'])),
            officer: String(Number(directors[`dir${i}`].officer)),
            shareholder: directors[`dir${i}`].shareholder,
          }
        } else {
          data[`dir${i}`] = {
            fname: directors[`dir${i}`].fname,
            lname: directors[`dir${i}`].lname,
            address: directors[`dir${i}`].address,
            address2: directors[`dir${i}`].address2,
            city: directors[`dir${i}`].city,
            province: directors[`dir${i}`].province,
            postalcode: directors[`dir${i}`].postalcode,
            email: directors[`dir${i}`].email,
            sin: String(Number(directors[`dir${i}`]['sin'])),
            officer: String(Number(directors[`dir${i}`].officer)),
          }
        }
        if (directors[`dir${i}`].address2 === '') {
            delete data[`dir${i}`].address2;
        }
      }
      dispatch(corpInfoNextStep({directors: data, id: store.get('SendDataId'),timezone}, 'corporation/step_two/page_two', step));
    }
  }

  const {handleSubmit, errors, setFieldValue, touched} = useFormik({
    initialValues: {
      fname_1,
      lname_1,
      address_1,
      address2_1,
      city_1,
      province_1,
      postalcode_1,
      email_1,
      sin_1,
      officer_1,
      role_1,
      shareholder_1,
      fname_2,
      lname_2,
      address_2,
      address2_2,
      city_2,
      province_2,
      postalcode_2,
      email_2,
      sin_2,
      officer_2,
      role_2,
      shareholder_2,
      fname_3,
      lname_3,
      address_3,
      address2_3,
      city_3,
      province_3,
      postalcode_3,
      email_3,
      sin_3,
      officer_3,
      role_3,
      shareholder_3,
    },

    validateOnChange: false,
    validateOnMount: false,

    onSubmit: () => {
      handleSubmitForm();
    },

    validate: values => {
      const errors = {};

      for(let i = 1; i <= directorCount; i++) {
        if(i === 1) {
          if(!fname_1.trim() || fname_1.length > 255) {
            errors.fname_1 = lang.fname;
          }
          if(!lname_1.trim() || lname_1.length > 255) {
            errors.lname_1 = lang.lname;
          }
          if(!address_1.trim() || address_1.length > 255) {
            errors.address_1 = lang.address;
          }
          if(!city_1.trim() || city_1.length > 255) {
            errors.city_1 = lang.city;
          }
          if(!province_1.trim() || province_1.length > 255) {
            errors.province_1 = lang.province;
          }
          if(!postalcode_1.trim() || postalcode_1.length > 7) {
            errors.postalcode_1 = lang.postCode;
          }
          if(!email_1.trim() || !emailRegexp.test(email_1) || email_1.length > 255) {
            errors.email_1 = lang.email;
          }

          if(Number(officer_1)) {
            if(!role_1) {
              errors.role_1 = lang.officerRole;
            }
          }

          if(data?.directors?.dir1?.role) {
            if(!role_1) {
              errors.role_1 = lang.officerRole;
            }
          }

          if(Number(sin_1)) {
            if(!shareholder_1.trim()) {
              errors.shareholder_1 = lang.percentage;
            }
          }

          if(data?.directors?.dir1?.shareholder) {
            if(!shareholder_1.trim()) {
              errors.shareholder_1 = lang.percentage;
            }
          }
        }

        if(i === 2) {
          if(!fname_2.trim() || fname_2.length > 255) {
            errors.fname_2 = lang.fname;
          }
          if(!lname_2.trim() || lname_2.length > 255) {
            errors.lname_2 = lang.fname;
          }
          if(!address_2.trim() || address_2.length > 255) {
            errors.address_2 = lang.address;
          }
          if(!city_2.trim() || city_2.length > 255) {
            errors.city_2 = lang.city;
          }
          if(!province_2.trim() || province_2.length > 255) {
            errors.province_2 = lang.province;
          }
          if(!postalcode_2.trim() || postalcode_2.length > 7) {
            errors.postalcode_2 = lang.postCode;
          }
          if(!email_2.trim() || !emailRegexp.test(email_2) || email_2.length > 255) {
            errors.email_2 = lang.email;
          }

          if(Number(officer_2)) {
            if(!role_2) {
              errors.role_2 = lang.officerRole;
            }
          }

          if(data?.directors?.dir2?.role) {
            if(!role_2) {
              errors.role_2 = lang.officerRole;
            }
          }

          if(Number(sin_2)) {
            if(!shareholder_2.trim()) {
              errors.shareholder_2 = lang.percentage;
            }
          }

          if(data?.directors?.dir2?.shareholder) {
            if(!shareholder_2.trim()) {
              errors.shareholder_2 = lang.percentage;
            }
          }
        }

        if(i === 3) {
          if(!fname_3.trim() || fname_3.length > 255) {
            errors.fname_3 = lang.fname;
          }
          if(!lname_3.trim() || lname_3.length > 255) {
            errors.lname_3 = lang.lname;
          }
          if(!address_3.trim() || address_3.length > 255) {
            errors.address_3 = lang.address;
          }
          if(!city_3.trim() || city_3.length > 255) {
            errors.city_3 = lang.city;
          }
          if(!province_3.trim() || province_3.length > 255) {
            errors.province_3 = lang.province;
          }
          if(!postalcode_3.trim() || postalcode_3.length > 7) {
            errors.postalcode_3 = lang.postCode;
          }
          if(!email_3.trim() || !emailRegexp.test(email_3) || email_3.length > 255) {
            errors.email_3 = lang.email;
          }

          if(Number(officer_3)) {
            if(!role_3) {
              errors.role_3 = lang.officerRole;
            }
          }

          if(data?.directors?.dir3?.role) {
            if(!role_3) {
              errors.role_3 = lang.officerRole;
            }
          }

          if(Number(sin_3)) {
            if(!shareholder_3.trim()) {
              errors.shareholder_3 = lang.percentage;
            }
          }

          if(data?.directors?.dir3?.shareholder) {
            if(!shareholder_3.trim()) {
              errors.shareholder_3 = lang.percentage;
            }
          }
        }
      }

      return errors;
    }
  });


  const handleNumberChange = (e, directorNumber) => {
    const {name, value} = e.target;
    const lengthValidation = numberFieldValidation(name, value.length);
    if(value === '' || (numberRegexp.test(value) && lengthValidation)) {
      setFieldValue(`${name}_${directorNumber}`, value);
      setDirectors(prevState => {
        return {
          ...prevState,
          [`dir${directorNumber}`]: {
            ...prevState[`dir${directorNumber}`],
            [name]: value
          }
        };
      });
    }
  }

  const handleChange = (e, directorNumber) => {
    const {name, value} = e.target;
    if(value === '' || value.length < 255) {
      setFieldValue(`${name}_${directorNumber}`, value);
      setDirectors(prevState => {
        return {
          ...prevState,
          [`dir${directorNumber}`]: {
            ...prevState[`dir${directorNumber}`],
            [name]: value
          }
        };
      });
    }
  };

  const toggleChange = (e, directorNumber) => {
    const {name, checked} = e.target;
    setFieldValue(`${name}_${directorNumber}`, checked);
    setDirectors(prevState => {
      return {
        ...prevState,
        [`dir${directorNumber}`]: {
          ...prevState[`dir${directorNumber}`],
          [name]: !prevState[`dir${directorNumber}`][name]
        }
      };
    });
  };

  const handleSelect = (directorNumber, val) => {
    setFieldValue(`role_${directorNumber}`, val);
    setDirectors(prevState => {
      return {
        ...prevState,
        [`dir${directorNumber}`]: {
          ...prevState[`dir${directorNumber}`],
          role: val
        }
      };
    });
  }

  const handleSelectProvince = (directorNumber, val) => {
    setFieldValue(`province_${directorNumber}`, val);
    setDirectors(prevState => {
      return {
        ...prevState,
        [`dir${directorNumber}`]: {
          ...prevState[`dir${directorNumber}`],
          province: val
        }
      };
    });
  }

  const handleSelectDirector = (val) => {
    setDirectorCount(val);
  };

  const handleClick = () => {
    dispatch(corpInfoPrevState(step));
  }

  return (
    <>
      <Back handleClick={handleClick} classes={styles['Directors__back-btn']} />
      <form className={styles['Directors-form']} onSubmit={handleSubmit}>
        <h3 className={styles['Directors-form__heading']}>
            {lang.title}
        </h3>
        <div className={`custom-select ${styles['Directors__custom-select']}`}>
          <Select label={lang.numDirectors} options={[1, 2, 3]} value={directorCount} item={lang.directors} handleChange={handleSelectDirector}/>
        </div>
      {
        Object.keys(directors).map((director, index, arr) => {
          if(index < +directorCount) {
            return (
              <Director
                value={directors}
                key={index}
                directorNumber={index + 1}
                handleChange={handleChange}
                handleNumberChange={handleNumberChange}
                toggleChange={toggleChange}
                handleSelect={handleSelect}
                handleSelectProvince={handleSelectProvince}
                isLast={index === directorCount - 1}
                errors={errors}
                touched={touched}
              />
            );
          }
        })
      }
      </form>
    </>
  );
};

export default Directors
