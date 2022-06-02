import React from "react";
import {useSelector} from "react-redux";

import states from "./states";

const Payment = () => {
  const reduxPaymentState = useSelector(state => state.paymentReducer);
  const {content: Content} = states[reduxPaymentState.pageState];
  // const {content: Content} = states['inProcess'];

  return (
    <>
      <Content />
    </>
  );
};

export default Payment;