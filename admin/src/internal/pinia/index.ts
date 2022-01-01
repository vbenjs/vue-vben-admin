import { createPinia } from 'pinia'
import persistPlugin from './persist'

const store = createPinia()
store.use(persistPlugin)

export { store }
