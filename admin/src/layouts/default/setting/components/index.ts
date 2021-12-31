import { componentFactory } from '/@/internal/factory'

export const TypePicker = componentFactory(() => import('./TypePicker.vue'))
export const ThemeColorPicker = componentFactory(
  () => import('./ThemeColorPicker.vue'),
)
export const SettingFooter = componentFactory(
  () => import('./SettingFooter.vue'),
)
export const SwitchItem = componentFactory(() => import('./SwitchItem.vue'))
export const SelectItem = componentFactory(() => import('./SelectItem.vue'))
export const InputNumberItem = componentFactory(
  () => import('./InputNumberItem.vue'),
)
