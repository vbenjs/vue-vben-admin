import { genMessage } from '../helper'

const modules = import.meta.globEager('./en/**/*.ts')
export default {
  message: {
    ...genMessage(modules, 'en'),
  },
  dateLocale: null,
  dateLocaleName: 'en',
}
