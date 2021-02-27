import { genMessage } from '../helper';
const modules = import.meta.globEager('./zh_CN/**/*.ts');
import antdLocale from 'ant-design-vue/es/locale/zh_CN';
import momentLocale from 'moment/dist/locale/zh-cn';

export default {
  message: {
    ...genMessage(modules, 'zh_CN'),
    antdLocale,
  },
  momentLocale,
  momentLocaleName: 'zh-cn',
};
