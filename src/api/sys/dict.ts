import { defHttp } from '@/utils/http/axios';

export const getDictList = (params?: any) =>
  defHttp.get({ url: '/sys-dict', params }, { isTransformResponse: false });

export const saveDict = (data: any, id?: string) => {
  if (id) {
    return defHttp.put({ url: `/sys-dict/${id}`, data }, { isTransformResponse: false });
  }
  return defHttp.post({ url: '/sys-dict', data }, { isTransformResponse: false });
};
