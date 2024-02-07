import { generateModuleMessage, genMessage } from '../helper';
import antdLocale from 'ant-design-vue/es/locale/zh_CN';
import { deepMerge } from '@/utils';

const modules = import.meta.glob('./zh-CN/**/*.{json,ts,js}', { eager: true });
const modulesLocales = import.meta.glob('../../modules/**/lang/zh_CN.ts', { eager: true });
export default {
  message: {
    ...deepMerge(
      genMessage(modules as Recordable<Recordable>, 'zh-CN'),
      generateModuleMessage(modulesLocales as Recordable<Recordable>),
    ),
    antdLocale: {
      ...antdLocale,
      DatePicker: deepMerge(
        antdLocale.DatePicker,
        genMessage(modules as Recordable<Recordable>, 'zh-CN').antdLocale.DatePicker,
      ),
    },
  },
};
