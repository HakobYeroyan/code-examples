import React from "react";
import {useSelector} from "react-redux";
import i18n from '../../../../../i18n';
// styles
import styles from '../MostRecentOrders.module.scss';

// components
import ModalElement from "./ModalElement";

const ModalBody = ({data}) => {
    const language = useSelector(state => state.languageReducer);
    const lang = i18n[language].dispatch;
  return (
    <div className={styles['ModalBody']}>
      <div className={styles['ModalBody-top']}>
        <span className={styles['ModalBody-top__title']}>
          {lang.orderDetails}
        </span>
        <span className={styles['ModalBody-top__status']}>
          {lang.paymentSuccessful}
        </span>
      </div>
      <div className={styles['ModalBody-details']}>
        <ModalElement
          label={lang.service}
          value={data?.service}
        />
        <ModalElement
          label={lang.paymentInform}
          value={lang.paymentSuccessful}
        />
        <ModalElement
          label={lang.orderStatus}
          value={data?.order_status}
        />
        <ModalElement
          label={lang.paymentMode}
          value={data?.payment_methot}
        />
        <ModalElement
          label={lang.servicesEnabled}
          value={data?.services_enabled}
        />
        <ModalElement
          value={lang.corporateMaintenance}
        />
        <ModalElement
          label={lang.totalCharge}
          value={`$${data?.total_charge}`}
        />
      </div>
    </div>
  );
};

export default ModalBody;
