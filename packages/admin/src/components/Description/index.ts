import { withInstall } from '@vben-admin/utils'
import description from './src/Description.vue'

export * from './src/typing'
export { useDescription } from './src/useDescription'
export const Description = withInstall(description)
