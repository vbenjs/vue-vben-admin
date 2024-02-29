import { QueryStoreForm, StoreResult } from './model/storeModel';
import { defHttp } from '@/utils/http/axios';

enum Api {
  storePowerMonth = '/admin/pmStorePowerMonth',
  info = '/admin/pmStorePowerMonth/info',
  saveOrUpdate = '/admin/pmStorePowerMonth/saveOrUpdate',
  delete = '/admin/pmStorePowerMonth/del',
}

export function getStorePowerMonth(data: QueryStoreForm, isTable = false) {
  return defHttp.post<StoreResult[]>(
    {
      url: Api.storePowerMonth,
      data,
    },
    {
      isTable,
    },
  );
}

export function getStorePowerMonthById(id: number) {
  return defHttp.post<StoreResult>({
    url: Api.info,
    data: { id },
  });
}

export function updateStorePowerMonth(data = {}) {
  return defHttp.post({
    url: Api.saveOrUpdate,
    data,
  });
}

export function deleteStorePowerMonth(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}
