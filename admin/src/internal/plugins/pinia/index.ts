import { createPinia } from 'pinia'
import { createPersistPlugin } from './persist'

import { createStorageName } from '/@/internal/config'

const store = createPinia()
store.use(createPersistPlugin({ namespace: createStorageName() }))

export { store }
