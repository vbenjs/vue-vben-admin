import type { Menu as MenuType } from '/@/router/types';
import type { MenuState } from './types';
import type { Ref } from 'vue';

import { isString } from '/@/utils/is';
import { unref } from 'vue';
import { es6Unique } from '/@/utils';
import { getAllParentPath } from '/@/utils/helper/menuHelper';

interface UseSearchInputOptions {
  menuState: MenuState;
  flatMenusRef: Ref<MenuType[]>;
  emit: EmitType;
  handleMenuChange: Fn;
}
export function useSearchInput({
  menuState,
  flatMenusRef,
  handleMenuChange,
  emit,
}: UseSearchInputOptions) {
  /**
   * @description: 输入框搜索
   */
  function handleInputChange(value?: string): void {
    if (!isString(value)) {
      value = (value as any).target.value;
    }
    if (!value) {
      handleMenuChange && handleMenuChange();
    }

    menuState.searchValue = value || '';
    if (!value) {
      menuState.openKeys = [];
      return;
    }

    const flatMenus = unref(flatMenusRef);
    let openKeys: string[] = [];
    for (const menu of flatMenus) {
      const { name, path } = menu;
      if (!name.includes(value)) {
        continue;
      }
      openKeys = openKeys.concat(getAllParentPath(flatMenus, path));
    }
    openKeys = es6Unique(openKeys);
    menuState.openKeys = openKeys;
  }

  // 搜索框点击
  function handleInputClick(e: any): void {
    emit('clickSearchInput', e);
  }

  return { handleInputChange, handleInputClick };
}
