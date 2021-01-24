import { genMessage } from './helper';
const modules = import.meta.globEager('./lang/**/*.ts');

export default genMessage(modules);
