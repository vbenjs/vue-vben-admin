import { defHttp } from '/@/utils/http/axios';

import type SearchParameters from '../SearchParameters';
import type PageResult from '../PageResult';
import type TemplateEntity from './TemplateEntity';

const domain = '/templates';

export function listTemplates(params: SearchParameters) {
  return defHttp.get<PageResult<TemplateEntity>>(
    { url: domain, params },
    { joinParamsToUrl: true },
  );
}

export function loadTemplate(id: number) {
  return defHttp.get<TemplateEntity>({ url: `${domain}/${id}` });
}

export function createTemplate(data: TemplateEntity) {
  return defHttp.post<TemplateEntity>({ url: domain, data });
}

export function updateTemplate(id: number, data: TemplateEntity) {
  return defHttp.put<null>({ url: `${domain}/${id}`, data });
}

export function deleteTemplate(id: number) {
  return defHttp.delete<null>({ url: `${domain}/${id}` });
}

export { TemplateEntity };
