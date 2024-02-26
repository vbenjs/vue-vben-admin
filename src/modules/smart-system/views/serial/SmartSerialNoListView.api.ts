import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  list = '/smart/tool/serial/list',
  getById = '/smart/tool/serial/getById',
  batchSaveUpdate = '/smart/tool/serial/saveUpdateBatch',
  delete = '/smart/tool/serial/batchDeleteById',
}

export const listApi = (params) => {
  const parameter = {
    ...params,
  };
  if (!parameter.sortName) {
    parameter.sortName = 'seq';
  }
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.list,
    data: parameter,
  });
};

export const batchSaveUpdateApi = (modelList: any[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.batchSaveUpdate,
    data: modelList,
  });
};

export const deleteApi = (removeRecords: Recordable[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.delete,
    data: removeRecords.map((item) => item.id),
  });
};

export const getByIdApi = (id: number) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.getById,
    data: id,
  });
};
