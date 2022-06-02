import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {withRouter} from 'react-router-dom';
import store from "../../../../store";

import i18n from '../../../../i18n';
import {clearData, servicesSetRedirected} from "../../../../actions/payment";

// styles
import styles from './Successful.module.scss';

// components
import Icon from "../../../../icons/icon";

// assets
import paymentImg from '../../../../assets/images/payment-img.png';

const Successful = ({history}) => {
  const dispatch = useDispatch();

  const language = useSelector(state => state.languageReducer);
  const lang = i18n[language].services;

  const {redirected} = useSelector(state => state.paymentReducer);

  useEffect(() => {
    if (!redirected) {
      const timeout = setTimeout(() => {
        history.push('/complete');
        //dispatch(clearData());
        // dispatch(servicesSetRedirected());
      }, 3000);

      return () => clearTimeout(timeout);
    }
  });

  return (
    <div className={styles['Successful']}>
      <div className={styles['Successful-message']}>
        <div className={styles['Successful-message__iconWrapper']}>
          <Icon name="double-tick" />
        </div>
        <p className={styles['Successful-message__content']}>
            {lang.success.payment}<br/>{lang.success.successful}
        </p>
      </div>
      {!redirected ? <p className={styles['Successful-redirecting']}>
          {lang.success.redirectingMessage}
      </p> : null}
      <div className={styles['Successful-imgWrapper']}>
        <img className={styles['Successful-img']} src={paymentImg} alt="payment"/>
      </div>
    </div>
  );
};

export default withRouter(Successful);
