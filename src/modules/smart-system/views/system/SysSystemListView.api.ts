import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  list = 'sys/system/list',
  saveUpdate = 'sys/system/saveUpdate',
  delete = 'sys/system/batchDeleteById',
  getById = 'sys/system/getById',
  setUser = 'sys/system/setUser',
  getRelatedUserId = 'sys/system/getRelatedUserId',
}

export const listApi = (params) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.list,
    data: {
      ...params,
    },
  });
};

export const saveUpdateApi = (insertRecords, updateRecords) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.saveUpdate,
    data: [...insertRecords, ...updateRecords][0],
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

export const setUserApi = (data: { systemId: number; userIdList: number[] }) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.setUser,
    data,
  });
};

export const getRelatedUserIdApi = (systemId: number) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.getRelatedUserId,
    data: {
      id: systemId,
    },
  });
};
