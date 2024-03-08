import { ApiServiceEnum, defHttp } from '@/utils/http/axios';

enum Api {
  getAuthProperties = 'public/auth/getAuthProperties',
}

/**
 * 获取认证参数
 */
export const getAuthPropertiesApi = () => {
  return defHttp.post({
    service: ApiServiceEnum.SMART_AUTH,
    url: Api.getAuthProperties,
  });
};
