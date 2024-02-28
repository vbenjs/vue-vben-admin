import { HxBaseProduct, QueryHxBaseProductForm } from '@/ApiModel/configuration/product';
import { YN } from '@/enums/YN';
import { defHttp } from '@/utils/http/axios';
import { Result } from '/#/axios';
import { isNull, isUndefined } from 'lodash-es';

enum Api {
  base = '/admin/hxBaseProduct',
  info = '/admin/hxBaseProduct/info',
  create = '/admin/hxBaseProduct/create',
  delete = '/admin/hxBaseProduct/delete',
  update = '/admin/hxBaseProduct/update',
  modifyStatus = '/admin/hxBaseProduct/enabled',
}

export function getBaseProduct(data?: QueryHxBaseProductForm): Promise<HxBaseProduct[]>;
export function getBaseProduct(data: QueryHxBaseProductForm, status: YN): Promise<HxBaseProduct[]>;
export function getBaseProduct(
  data: QueryHxBaseProductForm,
  status: YN | null,
  isTable?: true,
): Promise<Result<HxBaseProduct[]>>;
export function getBaseProduct(
  data?: QueryHxBaseProductForm,
  status?: YN | null,
  isTable?: boolean,
) {
  const enabled = isNull(status) ? undefined : isUndefined(status) ? 'Y' : status;

  return defHttp.post(
    {
      url: Api.base,
      data: { enabled, ...data },
    },
    { isTable },
  );
}

export const getBaseProductById = async (id: number) => {
  return defHttp.post<HxBaseProduct>({
    url: Api.info,
    data: { id },
  });
};

export function createBaseProduct(data = {}) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updateBaseProduct(data = {}) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function modifyBaseProductStatus(ids: number[], status: YN) {
  return defHttp.post({
    url: Api.modifyStatus,
    data: { ids, status },
  });
}

export function deleteBaseProduct(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}
