import { createAsyncComponent } from '/@/internal/factory'
import FullScreen from './FullScreen.vue'
import UserDropDown from './user-dropdown/index.vue'

export const LayoutBreadcrumb = createAsyncComponent(
  () => import('./Breadcrumb.vue'),
)

export const Notify = createAsyncComponent(() => import('./notify/index.vue'))

export const ErrorAction = createAsyncComponent(
  () => import('./ErrorAction.vue'),
)

export { FullScreen, UserDropDown }
