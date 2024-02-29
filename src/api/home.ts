import { defHttp } from '../utils/http/axios';
import { HomeCountInfo, NameCodeResult, NameValueResult } from './model/homeModel';

enum Api {
  count = '/admin/home/count',
  equipmentRemind = '/admin/home/equipmentRemind',
  monthRemind = '/admin/home/monthRemind',
  dayRemind = '/admin/home/dayRemind',
  alarmLevel = '/admin/home/alarmLevel',
  attributeRemind = '/admin/home/attributeRemind',

  enums = '/admin/home/enums',
}

export function getHomeCount() {
  return defHttp.get<HomeCountInfo>({
    url: Api.count,
  });
}

export function getHomeEquipmentRemind() {
  return defHttp.get<NameValueResult[]>({
    url: Api.equipmentRemind,
  });
}

export function getHomeMonthRemind() {
  return defHttp.get<NameValueResult[]>({
    url: Api.monthRemind,
  });
}

export function getHomeDayRemind() {
  return defHttp.get<NameValueResult[]>({
    url: Api.dayRemind,
  });
}

export function getHomeAlarmLevel() {
  return defHttp.get<NameValueResult[]>({
    url: Api.alarmLevel,
  });
}

export function getHomeAttributeRemind() {
  return defHttp.get<NameValueResult[]>({
    url: Api.attributeRemind,
  });
}

export const getEnums = () =>
  defHttp.get<Record<string, NameCodeResult[]>>({
    url: Api.enums,
  });
