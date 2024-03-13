import { BatchModifyStatusForm } from '@/ApiModel/base';
import {
  QueryPmCompanyForm,
  PmCompany,
  PmCompanyForm,
  PmCompanyUpdate,
} from '@/ApiModel/company/company';
import { YN } from '@/enums/YN';
import { defHttp } from '@/utils/http/axios';

enum Api {
  base = '/admin/pmCompany',
  info = '/admin/pmCompany/',
  create = '/admin/pmCompany/create',
  update = '/admin/pmCompany/update',
  delete = '/admin/pmCompany/delete',
  enabled = '/admin/pmCompany/enabled',
}

export function getCompany(data: QueryPmCompanyForm, isTable = false) {
  return defHttp.post<PmCompany[]>(
    {
      url: Api.base,
      data,
    },
    {
      isTable,
    },
  );
}

export function getCompanyById(id: number) {
  return defHttp.post<PmCompany>({
    url: Api.info + id,
  });
}

export function createCompany(data: PmCompanyForm) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updateCompany(data: PmCompanyUpdate) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function deleteCompany(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}
export function enabledCompany(data: BatchModifyStatusForm): Promise<void>;
export function enabledCompany(ids: number[], status: YN): Promise<void>;
export function enabledCompany(...arg) {
  let data = {};
  if (arg.length === 1) data = arg[0];
  if (arg.length === 2)
    data = {
      ids: arg[0],
      status: arg[1],
    };
  return defHttp.post<void>({
    url: Api.enabled,
    data,
  });
}
