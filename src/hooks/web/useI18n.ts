import { getI18n } from '/@/setup/i18n';

export function useI18n(namespace?: string) {
  const { t, ...methods } = getI18n().global;

  function getKey(key: string) {
    if (!namespace) {
      return key;
    }
    if (key.startsWith(namespace)) {
      return key;
    }
    return `${namespace}.${key}`;
  }
  return {
    ...methods,
    t: (key: string, ...arg: Parameters<typeof t>) => {
      return t(getKey(key), ...arg);
    },
  };
}
