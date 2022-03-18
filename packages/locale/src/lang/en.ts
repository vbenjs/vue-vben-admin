import { genMessage } from '../helper'
import uiFrameLocale from 'ant-design-vue/es/locale/en_US'

const modules = import.meta.globEager('./en/**/*.ts')
export default {
  message: {
    ...genMessage(modules, 'en'),
    uiFrameLocale,
  },
  dateLocale: null,
  dateLocaleName: 'en',
}
