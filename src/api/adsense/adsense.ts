import { defHttp } from '@/utils/http/axios';

enum Api {
  GOOGLE_GENERATE = '/google/adsense/accounts/reports/generate',
  GOOGLE_LIST = '/google/adsense/accounts/list',
  GOOGLE_FILTER = '/google/adsense/report/get-filter',
}

export const googleGenerateApi = (params: any) => {
  return defHttp.get({ url: Api.GOOGLE_GENERATE, params });
};

export const googleListApi = () => {
  return defHttp.get({ url: Api.GOOGLE_LIST });
};

export const googleFilterApi = (params: any) => {
  return defHttp.get({ url: Api.GOOGLE_FILTER, params });
};
