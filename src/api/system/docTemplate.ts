import {
  DocTemplateResult,
  QueryDocTemplateForm,
  UpdateDocTemplateData,
} from './model/docTempModel';
import { YN } from '@/enums/YN';
import { defHttp } from '@/utils/http/axios';

enum Api {
  docTemplate = '/admin/kfDocTemplate',
  create = '/admin/kfDocTemplate/create',
  delete = '/admin/kfDocTemplate/delete',
  update = '/admin/kfDocTemplate/update',
  modifyEnable = '/admin/kfDocTemplate/modifyEnable',
  sort = '/admin/kfDocTemplate/sort',
}

export function getDocTemplates(data: QueryDocTemplateForm) {
  return defHttp.post<DocTemplateResult[]>({
    url: Api.docTemplate,
    data,
  });
}

export function getDocTemplateById(id: number) {
  return defHttp.post<DocTemplateResult>({
    url: Api.docTemplate + '/' + id,
  });
}

export function createDocTemplate(data: UpdateDocTemplateData) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updateDocTemplate(data = {}) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function deleteDocTemplate(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}

export function docTemplateModifyEnable(id: number, status: YN) {
  return defHttp.post({
    url: Api.modifyEnable,
    data: { id, status },
  });
}

export function sortDocTemplate(sortData: { id: number; sortNum: number }[]) {
  return defHttp.post<null>({
    url: Api.sort,
    data: { sortData },
  });
}
