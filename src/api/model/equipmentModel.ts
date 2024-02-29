import { SensorResult } from './sensorModel';
import { StoreResult } from './storeModel';
import { YN } from '@/enums/YN';
import { AttributeType } from '@/enums/attributeType';
import { SensorType } from '@/enums/sensorType';

export interface QueryEquipmentForm {
  storeInfo?: string;
  remark?: string;
  storeId?: number;
  equipmentName?: string;
}

export interface EquipmentResult {
  id: number; //id
  storeId: number; //地点id（所在地点）
  equipmentName: string; //设备名称
  workingAmpere: number; //工作电流
  remark: string; //备注
  sortNum: number; //排序
  electricalEnergy: number; //总能耗
  workingHours: number; //总工作时长
  createTime: string; //创建日期
  createBy: string; //创建者
  updateTime: string; //更新日期
  updateBy: string; //更新者
  store: StoreResult; //地点信息
  sensorList: SensorResult[]; //和设备相关的传感器
}

export interface EquipmentAttributeResult {
  id: number;
  storeId: number;
  sensorType: SensorType;
  bindingSensor: YN;
  sensorId: number;
  attributeSerial: string;
  attributeType: AttributeType;
  equipmentId: number;
  remark: string;
  createTime: string;
  createBy: string;
  updateTime: string;
  updateBy: string;
  sensor: SensorResult;
}

export interface EquipmentData {
  attributeId: number;
  avgValue: number;
  createTime: string;
  dataDay: string;
  equipmentId: number;
  equipmentName: string;
  id: number;
  maxValue: number;
  minValue: number;
  totalCount: number;
  totalValue: number;
  updateTime: string;
  value0: number | null;
  value1: number | null;
  value2: number | null;
  value3: number | null;
  value4: number | null;
  value5: number | null;
  value6: number | null;
  value7: number | null;
  value8: number | null;
  value9: number | null;
  value10: number | null;
  value11: number | null;
  value12: number | null;
  value13: number | null;
  value14: number | null;
  value15: number | null;
  value16: number | null;
  value17: number | null;
  value18: number | null;
  value19: number | null;
  value20: number | null;
  value21: number | null;
  value22: number | null;
  value23: number | null;
}
