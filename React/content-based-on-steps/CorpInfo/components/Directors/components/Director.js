import React from "react";
import {useSelector} from "react-redux";
import i18n from '../../../../../i18n';
// styles
import styles from './Director.module.scss';

import Input from "../../../../../components/common/form/Input";
import SwitchButton from "../../../../../components/common/form/SwitchButton";
import Submit from "../../../../../components/common/form/Submit";
import Select from "../../../../../components/common/form/Select";

const Director = ({directorNumber, handleChange, toggleChange, value, isLast, errors, touched, handleSelect, handleSelectProvince, handleNumberChange}) => {
  const {loading} = useSelector(state => state.loaderMiddlewareReducer);
    const language = useSelector(state => state.languageReducer);
    const lang = i18n[language].directors;
    const provinces = Object.values(i18n[language].provinces);
  return (
    <div className={styles['Director']}>
      <h4 className={styles['Director-heading']}>
          {lang.director} 0{directorNumber}
      </h4>
      <div className={styles['Director-fields']}>
        <div className={styles['Director-fields__row']}>
          <Input
            wrapperClassname={`${styles['Director-fields__field']} ${styles['Director-field__firstName']}`}
            label={lang.fname}
            value={value[`dir${directorNumber}`].fname}
            name="fname"
            handleChange={(e) => handleChange(e, directorNumber)}
            error={errors[`fname_${directorNumber}`]}
            touched={touched[`fname_${directorNumber}`]}
            id={`dir${directorNumber}-fname`}
          />
          <Input
            wrapperClassname={`${styles['Director-fields__field']} ${styles['Director-field__lastName']}`}
            label={lang.lname}
            value={value[`dir${directorNumber}`].lname}
            name="lname"
            handleChange={(e) => handleChange(e, directorNumber)}
            error={errors[`lname_${directorNumber}`]}
            touched={touched[`lname_${directorNumber}`]}
            id={`dir${directorNumber}-lname`}
          />
          <Input
            wrapperClassname={`${styles['Director-fields__field']} ${styles['Director-field__Address']}`}
            label={lang.address}
            value={value[`dir${directorNumber}`].address}
            name="address"
            handleChange={(e) => handleChange(e, directorNumber)}
            error={errors[`address_${directorNumber}`]}
            touched={touched[`address_${directorNumber}`]}
            id={`dir${directorNumber}-address`}
          />
          <Input
            wrapperClassname={`${styles['Director-fields__field']} ${styles['Director-field__Address2']}`}
            label={lang.address2}
            value={value[`dir${directorNumber}`].address2}
            name="address2"
            handleChange={(e) => handleChange(e, directorNumber)}
            error={errors[`address2_${directorNumber}`]}
            touched={touched[`address2_${directorNumber}`]}
            id={`dir${directorNumber}-address2`}
          />
        </div>
        <div className={styles['Director-fields__row']}>
          <Input
            wrapperClassname={`${styles['Director-fields__field']} ${styles['Director-field__city']}`}
            label={lang.city}
            value={value[`dir${directorNumber}`].city}
            name="city"
            handleChange={(e) => handleChange(e, directorNumber)}
            error={errors[`city_${directorNumber}`]}
            touched={touched[`city_${directorNumber}`]}
            id={`dir${directorNumber}-city`}
          />
          <div className={`custom-select ${styles['Province__custom-select']}`} style={{ "width": "25%"}}>
            <Select
                label={lang.province}
                options={provinces}
                error={errors[`province_${directorNumber}`]}
                value={value[`dir${directorNumber}`].province}
                item=""
                handleChange={(val) => handleSelectProvince(directorNumber,val)}
              />
          </div>
          <Input
            wrapperClassname={`${styles['Director-fields__field']} ${styles['Director-field__postalCode']}`}
            label={lang.postCode}
            value={value[`dir${directorNumber}`].postalcode}
            name="postalcode"
            handleChange={(e) => handleChange(e, directorNumber)}
            error={errors[`postalcode_${directorNumber}`]}
            touched={touched[`postalcode_${directorNumber}`]}
            type="text"
            id={`dir${directorNumber}-postalcode`}
          />
          <Input
            wrapperClassname={`${styles['Director-fields__field']} ${styles['Director-field__email']}`}
            label={lang.email}
            value={value[`dir${directorNumber}`].email}
            name="email"
            handleChange={(e) => handleChange(e, directorNumber)}
            error={errors[`email_${directorNumber}`]}
            touched={touched[`email_${directorNumber}`]}
            id={`dir${directorNumber}-email`}
          />
        </div>
      </div>
      <div className={styles['Director-divider']} />
      <div className={styles['Director-additional']}>
        <div className={styles['Director-officer']}>
          <h6 className={styles['Director-officer__question']}>
              {lang.dirOfficer}
          </h6>
          <SwitchButton
            label={{prefix: lang.no, suffix: lang.yes}}
            handleChange={(e) => toggleChange(e, directorNumber)}
            name="officer"
            checked={Number(value[`dir${directorNumber}`].officer)}
          />
          {!!Number(value[`dir${directorNumber}`].officer) &&
          <div className={`custom-select ${styles['Director__custom-select']}`} style={{ "marginTop": "23px"}}>
            <Select
              label={lang.officerRole}
              options={[lang.role1, lang.role2]}
              error={errors[`role_${directorNumber}`]}
              value={value[`dir${directorNumber}`].role}
              item=""
              // TODO: Make more dynamic taking value from Select component
              handleChange={() => handleSelect(directorNumber, value[`dir${directorNumber}`].role === 'President' ? 'Vice-president': 'President')}
            />
          </div>
          }
        </div>
        <div className={styles['Director-shareholder']}>
          <h6 className={styles['Director-shareholder__question']}>
              {lang.dirShareholder}
          </h6>
          <SwitchButton
            label={{prefix: lang.no, suffix: lang.yes}}
            handleChange={(e) => toggleChange(e, directorNumber)}
            name="sin"
            checked={Number(value[`dir${directorNumber}`]['sin'])}
          />
          {!!Number(value[`dir${directorNumber}`]['sin']) &&
          <Input
            wrapperClassname={styles['Director-shareholder__input']}
            label={lang.percentage}
            value={value[`dir${directorNumber}`].shareholder}
            name="shareholder"
            handleChange={(e) => handleChange(e, directorNumber)}
            error={errors[`shareholder_${directorNumber}`]}
            touched={touched[`shareholder_${directorNumber}`]}
            id={`dir${directorNumber}-shareholder`}
            type="number"
            min="0"
            max="100"
          />}
        </div>
        {isLast &&
          <Submit
            classes={styles['Director-submit']}
            label={lang.continue} icon="chevron-right"
            type="danger"
            padding={35} height={45}
            isDisabled={loading}
          />
        }
      </div>

    </div>
  );
};

export default Director;
