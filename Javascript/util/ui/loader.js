import { relativePosition, staticPosition } from '../constants.js';

export default class Loader {
  constructor(loader) {
    this.loader = typeof (loader) === 'function' ? loader() : loader;
  }

  #currentElement = null;

  #setPosition(position, element) {
    element.style.position = position;
  }

  showLoader(element) {
    this.#currentElement = element;
    this.#setPosition(relativePosition, element);
    element.appendChild(this.loader);
  }

  hideLoader() {
    this.#setPosition(staticPosition, this.#currentElement);
    this.#currentElement.removeChild(this.loader);
  }
}