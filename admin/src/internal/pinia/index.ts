import { createPinia } from 'pinia'
import { createPersistPlugin } from './persist'

const store = createPinia()
store.use(createPersistPlugin())

export { store }
