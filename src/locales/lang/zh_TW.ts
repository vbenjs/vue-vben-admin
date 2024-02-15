import { genMessage } from '../helper';
import antdLocale from 'ant-design-vue/es/locale/zh_TW';

const modules = import.meta.glob('./zh-TW/**/*.json', { eager: true });
export default {
  message: {
    ...genMessage(modules as Recordable<Recordable>, 'zh-TW'),
    antdLocale,
  },
};
