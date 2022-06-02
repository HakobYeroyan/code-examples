import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

import {getUserData} from "../../../../actions/dashboard";

// styles
import styles from './ProfileDetails.module.scss';

// utils
import i18n from "../../../../i18n";

const ProfileDetails = () => {
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.adminPanelReducer);
  const language = useSelector(state => state.languageReducer);
  const dashboardWithLang = i18n[language].dashboard;

  useEffect(() => {
    dispatch(getUserData());
// eslint-disable-next-line
  }, []);

  return (
    <div className={styles['ProfileDetails']}>
      <h6 className={styles['ProfileDetails-heading']}>
        {dashboardWithLang.profileDetails}
      </h6>
      <div className={styles['ProfileDetails-content']}>
        {userData?.fname ? <p className={styles['ProfileDetails-info']}>
            <span className={styles['ProfileDetails-info__label']}>{dashboardWithLang.firstName}:</span> <span className={styles['ProfileDetails-info__value']}>{userData?.fname}</span>
        </p> : null}

        {userData?.lname ? <p className={styles['ProfileDetails-info']}>
            <span className={styles['ProfileDetails-info__label']}>{dashboardWithLang.lastName}:</span> <span className={styles['ProfileDetails-info__value']}>{userData?.lname}</span>
        </p> : null}

        {userData?.email ? <p className={styles['ProfileDetails-info']}>
            <span className={styles['ProfileDetails-info__label']}>{dashboardWithLang.email}:</span> <span className={styles['ProfileDetails-info__value']}>{userData?.email}</span>
        </p> : null}

        {userData?.phone ? <p className={styles['ProfileDetails-info']}>
            <span className={styles['ProfileDetails-info__label']}>{dashboardWithLang.telephone}:</span> <span className={styles['ProfileDetails-info__value']}>{userData?.phone}</span>
        </p> : null}
      </div>
    </div>
  );
};

export default ProfileDetails;