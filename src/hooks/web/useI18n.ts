import { getI18n } from '/@/setup/i18n';
import projectSetting from '/@/settings/projectSetting';

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

  if (!projectSetting.locale.show || !getI18n()) {
    return normalFn;
  }

  const { t, ...methods } = getI18n().global;

  return {
    ...methods,
    t: (key: string, ...arg: Parameters<typeof t>) => {
      if (!key) return '';
      return t(getKey(key), ...arg);
    },
  };
}
