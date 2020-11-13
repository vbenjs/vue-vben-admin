import { defHttp } from '/@/utils/http/axios';
import { GetAccountInfoModel } from './model/accountModel';

enum Api {
  ACCOUNT_INFO = '/account/getAccountInfo',
  SECURE_LIST = '/account/getSecureList',
}

// 获取个人中心--基础设置内容
export function accountInfoApi(params: any) {
  return defHttp.request<GetAccountInfoModel>({
    url: Api.ACCOUNT_INFO,
    method: 'GET',
    params,
  });
}
