import { genMessage } from './helper';
import modules from 'glob:./lang/**/*.ts';

export default genMessage(modules);
