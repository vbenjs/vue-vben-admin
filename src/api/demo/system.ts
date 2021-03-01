import {
  AccountParams,
  DeptListItem,
  DeptListGetResultModel,
  AccountListGetResultModel,
} from './model/systemModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  // The address does not exist
  AccountList = '/system/getAccountList',
  DeptList = '/system/getDeptList',
}

export const getAccountList = (params: AccountParams) =>
  defHttp.get<AccountListGetResultModel>({ url: Api.AccountList, params });

export const getDeptList = (params?: DeptListItem) =>
  defHttp.get<DeptListGetResultModel>({ url: Api.DeptList, params });
