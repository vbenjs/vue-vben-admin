import { defHttp } from '@/utils/http/axios';

enum Api {
  GOOGLE_GENERATE = '/google/adsense/accounts/reports/generate',
  GOOGLE_LIST = '/google/adsense/accounts/list',
}

export const googleGenerateApi = (params: any) => {
  console.log(params, 'params');
  defHttp.get({ url: Api.GOOGLE_GENERATE, params });
};

export const googleListApi = () => defHttp.get({ url: Api.GOOGLE_LIST });
