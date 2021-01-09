import { i18n } from '/@/locales/setupI18n';

export function useI18n(namespace?: string) {
  function getKey(key: string) {
    if (!namespace) {
      return key;
    }
    if (key.startsWith(namespace)) {
      return key;
    }
    return `${namespace}.${key}`;
  }
  const normalFn = {
    t: (key: string) => {
      return getKey(key);
    },
  };

  if (!i18n) {
    return normalFn;
  }

  const { t, ...methods } = i18n.global;

  const tFn = function (...arg: Parameters<typeof t>) {
    if (!arg[0]) return '';
    return t(getKey(arg[0]), ...(arg as Parameters<typeof t>));
  };
  return {
    ...methods,
    t: tFn,
  };
}

// Why write this function？
// Mainly to configure the vscode i18nn ally plugin. This function is only used for routing and menus. Please use useI18n for other places

// 为什么要编写此函数？
// 主要用于配合vscode i18nn ally插件。此功能仅用于路由和菜单。请在其他地方使用useI18n
export const t = (key: string) => key;
