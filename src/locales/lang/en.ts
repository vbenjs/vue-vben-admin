import { genMessage } from '../helper';
import antdLocale from 'ant-design-vue/es/locale/en_US';
// import momentLocale from 'moment/dist/locale/en-us';

const modules = import.meta.globEager('./en/**/*.ts');
export default {
  message: {
    ...genMessage(modules, 'en'),
    antdLocale,
  },
  momentLocale: null,
  momentLocaleName: 'en',
};
