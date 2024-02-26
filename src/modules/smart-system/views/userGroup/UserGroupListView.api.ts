import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  list = 'sys/userGroup/list',
  batchSaveUpdate = 'sys/userGroup/batchSaveUpdate',
  delete = 'sys/userGroup/batchDeleteById',
  getById = 'sys/userGroup/getById',
  listUserIdByGroupId = 'sys/userGroup/listUserIdById',
  setUser = 'sys/userGroup/saveUserGroupByGroupId',
}

export const listApi = (parameter) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.list,
    data: parameter,
  });
};

export const batchSaveUpdateApi = (dataList: any[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.batchSaveUpdate,
    data: dataList,
  });
};

export const deleteApi = (dataList: any[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.delete,
    data: dataList.map((item) => item.groupId),
  });
};

export const getByIdApi = (data) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.getById,
    data: data.groupId,
  });
};

export const listUserIdByGroupIdApi = (groupId: number) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.listUserIdByGroupId,
    data: groupId,
  });
};

export const setUserApi = (groupId: number, userIdList: number[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.setUser,
    data: {
      groupId,
      userIdList,
    },
  });
};
