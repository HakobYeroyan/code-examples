import React from "react";
import {useSelector} from "react-redux";
import i18n from '../../i18n';

const Complete = () => {
  const language = useSelector(state => state.languageReducer);
  const lang = i18n[language].services;

  return (
    <div>
        <h1>{lang.complete.title}</h1>
        <p>{lang.complete.email}</p>
        <p>{lang.complete.thank_you}</p>
    </div>
  );
};

export default Complete;