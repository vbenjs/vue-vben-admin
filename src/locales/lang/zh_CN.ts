import antdLocale from 'ant-design-vue/es/locale/zh_CN';

import { genMessage } from '../helper';

const modules = import.meta.globEager('./zh-CN/**/*.ts');
export default {
  message: {
    ...genMessage(modules, 'zh-CN'),
    antdLocale,
  },
};
