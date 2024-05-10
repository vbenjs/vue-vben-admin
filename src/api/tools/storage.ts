import { BasicPageParams, BasicPaginationResult } from '../model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import qs from 'qs';

enum Api {
  Base = '/tools/storage',
}

export interface Storage {
  id: number;
  name: string;
  fileName: string;
  extName: string;
  path: string;
  type: string;
  size: string;
  username: string;
}

export type StorageListResult = BasicPaginationResult<Storage>;

export const getStorageList = (params?: BasicPageParams) =>
  defHttp.get<StorageListResult>({
    url: Api.Base,
    params,
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  });

export const deleteStorage = (params: { ids: number[] }) =>
  defHttp.post({ url: `${Api.Base}/delete`, params }, { successMessageMode: 'message' });
