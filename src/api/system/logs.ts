import { AxiosResponse } from 'axios';
import { defHttp } from '@/utils/http/axios';

enum Api {
  log = '/admin/kfLog',
  downloadLogs = '/admin/kfLog/download',
  delete = '/admin/kfLog/delete',
}

export interface SystemLog {
  createTime: number;
  fileName: string;
  fileSize: number;
}

export function getSystemLogs() {
  return defHttp.post<SystemLog[]>({
    url: Api.log,
  });
}

export function downloadSystemLogs(names: string[]) {
  return defHttp.post<AxiosResponse>(
    {
      url: Api.downloadLogs,
      data: { names },
      responseType: 'blob',
    },
    {
      isReturnNativeResponse: true,
    },
  );
}

export function deleteSystemLogs(names: string[] = []) {
  return defHttp.post<null>({
    url: Api.delete,
    data: { names },
  });
}
