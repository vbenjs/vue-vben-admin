import { AxiosResponse } from 'axios';
import { defHttp } from '@/utils/http/axios';

enum Api {
  db = '/admin/kfDb/backups',
  createDb = '/admin/kfDb/createBackup',
  downloadDb = '/admin/kfDb/downloadBackup',
  delete = '/admin/kfDb/deleteBackup',
}

export interface DbBackup {
  createTime: number;
  fileName: string;
  fileSize: number;
}

export function getDbBackups() {
  return defHttp.post<DbBackup[]>({
    url: Api.db,
  });
}

export function createDbBackup() {
  return defHttp.get<null>({
    url: Api.createDb,
  });
}

export function downloadDbBackup(names: string[]) {
  return defHttp.post<AxiosResponse>(
    {
      url: Api.downloadDb,
      data: { names },
      responseType: 'blob',
    },
    {
      isReturnNativeResponse: true,
    },
  );
}

export function deleteDbBackup(names: string[] = []) {
  return defHttp.post<null>({
    url: Api.delete,
    data: { names },
  });
}
