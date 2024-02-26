import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  listI18n = 'sys/i18n/list',
  getI18nById = 'sys/i18n/getById',
  i18nSaveUpdate = 'sys/i18n/saveUpdate',
  i18nDelete = 'sys/i18n/batchDeleteById',
  getGroupById = 'sys/i18n/getGroupById',
  listGroupTree = 'sys/i18n/listGroupTree',
  saveUpdateGroup = 'sys/i18n/saveOrUpdateGroup',
  deleteGroup = 'sys/i18n/deleteGroup',
  getI18nItemById = 'sys/i18nItem/getById',
  saveUpdateI18nItem = 'sys/i18nItem/saveUpdate',
  batchDeleteI18nItemById = 'sys/i18nItem/batchDeleteById',
  listI18nItem = 'sys/i18nItem/list',
}

export const listI18nApi = (params: Recordable) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.listI18n,
    data: params,
  });
};

export const getI18nByIdApi = (id: number) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.getI18nById,
    data: id,
  });
};

export const i18nSaveUpdateApi = (model: any) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.i18nSaveUpdate,
    data: model,
  });
};

export const i18nDeleteApi = (deleteData: any[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.i18nDelete,
    data: deleteData.map((item) => item.i18nId),
  });
};

export const getGroupByIdApi = (groupId: number) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.getGroupById,
    data: groupId,
  });
};

export const listGroupTreeApi = () => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.listGroupTree,
  });
};

export const saveUpdateGroupApi = (model: Recordable) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.saveUpdateGroup,
    data: model,
  });
};

export const deleteGroupApi = (ids: number[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.deleteGroup,
    data: ids,
  });
};

export const getI18nItemByIdApi = (id: number) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.getI18nItemById,
    data: id,
  });
};

export const saveUpdateI18nItemApi = (data: Recordable) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.saveUpdateI18nItem,
    data,
  });
};

export const batchDeleteI18nItemByIdApi = (idList) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.batchDeleteI18nItemById,
    data: idList,
  });
};

export const listI18nItemApi = (data) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.listI18nItem,
    data: data,
  });
};
