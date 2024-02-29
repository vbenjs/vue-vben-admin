import { YN } from '../enums/YN';
import {
  QueryEquipmentForm,
  EquipmentResult,
  EquipmentAttributeResult,
  EquipmentData,
} from './model/equipmentModel';
import { defHttp } from '@/utils/http/axios';

enum Api {
  equipment = '/admin/pmEquipment',
  info = '/admin/pmEquipment/',
  create = '/admin/pmEquipment/create',
  update = '/admin/pmEquipment/update',
  delete = '/admin/pmEquipment/delete',

  attributeMark = '/admin/pmEquipment/attributeMark', // 设备属性备注更新
  attrs = '/admin/pmEquipment/attributes/', //通过设备id查询设备属性信息
  bindSensor = '/admin/pmEquipment/bindSensor',
  changeSensor = '/admin/pmEquipment/changeSensor',
  unbindSensor = '/admin/pmEquipment/unbindSensor',

  data = '/admin/pmEquipmentData',
}

export function getEquipment(data: QueryEquipmentForm, isTable = false) {
  return defHttp.post<EquipmentResult[]>(
    {
      url: Api.equipment,
      data,
    },
    {
      isTable,
    },
  );
}

export function getEquipmentById(id: number) {
  return defHttp.post<EquipmentResult>({
    url: Api.info + id,
  });
}

export function createEquipment(data = {}) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updateEquipment(data = {}) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function deleteEquipment(ids: number[]) {
  return defHttp.post({
    url: Api.delete,
    data: { ids },
  });
}

export function updateAttributeMark(data: { id: number; remark: string }) {
  return defHttp.post({
    url: Api.attributeMark,
    data: {
      id: data.id,
      mark: data.remark,
    },
  });
}

export function getEquipmentAttributes(id: number, isTable = false) {
  return defHttp.post<EquipmentAttributeResult[]>(
    {
      url: Api.attrs + id,
    },
    { isTable },
  );
}

export function equipmentBindSensor(equipmentId: number, sensorIds: number[]) {
  return defHttp.post({
    url: Api.bindSensor,
    data: { equipmentId, sensorIds },
  });
}

export function equipmentChangeSensor(equipmentId: number, sensorId1: number, sensorId2: number) {
  return defHttp.post({
    url: Api.changeSensor,
    data: { equipmentId, sensorId1, sensorId2 },
  });
}

export function equipmentUnbindSensor(equipmentId: number, sensorIds: number[], deleteData: YN) {
  return defHttp.post({
    url: Api.unbindSensor,
    data: { equipmentId, sensorIds, deleteData },
  });
}

export const getEquipmentDeta = (data: Record<string, any>) => {
  return defHttp.post<EquipmentData[]>({
    url: Api.data,
    data,
  });
};
