import React from "react";
import {useSelector} from "react-redux";

import i18n from '../../../../../i18n';

// styles
import styles from '../Contact.module.scss';

// components
import RadioButton from "../../../../../components/common/form/RadioButton";
import Icon from "../../../../../icons/icon";
import HelpText from "../../../../../components/common/layout/HelpText";

const ContactQuestion = ({name, question, handleChange, id, hasFaq, faqContent, value}) => {
    const language = useSelector(state => state.languageReducer);
    const lang = i18n[language].contact;
  return (
    <div className={styles['ContactQuestion']}>
      <div className={styles['ContactQuestion-label']}>
        <span>{question}</span>
        {hasFaq &&
          <>
            <button type="button" className={styles['ContactQuestion-faqBtn']}>
              <Icon name="faq-icon" />
            </button>
            <HelpText
              className={styles['ContactQuestion-helpText']}
              content={faqContent}
            />
          </>
        }
      </div>
      <div className={styles['ContactQuestion-radioRaw']}>
        <RadioButton
          wrapperClassName={styles['ContactQuestion-radio']}
          label={lang.yes}
          value="1"
          name={name}
          isChecked={value === '1'}
          handleChange={handleChange}
          id={`${id}-1`}
        />
        <RadioButton
          wrapperClassName={styles['ContactQuestion-radio']}
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

export default ContactQuestion;
