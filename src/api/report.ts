import { defHttp } from '../utils/http/axios';
import { NameValueResult } from './model/homeModel';

enum Api {
  storeQoq = '/admin/report/storeQoq',
  storeRanking = '/admin/report/storeRanking',
  storeYearPower = '/admin/report/storeYearPower',
  storeYoy = '/admin/report/storeYoy',
  alarmReport = '/admin/report/alarmReport',
  alarmQoq = '/admin/report/alarmQoq',
  alarmYoy = '/admin/report/alarmYoy',
}

export function getStoreQoq(year: string | number, storeId: number) {
  return defHttp.post<NameValueResult[]>({
    url: Api.storeQoq,
    data: { year, storeId },
  });
}

export function getStoreRanking(data: {}, isTable = true) {
  return defHttp.post<NameValueResult[]>(
    {
      url: Api.storeRanking,
      data,
    },
    { isTable },
  );
}

export function getStoreYearPower(year: string | number, storeId: number) {
  return defHttp.post<NameValueResult[]>({
    url: Api.storeYearPower,
    data: { year, storeId },
  });
}

export function getStoreYoy(year: string | number, storeId: number) {
  return defHttp.post<NameValueResult[]>({
    url: Api.storeYoy,
    data: { year, storeId },
  });
}

export function getAlarmReport(data: { storeId: number; timeRange: string }) {
  return defHttp.post<NameValueResult[]>({
    url: Api.alarmReport,
    data,
  });
}

export function getAlarmQoq(year: string | number, storeId: number) {
  return defHttp.post<NameValueResult[]>({
    url: Api.alarmQoq,
    data: { year, storeId },
  });
}

export function getAlarmYoy(year: string | number, storeId: number) {
  return defHttp.post<NameValueResult[]>({
    url: Api.alarmYoy,
    data: { year, storeId },
  });
}
