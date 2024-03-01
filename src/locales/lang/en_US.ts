import { generateModuleMessage, genMessage } from '../helper';
import antdLocale from 'ant-design-vue/es/locale/en_US';
import { deepMerge } from '@/utils';
import vxeEnUS from 'vxe-table/lib/locale/lang/en-US';
import smartTableEnUS from '@/components/SmartTable/src/lang/en_US';

const modules = import.meta.glob('./en/**/*.{json,ts,js}', { eager: true });
const modulesLocales = import.meta.glob('../../modules/**/lang/en_US.ts', { eager: true });
export default {
  message: {
    ...deepMerge(
      genMessage(modules as Recordable<Recordable>, 'en'),
      generateModuleMessage(modulesLocales as Recordable<Recordable>),
    ),
    ...smartTableEnUS,
    antdLocale,
    ...vxeEnUS,
  },
  dateLocale: null,
  dateLocaleName: 'en',
};
