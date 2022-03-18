import { createPinia } from 'pinia'
import { createPersistPlugin } from './persist'
import { createStorageName } from '@/internal/config'

const pinia = createPinia()

// Persistence plugin, modified from open source, adding namespace support
pinia.use(createPersistPlugin({ namespace: createStorageName() }))

export { pinia }
