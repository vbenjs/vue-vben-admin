import store from '/@/store';
import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';
import { VuexModule, Module, getModule, Mutation } from 'vuex-module-decorators';

import { appStore } from '/@/store/modules/app';

const NAME = 'menu';
hotModuleUnregisterModule(NAME);
@Module({ namespaced: true, name: NAME, dynamic: true, store })
class Menu extends VuexModule {
  // 是否开始拖拽
  private dragStartState = false;

  private currentTopSplitMenuPathState = '';

  /**
   * @description: 获取窗口名称
   */
  get getCollapsedState() {
    return appStore.getProjectConfig.menuSetting.collapsed;
  }

  get getCurrentTopSplitMenuPathState() {
    return this.currentTopSplitMenuPathState;
  }

  get getDragStartState() {
    return this.dragStartState;
  }

  get getMenuWidthState() {
    return appStore.getProjectConfig.menuSetting.menuWidth;
  }

  @Mutation
  commitDragStartState(dragStart: boolean): void {
    this.dragStartState = dragStart;
  }

  @Mutation
  commitCurrentTopSplitMenuPathState(path: string): void {
    this.currentTopSplitMenuPathState = path;
  }

  // 改变菜单展开状态
  @Mutation
  commitCollapsedState(collapsed: boolean): void {
    // this.collapsedState = collapsed;
    appStore.commitProjectConfigState({
      menuSetting: {
        collapsed: collapsed,
      },
    });
  }

  @Mutation
  commitMenuWidthState(menuWidth: number): void {
    // this.menuWidthState = menuWidth;
    appStore.commitProjectConfigState({
      menuSetting: {
        menuWidth: menuWidth,
      },
    });
  }
}

export { Menu };
export const menuStore = getModule<Menu>(Menu);
