import { QueryStoreForm, StoreResult } from './model/storeModel';
import { defHttp } from '@/utils/http/axios';

enum Api {
  store = '/admin/pmUserStore',
  info = '/admin/pmUserStore/info',
  create = '/admin/pmUserStore/create',
  batchCreate = '/admin/pmUserStore/batchCreate',
  delete = '/admin/pmUserStore/delete',
  logged = '/admin/pmUserStore/logged',
}

export function getUserStore(data?: QueryStoreForm, isTable = false) {
  return defHttp.post<StoreResult[]>(
    {
      url: Api.store,
      data,
    },
    {
      isTable,
    },
  );
}

export function getUserStoreById(id: number) {
  return defHttp.post<StoreResult>({
    url: Api.info,
    data: { id },
  });
}

export function createUserStore(data = {}) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function deleteUserStore(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}

export function batchCreateUserStore(data = {}) {
  return defHttp.post({
    url: Api.batchCreate,
    data,
  });
}

export function getUserStoreByUser() {
  return defHttp.post<StoreResult[]>({
    url: Api.logged,
  });
}
