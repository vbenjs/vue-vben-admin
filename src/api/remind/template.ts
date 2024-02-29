import { QueryRemindTemplateForm, RemindTemplateResult } from './model/template';
import { Result } from '/#/axios';
import { YN } from '@/enums/YN';
import { defHttp } from '@/utils/http/axios';

enum Api {
  RemindTemplate = '/admin/pmRemindTemplate',
  info = '/admin/pmRemindTemplate/info',
  create = '/admin/pmRemindTemplate/create',
  update = '/admin/pmRemindTemplate/update',
  delete = '/admin/pmRemindTemplate/delete',
  enabled = '/admin/pmRemindTemplate/enabled',
}

export function getRemindTemplate(data: QueryRemindTemplateForm): Promise<RemindTemplateResult[]>;
export function getRemindTemplate(
  data: QueryRemindTemplateForm,
  enabled: YN,
): Promise<RemindTemplateResult[]>;
export function getRemindTemplate(
  data: QueryRemindTemplateForm,
  enabled: YN,
  isTable: true,
): Promise<Result<RemindTemplateResult[]>>;
export function getRemindTemplate(
  data: QueryRemindTemplateForm,
  enabled = YN.Y,
  isTable?: boolean,
) {
  return defHttp.post(
    {
      url: Api.RemindTemplate,
      data: {
        enabled: enabled === YN.Y ? YN.Y : undefined,
        field: 'sortNum',
        order: 'desc',
        ...data,
      },
    },
    { isTable },
  );
}

export function getRemindTemplateById(id: number) {
  return defHttp.post<RemindTemplateResult>({
    url: Api.info,
    data: { id },
  });
}

export function createRemindTemplate(data = {}) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updateRemindTemplate(data = {}) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function deleteRemindTemplate(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}

export function enabledRemindTemplate(ids: number[], status: YN) {
  return defHttp.post({
    url: Api.enabled,
    data: { ids, status },
  });
}
