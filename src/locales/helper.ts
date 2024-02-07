import type { LocaleType } from '#/config';

import { set } from 'lodash-es';
import { deepMerge } from '@/utils';

export const loadLocalePool: LocaleType[] = [];

export function setHtmlPageLang(locale: LocaleType) {
  document.querySelector('html')?.setAttribute('lang', locale);
}

export function setLoadLocalePool(cb: (loadLocalePool: LocaleType[]) => void) {
  cb(loadLocalePool);
}

export function genMessage(langs: Record<string, Record<string, any>>, prefix = 'lang') {
  const obj: Recordable = {};

  Object.keys(langs).forEach((key) => {
    const langFileModule = langs[key].default;
    let fileName = key.replace(`./${prefix}/`, '').replace(/^\.\//, '');
    const lastIndex = fileName.lastIndexOf('.');
    fileName = fileName.substring(0, lastIndex);
    const keyList = fileName.split('/');
    const moduleName = keyList.shift();
    const objKey = keyList.join('.');

    if (moduleName) {
      if (objKey) {
        set(obj, moduleName, obj[moduleName] || {});
        set(obj[moduleName], objKey, langFileModule);
      } else {
        set(obj, moduleName, langFileModule || {});
      }
    }
  });
  return obj;
}

export const generateModuleMessage = (langs: Record<string, Record<string, any>>) => {
  let result: Recordable = {};
  Object.keys(langs).forEach((key) => {
    const langModule = langs[key].default;
    if (langModule.trans) {
      result = deepMerge(result, transferI18n(langModule));
    } else {
      result = deepMerge(result, langModule);
    }
  });

  return result;
};

export type I18nTransfer = {
  trans: boolean;
  key: string;
  data: { [index: string]: any };
};

/**
 * 转换国际化信息
 */
export const transferI18n = (data: I18nTransfer | any) => {
  if (!data.trans) {
    return data;
  }
  const keySplit = data.key.split('.');
  let object = {};
  for (let i = keySplit.length - 1; i >= 0; i--) {
    const key = keySplit[i];
    const itemData: any = {};
    if (i === keySplit.length - 1) {
      itemData[key] = data.data;
    } else {
      itemData[key] = object;
    }
    object = itemData;
  }
  return object;
};
