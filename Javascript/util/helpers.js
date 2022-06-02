import {
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  numberRegexp,
  emailRegexp,
} from "./constants.js";

export const validateAuthForm = (name, value, passwordValue = '') => {
  switch(name) {
    case firstName: {
      return !numberRegexp.test(value) && value.length >= 2;
    } 
    case lastName: {
      return !numberRegexp.test(value) && value.length >= 2;
    }
    case email: {
      return emailRegexp.test(value);
    }
    case password: {
      return value.length >= 8;
    }
    case confirmPassword: {
      return value === passwordValue;
    }
    default: {
      return false;
    }
  }
}

export const isFormValid = (...values) => values.every(Boolean);

export const createLoader = (markup) => {
  const laoderWrapper = document.createElement('div');
  laoderWrapper.setAttribute('class', 'loader__wrapper');
  laoderWrapper.innerHTML = markup;
  return laoderWrapper;
};

export const createModal = (markup) => {
  const modal = document.createElement('div');
  modal.setAttribute('class', 'modal');
  modal.innerHTML = `
    <div class="modal__overlay" data-close>
      <div class="modal__content">
        ${markup}
      </div>
    </div>
  `;

  return modal;
}

export const setHtmlFromArray = ($element, arr = [], rendererFunction) => {
  const markup = arr && arr.length ? arr.map(rendererFunction).join('') : null;
  $element.innerHTML = markup;
}