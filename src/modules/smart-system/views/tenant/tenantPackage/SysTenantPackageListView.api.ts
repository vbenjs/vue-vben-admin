import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  list = '/sys/tenant/package/list',
  getById = '/sys/tenant/package/getById',
  batchSaveUpdate = '/sys/tenant/package/saveUpdateBatch',
  delete = '/sys/tenant/package/batchDeleteById',
  setUseYn = '/sys/tenant/package/setUseYn',
  listFunction = 'sys/function/list',
  listFunctionId = '/sys/tenant/package/listFunctionId',
  savePackageFunction = '/sys/tenant/package/savePackageFunction',
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

/**
 * 启用停用接口
 * @param rows 选中的数据
 * @param useYn 启用停用
 */
export const setUseYnApi = (rows: any[], useYn: boolean) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.setUseYn,
    data: {
      idList: rows.map((item) => item.id),
      useYn,
    },
  });
};

export const listFunctionApi = (data: Recordable) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: 'sys/function/list',
    data,
  });
};

export const listFunctionIdApi = (packageId: number) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.listFunctionId,
    params: {
      id: packageId,
    },
  });
};

export const savePackageFunctionApi = (data: Recordable) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.savePackageFunction,
    data,
  });
};
