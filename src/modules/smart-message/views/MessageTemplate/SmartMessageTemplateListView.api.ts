import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  list = '/smart/message/template/list',
  getById = '/smart/message/template/getById',
  batchSaveUpdate = '/smart/message/template/saveUpdateBatch',
  delete = '/smart/message/template/batchDeleteById',
}

export const listApi = (params) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_MESSAGE,
    url: Api.list,
    data: {
      ...params,
    },
  });
};

export const batchSaveUpdateApi = (modelList: any[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_MESSAGE,
    url: Api.batchSaveUpdate,
    data: modelList,
  });
};

export const deleteApi = (removeRecords: Recordable[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_MESSAGE,
    url: Api.delete,
    data: removeRecords.map((item) => item.id),
  });
};

export const getByIdApi = (id: number) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_MESSAGE,
    url: Api.getById,
    data: id,
  });
};
