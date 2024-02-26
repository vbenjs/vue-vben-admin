import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  list = '/smart/message/systemMessage/list',
  getById = '/smart/message/systemMessage/getById',
  batchSaveUpdate = '/smart/message/systemMessage/saveUpdateBatch',
  delete = '/smart/message/systemMessage/batchDeleteById',
  getDetailById = '/smart/message/systemMessage/getDetailById',
  publish = '/smart/message/systemMessage/publish',
  revoke = '/smart/message/systemMessage/revoke',
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

export const getDetailByIdApi = (id: number) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_MESSAGE,
    url: Api.getDetailById,
    data: id,
  });
};

/**
 * 发布API
 * @param ids
 */
export const publishApi = (ids: number[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_MESSAGE,
    url: Api.publish,
    data: ids,
  });
};

/**
 * 发布API
 * @param ids
 */
export const revokeApi = (ids: number[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_MESSAGE,
    url: Api.revoke,
    data: ids,
  });
};
