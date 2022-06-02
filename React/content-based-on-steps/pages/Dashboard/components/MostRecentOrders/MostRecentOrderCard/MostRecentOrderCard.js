import React from "react";
import {useSelector} from "react-redux";
import i18n from '../../../../../i18n';
// styles
import styles from './MostRecentOrderCard.module.scss';

const MostRecentOrderCard = ({service, status, payment, id, handleDetailsClick}) => {
  const language = useSelector(state => state.languageReducer);
  const lang = i18n[language].dispatch;
  return (
    <div className={styles['MostRecentOrderCard__wrapper']}>
      <div className={styles['MostRecentOrderCard']}>
        <div className={styles['MostRecentOrderCard-service']}>
          <p className={styles['MostRecentOrderCard-service__label']}>
              {lang.service}
          </p>
          <p className={styles['MostRecentOrderCard-service__value']}>
            {service}
          </p>
        </div>
        <div className={styles['MostRecentOrderCard-status']}>
          <p className={styles['MostRecentOrderCard-status__label']}>
              {lang.orderStatus}
          </p>
          <p className={styles['MostRecentOrderCard-status__value']}>
            {status ? status : 'Processing'}
          </p>
        </div>
        <div className={styles['MostRecentOrderCard-payment']}>
          <p style={{color: payment === 'SUCCEEDED' ? '#2EC114' : '#F35162'}} className={styles['MostRecentOrderCard-payment__status']}>
            {payment === 'SUCCEEDED' ? lang.paymentSuccessful : lang.paymentDeclined}
          </p>
          {payment === 'SUCCEEDED' &&
          <button className={styles['MostRecentOrderCard-payment__details']} onClick={() => handleDetailsClick(id)}>
              {lang.orderDetails}
          </button>}
        </div>
      </div>
    </div>
  );
};

export default MostRecentOrderCard;
