import { defHttp } from '@/utils/http/axios';
import { HxBillItem, QueryHxBillItemForm } from '@/ApiModel/warehouse/bilItem';

enum Api {
  base = '/admin/hxBillItem',
  info = '/admin/hxBillItem/info',
  create = '/admin/hxBillItem/create',
  delete = '/admin/hxBillItem/delete',
  update = '/admin/hxBillItem/update',
}

export function getBillItem(data: QueryHxBillItemForm = {}) {
  const { isTable = true, ...rest } = data;
  return defHttp.post<HxBillItem[]>(
    {
      url: Api.base,
      data: rest,
    },
    { isTable },
  );
}

export const getBillItemById = async (id: number) => {
  return defHttp.post<HxBillItem>({
    url: Api.info,
    data: { id },
  });
};

export function createBillItem(data = {}) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updateBillItem(data = {}) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function deleteBillItem(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}
