import { createAsyncComponent } from '@/internal'
import FullScreen from './FullScreen.vue'
import UserDropDown from './user-dropdown/index.vue'

export const LayoutBreadcrumb = createAsyncComponent(
  () => import('./Breadcrumb.vue'),
)

export const Notify = createAsyncComponent(() => import('./notify/index.vue'))

export { FullScreen, UserDropDown }
