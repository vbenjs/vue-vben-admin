import { YN } from '../enums/YN';
import { QueryStoreForm, StoreResult } from './model/storeModel';
import { defHttp } from '@/utils/http/axios';

enum Api {
  store = '/admin/store',
  info = '/admin/store/',
  create = '/admin/store/create',
  update = '/admin/store/update',
  delete = '/admin/store/delete/',
  monitor = '/admin/store/monitor',
}

export function getStore(data: QueryStoreForm, isTable = false) {
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

export function getStoreById(id: number) {
  return defHttp.post<StoreResult>({
    url: Api.info + id,
  });
}

export function createStore(data = {}) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updateStore(data = {}) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function deleteStore(id: number) {
  return defHttp.post({
    url: Api.delete + id,
  });
}

export function modifyStoreMonitor(ids: number[], status: YN) {
  return defHttp.post({
    url: Api.monitor,
    data: { ids, status },
  });
}
