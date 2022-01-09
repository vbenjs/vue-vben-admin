import type { Menu } from '@/router/types'
import type { PropType } from 'vue'
import type { MenuTheme } from 'ant-design-vue'
import type { MenuMode } from 'ant-design-vue/lib/menu/src/interface'

import { MenuModeEnum, MenuTypeEnum, ThemeEnum } from '@admin/tokens'

export const basicProps = {
  items: {
    type: Array as PropType<Menu[]>,
    default: () => [],
  },
  collapsedShowTitle: { type: Boolean },
  // 最好是4 倍数
  inlineIndent: { type: Number, default: 20 },
  // 菜单组件的mode属性
  mode: {
    type: String as PropType<MenuMode>,
    default: MenuModeEnum.INLINE,
  },

  type: {
    type: String as PropType<MenuTypeEnum>,
    default: MenuTypeEnum.MIX,
  },
  theme: {
    type: String as PropType<MenuTheme>,
    default: ThemeEnum.DARK,
  },
  inlineCollapsed: { type: Boolean },
  mixSider: { type: Boolean },

  isHorizontal: { type: Boolean },
  accordion: { type: Boolean, default: true },
  beforeClickFn: {
    type: Function as PropType<(key: string) => Promise<boolean>>,
  },
}

export const itemProps = {
  item: {
    type: Object as PropType<Menu>,
    default: {},
  },
  level: { type: Number, default: 20 },
  theme: { type: String, validator: (v) => ['dark', 'light'].includes(v) },
  showTitle: { type: Boolean },
  isHorizontal: { type: Boolean },
}

export const contentProps = {
  item: {
    type: Object as PropType<Menu>,
    default: null,
  },
  showTitle: { type: Boolean, default: true },
  level: { type: Number, default: 0 },
  isHorizontal: { type: Boolean, default: true },
}
