import React from "react";
import {useSelector} from "react-redux";

import i18n from '../../../../../i18n';

// styles
import styles from '../WhatBusinessSell.module.scss';

// components
import RadioButton from "../../../../../components/common/form/RadioButton";

const WhatBusinessSellQuestion = ({name, question, handleChange, id, value}) => {

    const language = useSelector(state => state.languageReducer);
    const lang = i18n[language].shareTax;

  return (
    <div className={styles['WhatBusinessSellQuestion']}>
      <p className={styles['WhatBusinessSellQuestion-label']}>
        {question}
      </p>
      <div className={styles['WhatBusinessSellQuestion-radioRaw']}>
        <RadioButton
          wrapperClassName={styles['WhatBusinessSellQuestion-radio']}
          label={lang.yes}
          value="1"
          name={name}
          isChecked={value === '1'}
          handleChange={handleChange}
          id={`${id}-1`}
        />
        <RadioButton
          wrapperClassName={styles['WhatBusinessSellQuestion-radio']}
          label={lang.no}
          value="0"
          name={name}
          isChecked={value === '0'}
          handleChange={handleChange}
          id={`${id}-0`}
        />
      </div>
    </div>
  );
};

export default WhatBusinessSellQuestion;
