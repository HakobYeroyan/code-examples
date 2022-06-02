import React, {useEffect} from "react";
import {useSelector, useDispatch} from 'react-redux';
import {withRouter} from 'react-router-dom';
import store from "store";

import steps from "./steps";

import {setCorpInfoPageStateDone} from "../../actions/corpInfo";
import {setShareTaxPageStateActive, setShareTaxPageStateUntouched} from "../../actions/shareTax";

const ShareTax = (props) => {
  const dispatch = useDispatch();
  const shareTaxState = useSelector(state => state.shareTaxReducer);
  const {step, data} = shareTaxState;
  const {content : Content} = steps[step];


  const dataLocalStorage = store.get('stepsData')?.shareTax?.[step];

  useEffect(() => {
    dispatch(setCorpInfoPageStateDone());
    dispatch(setShareTaxPageStateActive());

    if(store.get('stepsData')?.corpInfo?.length !== 5) {
      props.history.push('/corpInfo')
    }

    return () => dispatch(setShareTaxPageStateUntouched());
// eslint-disable-next-line
  }, []);

  return (
    <>
      <Content data={data?.[step]} dataLocalStorage={dataLocalStorage} step={step} />
    </>
  );
};

export default withRouter(ShareTax);