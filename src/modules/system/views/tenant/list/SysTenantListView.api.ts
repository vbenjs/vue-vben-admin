import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  list = '/sys/tenant/list',
  getById = '/sys/tenant/getById',
  batchSaveUpdate = '/sys/tenant/saveUpdateBatch',
  delete = '/sys/tenant/batchDeleteById',
}

export const listApi = (params) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.list,
    data: {
      sortName: 'seq',
      ...params,
    },
  });
};

export const batchSaveUpdateApi = (modelList: any[]) => {
  modelList.forEach((item) => {
    const { validatedTime } = item;
    if (validatedTime && validatedTime.length > 0) {
      item.startTime = validatedTime[0];
      item.endTime = validatedTime[1];
    }
  });
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

export const getByIdApi = async (id: number) => {
  const result = await defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.getById,
    data: id,
  });
  if (!result) {
    return result;
  }
  const { startTime, endTime } = result;
  result.validatedTime = [startTime, endTime];
  return result;
};
