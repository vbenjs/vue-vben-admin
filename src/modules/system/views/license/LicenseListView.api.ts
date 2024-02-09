import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  list = 'smart/license/listBySystem',
  getById = 'smart/license/getById',
  saveUpdateBatch = 'smart/license/saveUpdateBatch',
  delete = 'smart/license/batchDeleteById',
  generator = 'smart/license/generator',
  download = 'smart/license/download',
}

export const listApi = (params) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.list,
    data: params,
  });
};

export const getByIdApi = (data) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.getById,
    data: data.id,
  });
};

export const saveUpdateBatchApi = (dataList: any[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.saveUpdateBatch,
    data: dataList,
  });
};

export const deleteApi = (deleteDataList: any[]) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.delete,
    data: deleteDataList.map((item) => item.id),
  });
};

export const generatorApi = (id: number) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.generator,
    data: id,
  });
};

export const downloadApi = (id) => {
  return defHttp.download({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.download,
    data: { id },
  });
};
