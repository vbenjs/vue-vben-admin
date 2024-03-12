import { BatchModifyStatusForm } from '@/ApiModel/base';
import {
  QueryPmCompanySupplierForm,
  PmCompanySupplier,
  PmCompanySupplierForm,
  PmCompanySupplierUpdate,
} from '@/ApiModel/company/supplier';
import { defHttp } from '@/utils/http/axios';

enum Api {
  base = '/admin/pmCompanySupplier',
  info = '/admin/pmCompanySupplier/',
  create = '/admin/pmCompanySupplier/create',
  update = '/admin/pmCompanySupplier/update',
  delete = '/admin/pmCompanySupplier/delete',
  enabled = '/admin/pmCompanySupplier/enabled',
}

export function getCompanySupplier(data: QueryPmCompanySupplierForm, isTable = false) {
  return defHttp.post<PmCompanySupplier[]>(
    {
      url: Api.base,
      data,
    },
    {
      isTable,
    },
  );
}

export function getCompanySupplierById(id: number) {
  return defHttp.post<PmCompanySupplier>({
    url: Api.info + id,
  });
}

export function createCompanySupplier(data: PmCompanySupplierForm) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updateCompanySupplier(data: PmCompanySupplierUpdate) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function deleteCompanySupplier(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}

export function enabledCompanySupplier(data: BatchModifyStatusForm) {
  return defHttp.post({
    url: Api.enabled,
    data,
  });
}
