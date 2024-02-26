import { ApiServiceEnum, defHttp } from '@/utils/http/axios';
import { isNull } from '@/utils/is';

enum Api {
  listFront = 'sys/i18n/listFront',
}

export const listFrontApi = async (locale: string) => {
  const i18nData: Recordable<string> = await defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.listFront,
    data: {
      value: locale,
    },
  });
  const result: Recordable = {};
  if (isNull(i18nData)) {
    return result;
  }
  Object.keys(i18nData).forEach((key) => {
    const value = i18nData[key];
    convertObject(result, key.split('.'), value);
  });
  return result;
};

const convertObject = (data: any, keyList: string[], value: string) => {
  if (keyList.length > 0) {
    if (keyList.length === 1) {
      data[keyList[0]] = value;
    } else {
      const firstKey = keyList[0];
      if (!data[firstKey]) {
        data[firstKey] = {};
      }
      convertObject(data[firstKey], keyList.slice(1), value);
    }
  }
};
