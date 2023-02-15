import { defHttp } from '/@/utils/http/axios';

import type SearchParameters from '../SearchParameters';
import type PageResult from '../PageResult';
import type DictionaryItemEntity from './DictionaryItemEntity';

const domain = '/dictionary-items';

export function listDictionaryItems(params: SearchParameters) {
  return defHttp.get<PageResult<DictionaryItemEntity>>(
    { url: domain, params },
    { joinParamsToUrl: true },
  );
}

export function loadDictionaryItem(id: string) {
  return defHttp.get<DictionaryItemEntity>({ url: `${domain}/${id}` });
}

export function createDictionaryItem(data: DictionaryItemEntity) {
  return defHttp.post<DictionaryItemEntity>({ url: domain, data });
}

export function updateDictionaryItem(id: string, data: DictionaryItemEntity) {
  return defHttp.put<null>({ url: `${domain}/${id}`, data });
}

export function deleteDictionaryItem(id: string) {
  return defHttp.delete<null>({ url: `${domain}/${id}` });
}

export { DictionaryItemEntity };
