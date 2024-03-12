import { BatchModifyStatusForm } from '@/ApiModel/base';
import {
  QueryPmSupplierServiceForm,
  PmSupplierService,
  PmSupplierServiceForm,
  PmSupplierServiceUpdate,
} from '@/ApiModel/company/supplierService';
import { defHttp } from '@/utils/http/axios';

enum Api {
  base = '/admin/pmSupplierService',
  info = '/admin/pmSupplierService/',
  create = '/admin/pmSupplierService/create',
  update = '/admin/pmSupplierService/update',
  delete = '/admin/pmSupplierService/delete',
  enabled = '/admin/pmSupplierService/enabled',
}

export function getSupplierService(data: QueryPmSupplierServiceForm, isTable = false) {
  return defHttp.post<PmSupplierService[]>(
    {
      url: Api.base,
      data,
    },
    {
      isTable,
    },
  );
}

export function getSupplierServiceById(id: number) {
  return defHttp.post<PmSupplierService>({
    url: Api.info + id,
  });
}

export function createSupplierService(data: PmSupplierServiceForm) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updateSupplierService(data: PmSupplierServiceUpdate) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function deleteSupplierService(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}

export function enabledSupplierService(data: BatchModifyStatusForm) {
  return defHttp.post({
    url: Api.enabled,
    data,
  });
}
