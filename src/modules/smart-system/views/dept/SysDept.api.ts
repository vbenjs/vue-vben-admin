import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  getById = 'sys/dept/getById',
  saveUpdateBatch = 'sys/dept/saveUpdateBatch',
  delete = 'sys/dept/batchDeleteById',
}

export const getByIdApi = (params) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.getById,
    data: params,
  });
};

export const saveUpdateBatchApi = (modelList: any[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.saveUpdateBatch,
    data: modelList,
  });
};

export const deleteApi = (ids: number[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.delete,
    data: ids,
  });
};
