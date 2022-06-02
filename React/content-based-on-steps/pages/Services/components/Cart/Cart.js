import React, {useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import store from "store";

import {servicesSetPageStateInProcess} from "../../../../actions/payment";

// styles
import styles from './Cart.module.scss';

import i18n from '../../../../i18n';

// components
import Submit from "../../../../components/common/form/Submit";

// helpers
import {checkProvincialFederal} from "../../../../constants/helperExpressions";

const Cart = () => {
  const dispatch = useDispatch();
  const language = useSelector(state => state.languageReducer);
  const lang = i18n[language].services;
  const handleClick = () => {
    store.set('BillingDetails', billing_details);
    dispatch(servicesSetPageStateInProcess());
  };

  const dataLocalStorage = store.get('getStartedData');
  const {data} = useSelector(state => state.getStartedReducer);

  const corpTypeName = useMemo(() => data?.jurisdiction ?? dataLocalStorage?.jurisdiction, [data]);

  const {jurisdiction, price} = useMemo(() => {
    return checkProvincialFederal(lang)(corpTypeName);
  }, [lang]);


  const government = useMemo(() => {
    if(language === 'en') {
      return `Government fees always applicable (${jurisdiction.toUpperCase()})`;
    }

    return `Frais gouvernementaux (${jurisdiction.toUpperCase()}) toujours applicable`
  }, [lang]);

  const roundToTwo = (num) =>  {
    return +(Math.round(num + "e+2")  + "e-2");
  }

  const incorporation_price  = 250;
  const sub_total = Number(price) + incorporation_price;
  const qst = roundToTwo(sub_total * 0.09975);
  const gst = roundToTwo(sub_total * 0.05)
  const total = roundToTwo(sub_total + qst + gst);
  
  const billing_details = {
    incorporation_price: incorporation_price.toFixed(2),
    government_price: Number(price).toFixed(2),
    sub_total: (Number(price) + incorporation_price).toFixed(2),
    qst: roundToTwo(sub_total * 0.09975).toFixed(2),
    gst: roundToTwo(sub_total * 0.05).toFixed(2),
    total: roundToTwo(sub_total + qst + gst).toFixed(2)
  }
  

  return (
    <div className={styles['Cart']}>
      <h6 className={styles['Cart-heading']}>
          {lang.card}
      </h6>
      <div className={styles['Cart-content']}>
        <div className={styles['Cart-bill']}>
          <div className={styles['Cart-bill__standard']}>
            <p className={styles['Cart-bill__standard_value']}>
                {lang.standardIncorporation}
            </p>
            <p className={styles['Cart-bill__standard_amount']}>
              {Number(incorporation_price).toFixed(2)}
            </p>
          </div>
          <div className={styles['Cart-bill__fees']}>
            <p className={styles['Cart-bill__fees_value']}>
                {government}
            </p>
            <p className={styles['Cart-bill__fees_amount']}>
              {Number(price).toFixed(2)}
            </p>
          </div>
          <div className={styles['Cart-bill__fees']}>
            <p className={styles['Cart-bill__fees_value']}>
                {lang.cart.sub_total}
            </p>
            <p className={styles['Cart-bill__fees_amount']}>
              {sub_total.toFixed(2)}
            </p>
          </div>
          <hr />
          <div className={styles['Cart-bill__fees']}>
            <p className={styles['Cart-bill__fees_value']}>
                {lang.cart.gst}
            </p>
            <p className={styles['Cart-bill__fees_amount']}>
              {gst.toFixed(2)}
            </p>
          </div>
          <div className={styles['Cart-bill__fees']}>
            <p className={styles['Cart-bill__fees_value']}>
                {lang.cart.qst}
            </p>
            <p className={styles['Cart-bill__fees_amount']}>
              {qst.toFixed(2)}
            </p>
          </div>
          <div className={styles['Cart-bill__fees']}>
            <p className={styles['Cart-bill__fees_value']}>
                {lang.cart.total}
            </p>
            <p className={styles['Cart-bill__fees_amount']}>
              {total.toFixed(2)}
            </p>
          </div>
          <div className={styles['Cart-divider']} />
        </div>
        <Submit
          label={lang.ProceedToPayment}
          icon="chevron-right"
          type="danger"
          padding={15}
          height={37}
          classes={styles['Cart__submit-btn']}
          btnType="button"
          handleClick={handleClick}
        />
      </div>
    </div>
  );
};

export default Cart;
