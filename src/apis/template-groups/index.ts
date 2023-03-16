import { defHttp } from '/@/utils/http/axios';

import type SearchParameters from '../SearchParameters';
import type PageResult from '../PageResult';
import type TemplateGroupEntity from './TemplateGroupEntity';

const domain = '/template-groups';

export function listTemplateGroups(params: SearchParameters) {
  return defHttp.get<PageResult<TemplateGroupEntity>>(
    { url: domain, params },
    { joinParamsToUrl: true },
  );
}

export function loadTemplateGroup(id: number) {
  return defHttp.get<TemplateGroupEntity>({ url: `${domain}/${id}` });
}

export function createTemplateGroup(data: TemplateGroupEntity) {
  return defHttp.post<TemplateGroupEntity>({ url: domain, data });
}

export function updateTemplateGroup(id: number, data: TemplateGroupEntity) {
  return defHttp.put<null>({ url: `${domain}/${id}`, data });
}

export function deleteTemplateGroup(id: number) {
  return defHttp.delete<null>({ url: `${domain}/${id}` });
}

export { TemplateGroupEntity };
