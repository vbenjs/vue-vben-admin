import { defHttp } from '/@/utils/http/axios';

import type SearchParameters from '../SearchParameters';
import type PageResult from '../PageResult';
import type DatabaseEntity from './DatabaseEntity';

const domain = '/databases';

export function listDatabases(params: SearchParameters) {
  return defHttp.get<PageResult<DatabaseEntity>>(
    { url: domain, params },
    { joinParamsToUrl: true },
  );
}

export function loadDatabase(id: number) {
  return defHttp.get<DatabaseEntity>({ url: `${domain}/${id}` });
}

export function createDatabase(data: DatabaseEntity) {
  return defHttp.post<DatabaseEntity>({ url: domain, data });
}

export function updateDatabase(id: number, data: DatabaseEntity) {
  return defHttp.put<null>({ url: `${domain}/${id}`, data });
}

export function deleteDatabase(id: number) {
  return defHttp.delete<null>({ url: `${domain}/${id}` });
}

export { DatabaseEntity };
