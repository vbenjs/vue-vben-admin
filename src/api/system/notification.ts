import { RemindRecordResult } from '../remind/model/recordModel';
import { Result } from '/#/axios';
import { YN } from '@/enums/YN';
import { defHttp } from '@/utils/http/axios';

enum Api {
  alarmRemind = '/admin/home/alarmRemind',
  readAlarm = '/admin/home/readAlarm',
  alarmDetail = '/admin/home/alarmDetail',
}

interface QueryNotificationForm {
  field?: string;
  limit?: number;
  order?: string;
  page?: number;
  readStatus?: YN;
}
export function getAlarmRemind(data: QueryNotificationForm) {
  return defHttp.post<Result<RemindRecordResult[]>>(
    {
      url: Api.alarmRemind,
      data,
    },
    { isTable: true },
  );
}

export function readAlarm(ids: number[]) {
  return defHttp.post({
    url: Api.readAlarm,
    data: { ids },
  });
}

export function getAlarmDetail(id: number) {
  return defHttp.post<RemindRecordResult>({
    url: Api.alarmDetail,
    data: { id },
  });
}
