import {
  QuerySensorForm,
  SensorOriginDataForm,
  SensorOriginDataResult,
  SensorResult,
} from './model/sensorModel';
import { defHttp } from '@/utils/http/axios';
import { Result } from '/#/axios';

enum Api {
  sensor = '/admin/pmSensor',
  info = '/admin/pmSensor/',
  mark = '/admin/pmSensor/mark',
  originData = '/admin/pmSensor/originData',
  delete = '/admin/pmSensor/delete',
}

export function getSensor(data: QuerySensorForm, isTable = false) {
  return defHttp.post<SensorResult[]>(
    {
      url: Api.sensor,
      data,
    },
    {
      isTable,
    },
  );
}

export function getSensorById(id: number) {
  return defHttp.post<SensorResult>({
    url: Api.info + id,
  });
}

export function updateSensorMark(data = {}) {
  return defHttp.post({
    url: Api.mark,
    data,
  });
}

export async function getSensorOriginData(data: SensorOriginDataForm) {
  const result = await defHttp.post<Result<(SensorOriginDataResult | string)[]>>(
    {
      url: Api.originData,
      data,
    },
    { isTable: true },
  );
  result.data = result.data.map((item) => {
    if (typeof item === 'string') return JSON.parse(item);
    return item;
  });
  return result as Result<SensorOriginDataResult[]>;
}

export function deleteSensor(id: number) {
  return defHttp.post({
    url: Api.delete,
    data: { id },
  });
}
