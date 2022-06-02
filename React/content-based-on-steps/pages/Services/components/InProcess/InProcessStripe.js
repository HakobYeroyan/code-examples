import React, {useState} from "react";
import {useSelector} from "react-redux";
import {
  Elements,
} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';


// components
import InProcess from "./InProcess";
import axiosApi from "../../../../axiosApi";
const InProcessStripe = () => {

  const language = useSelector(state => state.languageReducer);

  const [key, setKey] = useState(null);
  axiosApi.post('payment/get_key').then((res) => {
    setKey(res.data);
  });

  if(!key) {
    return (
      <p>Loading...</p>
    );
  }

  return (
    <Elements stripe={loadStripe(key,{locale: language})}>
      <InProcess/>
    </Elements>
  );
};
export default InProcessStripe;
