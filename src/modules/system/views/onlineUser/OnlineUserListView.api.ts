import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  listOnlineUser = 'auth/listOnlineUser',
  offline = 'auth/offline',
}

export const listOnlineUserApi = (params) =>
  defHttp.post({
    service: ApiServiceEnum.SMART_AUTH,
    url: Api.listOnlineUser,
    data: params,
  });

export const offlineApi = (username, token) => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_AUTH,
    url: Api.offline,
    data: { username, token },
  });
};
