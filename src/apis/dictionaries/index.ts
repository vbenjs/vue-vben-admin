import { defHttp } from '/@/utils/http/axios';

import type SearchParameters from '../SearchParameters';
import type PageResult from '../PageResult';
import type DictionaryEntity from './DictionaryEntity';

const domain = '/dictionaries';

export function listDictionaries(params: SearchParameters) {
  return defHttp.get<PageResult<DictionaryEntity>>(
    { url: domain, params },
    { joinParamsToUrl: true },
  );
}

export function loadDictionary(id: string) {
  return defHttp.get<DictionaryEntity>({ url: `${domain}/${id}` });
}

export function createDictionary(data: DictionaryEntity) {
  return defHttp.post<DictionaryEntity>({ url: domain, data });
}

export function updateDictionary(id: string, data: DictionaryEntity) {
  return defHttp.put<null>({ url: `${domain}/${id}`, data });
}

export function deleteDictionary(id: string) {
  return defHttp.delete<null>({ url: `${domain}/${id}` });
}

export { DictionaryEntity };
