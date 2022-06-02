import React from "react";

import styles from '../MostRecentOrders.module.scss';

const ModalElement = ({label, value}) => {
  return (
    <div className={styles['ModalElement']}>
      <p className={styles['ModalElement-label']}>
        {label}
      </p>
      <p className={styles['ModalElement-value']}>
        {value}
      </p>
    </div>
  );
};

export default ModalElement;