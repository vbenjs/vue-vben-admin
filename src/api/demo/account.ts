import { defHttp } from '/@/utils/http/axios';
import { GetAccountInfoModel } from './model/accountModel';

enum Api {
  ACCOUNT_INFO = '/account/getAccountInfo',
}

// 获取个人中心--基础设置内容
export function accountInfoApi() {
  return defHttp.request<GetAccountInfoModel>({
    url: Api.ACCOUNT_INFO,
    method: 'GET',
  });
}
