import { setDictHandler } from '@vben/stores';

import { getAllDictsApi, getDictApi, getDictVersionApi } from '#/api';

/**
 * 初始化字典处理，通过 API 获取字典数据
 */
export function initDict() {
  setDictHandler({
    getDict(code: string) {
      return getDictApi(code);
    },
    getAllDicts() {
      return getAllDictsApi();
    },
    getVersion() {
      return getDictVersionApi();
    },
  });
}
