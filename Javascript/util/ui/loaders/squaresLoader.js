import Loader from '../loader.js';
import { createLoader } from '../../helpers.js';
import { squaresLoading } from './markups/index.js';

export default new Loader(createLoader(squaresLoading));
