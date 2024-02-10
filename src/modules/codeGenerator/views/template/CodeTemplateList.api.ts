import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  list = 'db/code/template/list',
  saveUpdate = 'db/code/template/saveUpdate',
  delete = 'db/code/template/batchDeleteById',
  getById = 'db/code/template/getById',
}

export const listApi = (params) =>
  defHttp.post({
    service: ApiServiceEnum.SMART_CODE,
    url: Api.list,
    data: params,
  });

export const saveUpdateApi = (model) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_CODE,
    url: Api.saveUpdate,
    data: model,
  });
};

export const deleteApi = (ids: number[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_CODE,
    url: Api.delete,
    data: ids,
  });
};

export const getByIdApi = (id: number) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_CODE,
    url: Api.getById,
    data: id,
  });
};
