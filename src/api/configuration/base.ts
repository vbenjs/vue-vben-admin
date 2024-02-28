import { HxBaseData, QueryHxBaseDataForm } from '@/ApiModel/configuration/base';
import { YN } from '@/enums/YN';
import { defHttp } from '@/utils/http/axios';
import { Result } from '/#/axios';
import { isNull, isUndefined } from 'lodash-es';

enum Api {
  base = '/admin/hxBaseData',
  info = '/admin/hxBaseData/info',
  create = '/admin/hxBaseData/create',
  delete = '/admin/hxBaseData/delete',
  update = '/admin/hxBaseData/update',
  modifyStatus = '/admin/hxBaseData/enabled',
}

export function getBaseData(data?: QueryHxBaseDataForm): Promise<HxBaseData[]>;
export function getBaseData(data: QueryHxBaseDataForm, status: YN): Promise<HxBaseData[]>;
export function getBaseData(
  data: QueryHxBaseDataForm,
  status: YN | null,
  isTable?: true,
): Promise<Result<HxBaseData[]>>;
export function getBaseData(data?: QueryHxBaseDataForm, status?: YN | null, isTable?: boolean) {
  const enabled = isNull(status) ? undefined : isUndefined(status) ? 'Y' : status;
  return defHttp.post(
    {
      url: Api.base,
      data: { enabled, ...data },
    },
    { isTable },
  );
}

export const getBaseDataById = async (id: number) => {
  return defHttp.post<HxBaseData>({
    url: Api.info,
    data: { id },
  });
};

export function createBaseData(data = {}) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updateBaseData(data = {}) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function modifyBaseDataStatus(ids: number[], status: YN) {
  return defHttp.post({
    url: Api.modifyStatus,
    data: { ids, status },
  });
}

export function deleteBaseData(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}
