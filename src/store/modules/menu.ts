import store from '@/store';
import { VuexModule, Module, getModule, Mutation } from 'vuex-module-decorators';

import { appStore } from '@/store/modules/app';

import { MenuItem } from '@/router/types';

// import { permissionStore } from '@/store/modules/permission';
export interface MenuState {
  // 菜单展开状态
  collapsedState: boolean;
  // 菜单宽度
  menuWidthState: number;
  //  拖拽状态
  dragStartState: boolean;
  // 菜单列表
  menuListState: MenuItem[];
  // 扁平化菜单数组
  flatMenuListState: MenuItem[];
}
@Module({ namespaced: true, name: 'menu', dynamic: true, store })
class Menu extends VuexModule implements MenuState {
  // 默认展开
  collapsedState = appStore.getProjCfg.menuSetting.collapsed;

  // 菜单宽度
  menuWidthState = appStore.getProjCfg.menuSetting.menuWidth;

  // 是否开始拖拽
  dragStartState = false;

  menuListState: MenuItem[] = [];

  flatMenuListState: MenuItem[] = [];

  /**
   * @description: 获取窗口名称
   */
  get getCollapsedState() {
    return appStore.getProjCfg.menuSetting.collapsed;
  }

  get getDragStartState() {
    return this.dragStartState;
  }

  get getMenuWidthState() {
    return appStore.getProjCfg.menuSetting.menuWidth;
  }

  @Mutation
  commitDragStartState(dragStart: boolean): void {
    this.dragStartState = dragStart;
  }

  @Mutation
  commitMenuListState(menuList: MenuItem[]): void {
    this.menuListState = menuList;
  }

  @Mutation
  commitFlatMenuListState(menuList: MenuItem[]): void {
    this.flatMenuListState = menuList;
  }

  // 改变菜单展开状态
  @Mutation
  commitCollapsedState(collapsed: boolean): void {
    this.collapsedState = collapsed;
    appStore.commitProjCfgState({
      menuSetting: {
        ...appStore.getProjCfg.menuSetting,
        collapsed: collapsed,
      },
    });
  }

  @Mutation
  commitMenuWidthState(menuWidth: number): void {
    this.menuWidthState = menuWidth;
    appStore.commitProjCfgState({
      menuSetting: {
        ...appStore.getProjCfg.menuSetting,
        menuWidth: menuWidth,
      },
    });
  }
}

export { Menu };
export const menuStore = getModule<Menu>(Menu);
