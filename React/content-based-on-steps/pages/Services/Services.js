import React, {useCallback, useEffect, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {withRouter} from 'react-router-dom';
import store from 'store';
// actions
import {setShareTaxPageStateDone} from "../../actions/shareTax";
import {setCorpInfoPageStateDone} from "../../actions/corpInfo";
import {servicesSetPageStateActive, servicesSetPageStateUntouched} from "../../actions/services";

import i18n from '../../i18n';

// styles
import styles from './Services.module.scss';

// components
import Back from "../../components/common/form/Back";

// helpers
import {checkProvincialFederal} from "../../constants/helperExpressions";

const Services = (props) => {
  const dispatch = useDispatch();

  const dataLocalStorage = store.get('getStartedData');
  const {data} = useSelector(state => state.getStartedReducer);

  const corpTypeName = useMemo(() => data?.jurisdiction ?? dataLocalStorage?.jurisdiction, [data]);

  const language = useSelector(state => state.languageReducer);
  const lang = i18n[language].services;

  const {incorporationType, jurisdiction, price} = useMemo(() => {
    return checkProvincialFederal(lang)(corpTypeName);
  }, [lang]);

  useEffect(() => {
    dispatch(setShareTaxPageStateDone());
    dispatch(setCorpInfoPageStateDone());
    dispatch(servicesSetPageStateActive());

    if(store.get('stepsData')?.shareTax?.length !== 4) {
      props.history.push('/shareTax');
    }


    return () => dispatch(servicesSetPageStateUntouched());
// eslint-disable-next-line
  }, []);

  useEffect(() => {

  })

  const handleBackClick = () => {
    props.history.push('/shareTax');
  };

  const paymentList = []
  const obj = lang.payment;

  const paymentData = store.get('stepsData')?.shareTax;

  for (let i = 1; i < paymentData?.length; i++) {
    delete paymentData[i]?.id;
    delete paymentData[i]?.yearend;
    if (paymentData[i]) {
      for (const [key, value] of Object.entries(paymentData[i])) {
        if (value && value !== '0') {
          paymentList.push(obj[key])
        }
      }
    }
  }
  return (
    <>
      <Back handleClick={handleBackClick} classes={styles['Services__back-btn']} />
      <div className={styles['Services-divider']} />
      <div className={styles['Services-paymentCard']}>
        <h6 className={styles['Services-paymentCard__heading']}>
          {incorporationType}
        </h6>
        <div className={styles['Services-paymentCard__divider']} style={{margin: '6px 0 4px'}} />
        <p className={styles['Services-paymentCard__amount']}>
          250
        </p>
        <p className={styles['Services-paymentCard__amountAdditional']}>
          {lang.government} {price}$
        </p>

        <h6 className={styles['Services-paymentCard__heading']}  style={{marginTop: '10px'}}>
          {lang.followUp}
        </h6>
        <div className={styles['Services-paymentCard__divider']} style={{margin: '6px 0 4px'}} />
          <ul className={styles['Services-paymentCard__list']}>
          {paymentList.map((paymentItem, index) => {
            return (
              <li key={index} className={styles['Services-paymentCard__list_item']}>
                {paymentItem}
              </li>
            )
          })}
        </ul>
      </div>
    </>
  );
};

export default withRouter(Services);
