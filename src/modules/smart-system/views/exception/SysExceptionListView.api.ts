import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  list = 'sys/exception/list',
  getById = 'sys/exception/getById',
  markResolved = 'sys/exception/markResolved',
}

export const listApi = (params) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.list,
    data: params,
  });
};

export const getById = (id) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.getById,
    data: id,
  });
};

export const markResolvedApi = (data) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.markResolved,
    data,
  });
};
