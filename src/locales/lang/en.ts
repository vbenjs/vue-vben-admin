import { genMessage } from '../helper';
const modules = import.meta.globEager('./en/**/*.ts');
import antdLocale from 'ant-design-vue/es/locale/en_US';
import momentLocale from 'moment/dist/locale/eu';

export default {
  message: {
    ...genMessage(modules, 'en'),
    antdLocale,
  },
  momentLocale,
  momentLocaleName: 'eu',
};
