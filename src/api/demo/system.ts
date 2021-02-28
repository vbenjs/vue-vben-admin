import { Params, DemoListGetResultModel } from './model/systemModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  // The address does not exist
  AccountList = '/system/getAccountList',
}

export const getAccountList = (params: Params) =>
  defHttp.get<DemoListGetResultModel>({ url: Api.AccountList, params });
