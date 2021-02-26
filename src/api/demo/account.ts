import { defHttp } from '/@/utils/http/axios';
import { GetAccountInfoModel } from './model/accountModel';

const { get } = defHttp;

enum Api {
  ACCOUNT_INFO = '/account/getAccountInfo',
}

// Get personal center-basic settings

export const accountInfoApi = () => get<GetAccountInfoModel>({ url: Api.ACCOUNT_INFO });
