import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum api {
  saveUpdate = 'db/connection/saveUpdate',
  getById = 'db/connection/getById',
  listBySystem = 'db/connection/listBySystem',
  batchDeleteById = 'db/connection/batchDeleteById',
  testConnected = 'db/connection/testConnection',
  listTemplate = 'db/code/template/list',
  createDict = '/public/db/createDic',
}

export const saveUpdateApi = (data: any) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_CODE,
    url: api.saveUpdate,
    data,
  });
};

export const getByIdApi = (id: number) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_CODE,
    url: api.getById,
    data: id,
  });
};

export const listApi = (data?: any) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_CODE,
    url: api.listBySystem,
    data,
  });
};

export const deleteApi = async (rows: any[]) => {
  if (rows.length === 0) {
    return;
  }
  await defHttp.post({
    service: ApiServiceEnum.SMART_CODE,
    url: api.batchDeleteById,
    data: rows.map((item: any) => item.id),
  });
};

export const testConnectedApi = (id: number) =>
  defHttp.post({
    service: ApiServiceEnum.SMART_CODE,
    url: api.testConnected,
    data: id,
  });

export const listTemplate = (templateType?: string) =>
  defHttp.post({
    service: ApiServiceEnum.SMART_CODE,
    url: api.listTemplate,
    data: {
      parameter: {
        'templateType@=': templateType,
      },
    },
  });

export const getCreateDicUrl = ({ row, templateId, tempToken }) => {
  return `${defHttp.getApiUrlByService(
    ApiServiceEnum.SMART_CODE,
  )}/public/db/createDic?connectionId=${row.id}&templateId=${templateId}&access-token=${tempToken}`;
};
