import { defHttp } from '@/utils/http/axios';

export const getDictDataList = (params?: any) =>
  defHttp.get({ url: '/sys-dict-data', params }, { isTransformResponse: false });

export const saveDictData = (data: any, id?: string) => {
  if (id) {
    return defHttp.put({ url: `/sys-dict-data/${id}`, data }, { isTransformResponse: false });
  }
  return defHttp.post({ url: '/sys-dict-data', data }, { isTransformResponse: false });
};
