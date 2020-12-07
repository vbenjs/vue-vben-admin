import type { Menu } from '/@/router/types';
import type { PropType } from 'vue';

import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';
import { ThemeEnum } from '/@/enums/appEnum';
export const basicProps = {
  items: {
    type: Array as PropType<Menu[]>,
    default: () => [],
  },
  appendClass: {
    type: Boolean as PropType<boolean>,
    default: false,
  },

  collapsedShowTitle: {
    type: Boolean as PropType<boolean>,
    default: false,
  },

  // 最好是4 倍数
  inlineIndent: {
    type: Number as PropType<number>,
    default: 20,
  },
  // 菜单组件的mode属性
  mode: {
    type: String as PropType<MenuModeEnum>,
    default: MenuModeEnum.INLINE,
  },
  showLogo: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  type: {
    type: String as PropType<MenuTypeEnum>,
    default: MenuTypeEnum.MIX,
  },
  theme: {
    type: String as PropType<string>,
    default: ThemeEnum.DARK,
  },
  inlineCollapsed: {
    type: Boolean as PropType<boolean>,
    default: false,
  },

  isHorizontal: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  accordion: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  beforeClickFn: {
    type: Function as PropType<(key: string) => Promise<boolean>>,
  },
};
