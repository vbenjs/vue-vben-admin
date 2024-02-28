import { EnumsVo } from '@/ApiModel';
import { HxMesLog, QueryHxMesLogForm } from '@/ApiModel/system/HxMesLog';
import { defHttp } from '@/utils/http/axios';

enum Api {
  log = '/admin/hxMesLog',
  info = '/admin/hxMesLog/info',
  allPortType = '/admin/hxMesLog/allPortType',
  allErrType = '/admin/hxMesLog/allErrType',
}

export function getMesLogs(data?: QueryHxMesLogForm) {
  return defHttp.post<HxMesLog[]>(
    {
      url: Api.log,
      data,
    },
    { isTable: true },
  );
}

export function getMesLogById(id: number) {
  return defHttp.post<HxMesLog>({
    url: Api.info,
    data: { id },
  });
}

export function getAllPortType() {
  return defHttp.post<EnumsVo[]>({
    url: Api.allPortType,
  });
}

export function getAllErrType() {
  return defHttp.post<EnumsVo[]>({
    url: Api.allErrType,
  });
}
