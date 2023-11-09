import { defHttp } from '/@/utils/http/axios';
import { DictionaryType } from './model/dictionaryModel';

const enum Api {
  getDictItemsByFldm = '/core/auth/zdflmx/getDictItemsByFldm',
  getMutiDictTree = '/core/auth/zdflmx/getMutiDictTree',
  getJgxxWhByFjm = '/core/auth/jgxx/getJgxxWhByFjm',
}
/**
 * 字典接口,返回数组
 * @param fldm
 * @returns
 */
export function getDictList(fldm: DictionaryType) {
  return defHttp.get(
    {
      url: Api.getDictItemsByFldm,
      params: { fldm },
      headers: {
        // @ts-ignore
        ignoreCancelToken: true,
      },
    },
    {
      isCache: true,
    },
  );
}

export function getDictTree(fldm: DictionaryType) {
  return defHttp.get(
    {
      url: Api.getMutiDictTree,
      params: { fldm },
      headers: {
        // @ts-ignore
        ignoreCancelToken: true,
      },
    },
    {
      isCache: true,
    },
  );
}

/**
 * @description: 根据年度号和fjm获取wh;
 * @property {string} fjm 分级码;
 * @property {string} ndh 年度号;
 */

export const getJgxxWhByFjm = (params) => defHttp.get({ url: Api.getJgxxWhByFjm, params });
