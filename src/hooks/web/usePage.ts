import type { RouteLocationRaw, Router } from 'vue-router';

import { PageEnum } from '@/enums/pageEnum';
import { unref } from 'vue';

import { useRouter } from 'vue-router';
import { REDIRECT_NAME } from '@/router/constant';
import { isHttpUrl } from '@/utils/is';
import { openWindow } from '@/utils';

import { useMultipleTabStore } from '@/store/modules/multipleTab';

export type PathAsPageEnum<T> = T extends { path: string } ? T & { path: PageEnum } : T;
export type RouteLocationRawEx = PathAsPageEnum<RouteLocationRaw>;

function handleError(e: Error) {
  console.error(e);
}

export enum GoType {
  'replace',
  'after',
}

/**
 * page switch
 */
export function useGo(_router?: Router) {
  const { push, replace, currentRoute } = _router || useRouter();

  function go(opt?: RouteLocationRawEx): void;
  function go(opt: RouteLocationRawEx, isReplace: boolean): void;
  function go(opt: RouteLocationRawEx, goType: GoType): void;
  function go(
    opt: RouteLocationRawEx = PageEnum.BASE_HOME,
    goTypeOrIsReplace: boolean | GoType = false,
  ) {
    if (!opt) {
      return;
    }
    let path = unref(opt) as string;
    if (path[0] === '/') {
      path = path.slice(1);
    }
    if (isHttpUrl(path)) {
      return openWindow(path);
    }

    const isReplace = goTypeOrIsReplace === true || goTypeOrIsReplace === GoType.replace;
    const isAfter = goTypeOrIsReplace === GoType.after;

    if (isReplace) {
      replace(opt).catch(handleError);
    } else if (isAfter) {
      const tabStore = useMultipleTabStore();
      const currentName = unref(currentRoute).name;
      // 当前 tab
      const currentIndex = tabStore.getTabList.findIndex((item) => item.name === currentName);
      // 当前 tab 数量
      const currentCount = tabStore.getTabList.length;
      push(opt)
        .then(() => {
          if (tabStore.getTabList.length > currentCount) {
            // 产生新 tab
            // 新 tab（也是最后一个）
            const targetIndex = tabStore.getTabList.length - 1;
            // 新 tab 在 当前 tab 的后面
            if (currentIndex > -1 && targetIndex > currentIndex) {
              // 移动 tab
              tabStore.sortTabs(targetIndex, currentIndex + 1);
            }
          }
        })
        .catch(handleError);
    } else {
      push(opt).catch(handleError);
    }
  }
  return go;
}

/**
 * @description: redo current page
 */
export const useRedo = (_router?: Router) => {
  const { replace, currentRoute } = _router || useRouter();
  const { query, params = {}, name, fullPath } = unref(currentRoute.value);
  function redo(): Promise<boolean> {
    return new Promise((resolve) => {
      if (name === REDIRECT_NAME) {
        resolve(false);
        return;
      }
      if (name && Object.keys(params).length > 0) {
        params['_origin_params'] = JSON.stringify(params ?? {});
        params['_redirect_type'] = 'name';
        params['path'] = String(name);
      } else {
        params['_redirect_type'] = 'path';
        params['path'] = fullPath;
      }
      replace({ name: REDIRECT_NAME, params, query }).then(() => resolve(true));
    });
  }
  return redo;
};
