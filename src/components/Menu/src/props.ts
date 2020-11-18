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
  flatItems: {
    type: Array as PropType<Menu[]>,
    default: () => [],
  },
  // 是否显示搜索框
  search: {
    type: Boolean as PropType<boolean>,
    default: true,
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
  type: {
    type: String as PropType<MenuTypeEnum>,
    default: MenuTypeEnum.MIX,
  },
  theme: {
    type: String as PropType<string>,
    default: ThemeEnum.DARK,
  },
  showLogo: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  inlineCollapsed: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  isAppMenu: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  isTop: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  accordion: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  beforeClickFn: {
    type: Function as PropType<Fn>,
    default: null,
  },
};
