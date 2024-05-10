import { BasicPaginationResult } from '../model/baseModel';
import { defHttp } from '/@/utils/http/axios';
import qs from 'qs';

export interface DictListItem {
  createTime: string;
  updateTime: string;
  id: number;
  name?: string;
  key?: string;
  value?: string;
  remark?: string;
}

export type DictListResult = BasicPaginationResult<DictListItem>;

export interface CreateDictParams {
  name?: string;
  key?: string;
  value?: string;
  remark?: string;
}

export type UpdateDictParams = Partial<CreateDictParams>;

enum Api {
  Base = '/system/dicts',
}

export const getDictList = (params) =>
  defHttp.get<DictListResult>({
    url: Api.Base,
    params,
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  });

export const getDictInfo = (id: number) => defHttp.get({ url: `${Api.Base}/${id}` });

export const createDict = (params: CreateDictParams) => defHttp.post({ url: Api.Base, params });

export const updateDict = (id: number, params: UpdateDictParams) =>
  defHttp.put({ url: `${Api.Base}/${id}`, params });

export const deleteDict = (id: number) => defHttp.delete({ url: `${Api.Base}/${id}` });
