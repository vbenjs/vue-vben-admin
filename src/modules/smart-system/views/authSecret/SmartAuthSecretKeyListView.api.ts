import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  list = '/sys/auth/secret/listBySystem',
  getById = '/sys/auth/secret/getById',
  batchSaveUpdate = '/sys/auth/secret/batchSaveUpdate',
  delete = '/sys/auth/secret/batchDeleteById',
  saveUpdate = 'sys/auth/secret/saveUpdate',
  download = 'sys/auth/secret/download',
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

export const saveUpdateApi = (model) => {
  const { publicKeyFileList, privateKeyFileList } = model;
  const publicKeyFile = publicKeyFileList[0].originFileObj;
  const privateKeyFile = privateKeyFileList[0].originFileObj;
  const data = {
    ...model,
  };
  delete data.publicKeyFileList;
  delete data.privateKeyFileList;
  return defHttp.uploadFile(
    {
      service: ApiServiceEnum.SMART_SYSTEM,
      url: Api.saveUpdate,
    },
    {
      data,
      file: [
        { name: 'publicKeyFile', file: publicKeyFile },
        { name: 'privateKeyFile', file: privateKeyFile },
      ],
    },
  );
};

export const download = (id) => {
  return defHttp.download({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.download,
    data: {
      id,
    },
  });
};
