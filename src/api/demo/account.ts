import { defHttp } from '/@/utils/http/axios';
import { GetAccountInfoModel } from './model/accountModel';

enum Api {
  ACCOUNT_INFO = '/account/getAccountInfo',
}

// Get personal center-basic settings

export const accountInfoApi = () => defHttp.get<GetAccountInfoModel>({ url: Api.ACCOUNT_INFO });
