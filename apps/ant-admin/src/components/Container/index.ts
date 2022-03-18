import { withInstall } from '@pkg/utils'
import collapseContainer from './src/collapse/CollapseContainer.vue'
import scrollContainer from './src/ScrollContainer.vue'

export const CollapseContainer = withInstall(collapseContainer)
export const ScrollContainer = withInstall(scrollContainer)

export * from './src/typing'
