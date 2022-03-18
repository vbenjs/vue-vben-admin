import { genMessage } from '../helper'
import uiFrameLocale from 'ant-design-vue/es/locale/zh_CN'

const modules = import.meta.globEager('./zh-CN/**/*.ts')
export default {
  message: {
    ...genMessage(modules, 'zh-CN'),
    uiFrameLocale,
  },
}
