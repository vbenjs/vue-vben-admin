import { GatewayResult } from './gatewayModel';
import { StoreResult } from './storeModel';
import { SensorType } from '@/enums/sensorType';

export interface QuerySensorForm {
  storeInfo?: string;
  terminalNum?: string;
  remark?: string;
  storeId?: number;
  gatewayId?: string;
  equipmentId?: string;
  sensorType?: SensorType;
  sensorNum?: string;
  bindingEquipment?: string;
  lastDataTime?: string;
}

export interface SensorResult {
  id: number; // id
  storeId: number; // 地点id（所在地点）， 后台操作网关绑定某个地点，其下的传感器自定绑定
  equipmentId: number; // 绑定设备id，网关指定地点后，可由地点设置传感器绑定情况
  gatewayId: number; // 网关id
  sensorType: SensorType; // 传感器类型
  sensorNum: string; // 传感器编号
  otherInfo: string; // 其他信息
  remark: string; // 备注
  lastData: string; // 最后值（累计值/具体值）
  lastDataTime: string; // 最后通讯时间
  createTime: string; // 创建日期
  createBy: string; // 创建者
  updateTime: string; // 更新日期
  updateBy: string; // 更新者
  gateway: GatewayResult; // 网关
  store: StoreResult; // 绑定地点
}

export interface SensorOriginDataForm {
  id: number;
  createTime: string;
}

export interface SensorOriginDataResult {
  ampere: number; // 电流
  cardNumber: string; // 卡号
  durationTime: number; // 持续时间
  electricalEnergy: number; // 电量
  lastNotRepairTime: string; // 最后未修复时间
  nodeData: string; // 节点数据
  nodeNumber: string; // 节点编号
  receiveTime: string; // 接收时间
  repair: boolean; // 是否修复
  serialNumber: string; // 序列号
}
