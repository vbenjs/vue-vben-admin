import { createPinia } from 'pinia'
import { createPersistPlugin } from './persist'
import { createStorageName } from '@/internal/config'

const pinia = createPinia()

pinia.use(createPersistPlugin({ namespace: createStorageName() }))

export { pinia }
