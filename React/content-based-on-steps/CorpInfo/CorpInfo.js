import React, {useEffect} from "react";
import store from "store";
import {useSelector, useDispatch} from 'react-redux';
import {setCorpInfoPageStateActive, setCorpInfoPageStateDone} from "../../actions/corpInfo";
import {withRouter} from 'react-router-dom';
import steps from "./steps";

const CorpInfo = (props) => {
  const dispatch = useDispatch();
  const corpInfoState = useSelector(state => state.corpInfoReducer);
  const {step, data} = corpInfoState;
  const {content : Content} = steps[step];

  const dataLocalStorage = store.get('stepsData')?.corpInfo?.[step];

  useEffect(() => {
    dispatch(setCorpInfoPageStateActive());

    if(!store.get('getStartedData')) {
      props.history.push('/');
    }

    return () => dispatch(setCorpInfoPageStateDone());
// eslint-disable-next-line
  }, []);

  return (
    <>
      <Content data={data?.[step]} dataLocalStorage={dataLocalStorage} step={step} />
    </>
  );
};

export default withRouter(CorpInfo);