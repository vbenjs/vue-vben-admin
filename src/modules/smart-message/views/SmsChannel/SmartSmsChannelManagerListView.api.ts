import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  list = '/smart/sms/channel/list',
  getById = '/smart/sms/channel/getById',
  batchSaveUpdate = '/smart/sms/channel/saveUpdateBatch',
  delete = '/smart/sms/channel/batchDeleteById',
  setDefault = '/smart/sms/channel/setDefault',
  sendTest = '/smart/sms/channel/sendTest',
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

export const setDefaultApi = (id: number) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_MESSAGE,
    url: Api.setDefault,
    data: {
      id,
    },
  });
};

export const sendTestApi = (data: Record<string, any>) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_MESSAGE,
    url: Api.sendTest,
    data,
  });
};
