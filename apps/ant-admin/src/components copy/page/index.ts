import { withInstall } from '@pkg/utils'

import pageFooter from './src/PageFooter.vue'
import pageWrapper from './src/PageWrapper.vue'

export const PageFooter = withInstall(pageFooter)
export const PageWrapper = withInstall(pageWrapper)

export const PageWrapperFixedHeightKey = 'PageWrapperFixedHeight'
