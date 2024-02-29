import { QueryRemindMessageForm, RemindMessageResult } from './model/message';
import { Result } from '/#/axios';
import { YN } from '@/enums/YN';
import { defHttp } from '@/utils/http/axios';

enum Api {
  RemindMessage = '/admin/pmRemindMessage',
  info = '/admin/pmRemindMessage/info',
  create = '/admin/pmRemindMessage/create',
  update = '/admin/pmRemindMessage/update',
  delete = '/admin/pmRemindMessage/delete',
  enabled = '/admin/pmRemindMessage/enabled',
  updateContent = '/admin/pmRemindMessage/updateContent',
  wx = '/admin/pmRemindMessage/wxTemplates',

  wxSubscribe = '/admin/pmRemindMessage/wxSubscribe',
  wxTest = '/admin/pmRemindMessage/wxTest',
  deleteWxSubscribe = '/admin/pmRemindMessage/wxSubscribe/delete',
}

export function getRemindMessage(data: QueryRemindMessageForm): Promise<RemindMessageResult[]>;
export function getRemindMessage(
  data: QueryRemindMessageForm,
  enabled: YN,
): Promise<RemindMessageResult[]>;
export function getRemindMessage(
  data: QueryRemindMessageForm,
  enabled: YN,
  isTable: true,
): Promise<Result<RemindMessageResult[]>>;
export function getRemindMessage(
  data: QueryRemindMessageForm,
  enabled = YN.Y,
  isTable: boolean = false,
) {
  return defHttp.post(
    {
      url: Api.RemindMessage,
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

export function getRemindMessageById(id: number) {
  return defHttp.post<RemindMessageResult>({
    url: Api.info,
    data: { id },
  });
}

export function createRemindMessage(data = {}) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updateRemindMessage(data = {}) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function deleteRemindMessage(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}

export function enabledRemindMessage(ids: number[], status: YN) {
  return defHttp.post({
    url: Api.enabled,
    data: { ids, status },
  });
}

export function updateRemindMessageContent(id: number, content: string) {
  return defHttp.post({
    url: Api.updateContent,
    data: { id, content },
  });
}

export function getWxTemplates() {
  return defHttp.get({
    url: Api.wx,
  });
}

export function getWxSubscribe(data: {}, isTable = true) {
  return defHttp.post(
    {
      url: Api.wxSubscribe,
      data,
    },
    { isTable },
  );
}

export function deleteWxSubscribe(ids: number[]) {
  return defHttp.post({
    url: Api.deleteWxSubscribe,
    data: { ids },
  });
}

export function postWxTest(id: number) {
  return defHttp.post({
    url: Api.wxTest,
    data: { id },
  });
}
