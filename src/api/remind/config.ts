import { QueryRemindConfigForm, RemindConfigResult } from './model/config';
import { Result } from '/#/axios';
import { YN } from '@/enums/YN';
import { EquipmentType } from '@/enums/equipmentType';
import { defHttp } from '@/utils/http/axios';

enum Api {
  remindConfig = '/admin/pmRemindConfig',
  info = '/admin/pmRemindConfig/info',
  create = '/admin/pmRemindConfig/create',
  update = '/admin/pmRemindConfig/update',
  delete = '/admin/pmRemindConfig/delete',

  supportAttr = '/admin/pmRemindConfig/supportAttr',
  enabled = '/admin/pmRemindConfig/enabled',
}

export function getRemindConfig(data: QueryRemindConfigForm): Promise<RemindConfigResult[]>;
export function getRemindConfig(
  data: QueryRemindConfigForm,
  status: YN,
): Promise<RemindConfigResult[]>;
export function getRemindConfig(
  data: QueryRemindConfigForm,
  status: YN,
  isTable: true,
): Promise<Result<RemindConfigResult[]>>;
export function getRemindConfig(data: QueryRemindConfigForm, status = YN.Y, isTable?: boolean) {
  return defHttp.post(
    {
      url: Api.remindConfig,
      data: { status: status === YN.Y ? YN.Y : undefined, ...data },
    },
    { isTable },
  );
}

export function getRemindConfigById(id: number) {
  return defHttp.post<RemindConfigResult>({
    url: Api.info,
    data: { id },
  });
}

export function createRemindConfig(data = {}) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updateRemindConfig(data = {}) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function deleteRemindConfig(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}

export interface SupportAttr {
  name: string;
  code: string;
  unit: string;
  mark?: string;
}

export function getSupportAttr(equipmentType: EquipmentType, id: number) {
  return defHttp.post<SupportAttr[]>({
    url: Api.supportAttr,
    data: { equipmentType, id },
  });
}

export function enabledRemindConfig(ids: number[], status: YN) {
  return defHttp.post({
    url: Api.enabled,
    data: { ids, status },
  });
}
