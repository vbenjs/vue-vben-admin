import { Account, GetAccountWithLoggedModel } from '@/ApiModel/system/accountModel';
import { YN } from '@/enums/YN';
import { defHttp } from '@/utils/http/axios';

enum Api {
  account = '/admin/sysAccount',
  info = '/admin/sysAccount/info',
  logged = '/admin/sysAccount/logged',
  createAccount = '/admin/sysAccount/create',
  deleteAccount = '/admin/sysAccount/delete',
  updateAccount = '/admin/sysAccount/update',
  modifyStatus = '/admin/sysAccount/modifyStatus',
  resetPassword = '/admin/sysAccount/resetPassword',
}

export const getAccount = async (data = {}, isTable = false) => {
  return defHttp.post<Account[]>(
    {
      url: Api.account,
      data,
    },
    {
      isTable,
    },
  );
};
export function getAccountWithLogged() {
  return defHttp.post<GetAccountWithLoggedModel>({ url: Api.logged });
}

export const getAccountById = async (id: number) => {
  return defHttp.post<Account>({
    url: Api.info,
    data: { id },
  });
};

export function createAccount(data = {}) {
  return defHttp.post({
    url: Api.createAccount,
    data,
  });
}

export function updateAccount(data = {}) {
  return defHttp.post({
    url: Api.updateAccount,
    data,
  });
}

export function modifyStatus(id: number, status: YN) {
  return defHttp.post({
    url: Api.modifyStatus,
    data: { id, status },
  });
}

export function deleteAccount(id: number) {
  return defHttp.post({
    url: Api.deleteAccount,
    data: { id },
  });
}

export function resetPassword(id: number, password: string) {
  return defHttp.post({
    url: Api.resetPassword,
    data: { id, password },
  });
}
