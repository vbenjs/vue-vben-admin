import { HxBaseEfficiency, QueryHxBaseEfficiencyForm } from '@/ApiModel/configuration/efficiency';
import { YN } from '@/enums/YN';
import { defHttp } from '@/utils/http/axios';
import { Result } from '/#/axios';
import { isNull, isUndefined } from 'lodash-es';

enum Api {
  base = '/admin/hxBaseEfficiency',
  info = '/admin/hxBaseEfficiency/info',
  create = '/admin/hxBaseEfficiency/create',
  delete = '/admin/hxBaseEfficiency/delete',
  update = '/admin/hxBaseEfficiency/update',
  modifyStatus = '/admin/hxBaseEfficiency/enabled',
}

export function getBaseEfficiency(data?: QueryHxBaseEfficiencyForm): Promise<HxBaseEfficiency[]>;
export function getBaseEfficiency(
  data: QueryHxBaseEfficiencyForm,
  status: YN,
): Promise<HxBaseEfficiency[]>;
export function getBaseEfficiency(
  data: QueryHxBaseEfficiencyForm,
  status: YN | null,
  isTable?: true,
): Promise<Result<HxBaseEfficiency[]>>;
export function getBaseEfficiency(
  data?: QueryHxBaseEfficiencyForm,
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

export const getBaseEfficiencyById = async (id: number) => {
  return defHttp.post<HxBaseEfficiency>({
    url: Api.info,
    data: { id },
  });
};

export function createBaseEfficiency(data = {}) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updateBaseEfficiency(data = {}) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function modifyBaseEfficiencyStatus(ids: number[], status: YN) {
  return defHttp.post({
    url: Api.modifyStatus,
    data: { ids, status },
  });
}

export function deleteBaseEfficiency(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}
