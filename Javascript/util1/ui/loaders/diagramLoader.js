import Loader from '../loader.js';
import { createLoader } from '../../helpers.js';
import { diagramLoading } from './markups/index.js';

export default new Loader(createLoader(diagramLoading));
