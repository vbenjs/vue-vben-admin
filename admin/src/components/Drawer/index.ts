import { withInstall } from '@admin/utils'
import basicDrawer from './src/BasicDrawer.vue'

export const BasicDrawer = withInstall(basicDrawer)
export * from './src/typing'
export { useDrawer, useDrawerInner } from './src/useDrawer'
