import { YN } from '../enums/YN';
import { QueryBusinessTimeForm, BusinessTimeResult } from './model/bussinessTimeModel';
import { Result } from '/#/axios';
import { defHttp } from '@/utils/http/axios';

enum Api {
  pmBusinessTime = '/admin/pmBusinessTime',
  info = '/admin/pmBusinessTime/',
  create = '/admin/pmBusinessTime/create',
  update = '/admin/pmBusinessTime/update',
  delete = '/admin/pmBusinessTime/delete',

  enabled = '/admin/pmBusinessTime/enabled',
}

export function getBusinessTime(data?: QueryBusinessTimeForm): Promise<BusinessTimeResult[]>;
export function getBusinessTime(
  data: QueryBusinessTimeForm,
  status: YN,
): Promise<BusinessTimeResult[]>;
export function getBusinessTime(
  data: QueryBusinessTimeForm,
  status: YN,
  isTable: true,
): Promise<Result<BusinessTimeResult[]>>;
export function getBusinessTime(data?: QueryBusinessTimeForm, status = YN.Y, isTable?: boolean) {
  return defHttp.post(
    {
      url: Api.pmBusinessTime,
      data: {
        status: status === YN.Y ? YN.Y : undefined,
        field: 'sortNum',
        order: 'desc',
        ...data,
      },
    },
    { isTable },
  );
}

export function getBusinessTimeById(id: number) {
  return defHttp.post<BusinessTimeResult>({
    url: Api.info + id,
  });
}

export function createBusinessTime(data = {}) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updateBusinessTime(data = {}) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function deleteBusinessTime(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}

export function enabledBusinessTime(ids: number[], status: YN) {
  return defHttp.post({
    url: Api.enabled,
    data: { ids, status },
  });
}
