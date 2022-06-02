import React from "react";
import {useDispatch, useSelector} from "react-redux";

// styles
import styles from './Failed.module.scss';

// components
import Icon from "../../../../icons/icon";
import Submit from "../../../../components/common/form/Submit";

// assets
import paymentImg from "../../../../assets/images/payment-img.png";

// utils
import i18n from "../../../../i18n";

import {servicesSetPageStateCart} from "../../../../actions/payment";


const Failed = () => {
  const dispatch = useDispatch();
  const language = useSelector(state => state.languageReducer);
  const lang = i18n[language].services;

  const handleClick = () => {
    dispatch(servicesSetPageStateCart());
  }

  return (
    <div className={styles['Failed']}>
      <div className={styles['Failed-message']}>
        <div className={styles['Failed-message__iconWrapper']}>
          <Icon name="failed-icon" />
        </div>
        <p className={styles['Failed-message__content']}>
          {lang.failed.payment}<br/>{lang.failed.failed}
        </p>
      </div>
      <Submit
        btnType="button"
        type="danger"
        classes={styles['Failed-tryAgain']}
        label={lang.failed.tryAgain}
        padding={13}
        height={37}
        icon="refresh-icon"
        handleClick={handleClick}
      />
      <div className={styles['Failed-imgWrapper']}>
        <img className={styles['Failed-img']} src={paymentImg} alt="payment"/>
      </div>
    </div>
  );
};

export default Failed;