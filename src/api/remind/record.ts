import { QueryRemindRecordForm, RemindRecordResult } from './model/recordModel';
import { defHttp } from '@/utils/http/axios';

enum Api {
  record = '/admin/pmRemindRecord',
  info = '/admin/pmRemindRecord/info',

  pmNotificationRecord = '/admin/pmNotificationRecord',
  pmNotificationRecordInfo = '/admin/pmNotificationRecord/info',
  resend = '/admin/pmNotificationRecord/resend',
}

export function getRemindRecord(data?: QueryRemindRecordForm, isTable = true) {
  return defHttp.post<RemindRecordResult[]>(
    {
      url: Api.record,
      data: { ...data },
    },
    { isTable },
  );
}

export function getRemindRecordById(id: number) {
  return defHttp.post<RemindRecordResult>({
    url: Api.info,
    data: { id },
  });
}

export function getNotificationRecord(data?: {}, isTable = true) {
  return defHttp.post<any[]>(
    {
      url: Api.pmNotificationRecord,
      data: { ...data },
    },
    { isTable },
  );
}

export function getNotificationRecordById(id: number) {
  return defHttp.post<any>({
    url: Api.pmNotificationRecordInfo,
    data: { id },
  });
}

export function resendNotificationRecordById(id: number) {
  return defHttp.post({
    url: Api.resend,
    data: { id },
  });
}
