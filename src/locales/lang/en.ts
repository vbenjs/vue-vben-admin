import { generateModuleMessage, genMessage } from '../helper';
import antdLocale from 'ant-design-vue/es/locale/en_US';
import { deepMerge } from '@/utils';

const modules = import.meta.glob('./en/**/*.{json,ts,js}', { eager: true });
const modulesLocales = import.meta.glob('../../modules/**/lang/en_US.ts', { eager: true });
export default {
  message: {
    ...deepMerge(
      genMessage(modules as Recordable<Recordable>, 'en'),
      generateModuleMessage(modulesLocales as Recordable<Recordable>),
    ),
    antdLocale,
  },
  dateLocale: null,
  dateLocaleName: 'en',
};
