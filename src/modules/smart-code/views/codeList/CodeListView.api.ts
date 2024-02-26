import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  listBySystem = 'db/code/main/listBySystem',
  delete = 'db/code/main/batchDeleteById',
}

export const listBySystemApi = (parameter) =>
  defHttp.post({ service: ApiServiceEnum.SMART_CODE, url: Api.listBySystem, data: parameter });

export const deleteApi = (data) =>
  defHttp.post({
    service: ApiServiceEnum.SMART_CODE,
    url: Api.delete,
    data: data.map((item: any) => item.id),
  });
