import { componentFactory } from '/@/internal/factory'
import FullScreen from './FullScreen.vue'
import UserDropDown from './user-dropdown/index.vue'

export const LayoutBreadcrumb = componentFactory(
  () => import('./Breadcrumb.vue'),
)

export const Notify = componentFactory(() => import('./notify/index.vue'))

export const ErrorAction = componentFactory(() => import('./ErrorAction.vue'))

export { FullScreen, UserDropDown }
