import { BatchModifyStatusForm } from '@/ApiModel/base';
import { QueryPmAreaForm, PmArea, PmAreaForm, PmAreaUpdate } from '@/ApiModel/company/area';
import { defHttp } from '@/utils/http/axios';

enum Api {
  base = '/admin/pmArea',
  info = '/admin/pmArea/',
  create = '/admin/pmArea/create',
  update = '/admin/pmArea/update',
  delete = '/admin/pmArea/delete',
  enabled = '/admin/pmArea/enabled',
}

export function getArea(data: QueryPmAreaForm, isTable = false) {
  return defHttp.post<PmArea[]>(
    {
      url: Api.base,
      data,
    },
    {
      isTable,
    },
  );
}

export function getAreaById(id: number) {
  return defHttp.post<PmArea>({
    url: Api.info + id,
  });
}

export function createArea(data: PmAreaForm) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updateArea(data: PmAreaUpdate) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function deleteArea(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}

export function enabledArea(data: BatchModifyStatusForm) {
  return defHttp.post({
    url: Api.enabled,
    data,
  });
}
