import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  list = 'sys/log/listWithTenant',
  getById = 'sys/log/getById',
}

export const listApi = (parameter) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.list,
    data: {
      sortName: 'createTime',
      sortOrder: 'desc',
      ...parameter,
    },
  });
};

export const getByIdApi = (id: number) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_SYSTEM,
    url: Api.getById,
    data: id,
  });
};
