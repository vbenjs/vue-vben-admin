import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  list = 'sys/role/list',
  getById = 'sys/role/getById',
  listUser = 'sys/user/list',
  listUserByRoleId = 'sys/user/listUserByRoleId',
  setRoleUser = 'sys/role/setRoleUser',
  delete = 'sys/role/batchDeleteById',
  batchSaveUpdate = 'sys/role/batchSaveUpdate',
}

export const listApi = (parameter) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.list,
    data: parameter,
  });
};

export const deleteApi = (parameter: any[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.delete,
    data: parameter.map((item) => item.roleId),
  });
};

export const getByIdApi = (model) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.getById,
    data: model.roleId,
  });
};

export const listUserApi = (parameter?) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.listUser,
    data: parameter,
  });
};

export const listUserByRoleIdApi = (roleIds: number[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.listUserByRoleId,
    data: roleIds,
  });
};

export const setRoleUserApi = (roleId: number, userIdList: number[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.setRoleUser,
    data: {
      roleId,
      userIdList,
    },
  });
};

export const batchSaveUpdateApi = (dataList: any[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.batchSaveUpdate,
    data: dataList,
  });
};
