import { EquipmentAttributeResult } from '../../model/equipmentModel';
import { StoreResult } from '../../model/storeModel';
import { RemindMessageResult } from './message';
import { RemindTemplateResult } from './template';
import { YN } from '@/enums/YN';
import { AlarmLevel } from '@/enums/alarmLevel';
import { ConditionType } from '@/enums/conditionType';
import { EquipmentType } from '@/enums/equipmentType';

export interface QueryRemindConfigForm {
  storeId?: string;
  equipmentId?: string;
  templateId?: string;
  status?: YN;
  valid?: YN;
  alarmLevel?: AlarmLevel;
}

export interface RemindConfigResult {
  id: number; // id
  storeId: number; // 地点id（自动带）
  equipmentId: number; // 设备id
  equipmentType: EquipmentType;
  equipmentName: string;
  templateId: number; // 模板id
  timeRange: string; // 时间范围
  inRange: YN; // 时间范围内Y/外N
  alarmLevel: AlarmLevel; // 告警等级
  statType: string; // 统计方式，最大，最小，累计
  conditionType: ConditionType; // 条件类型，大于/小于
  conditionValue: number; // 条件阈值
  status: YN; // 状态,启用、禁用、失效
  valid: YN; // 是否有效
  mark: string; // 备注
  createTime: string; // 创建日期
  createBy: string; // 创建者
  updateTime: string; // 更新日期
  updateBy: string; // 更新者
  attributes: EquipmentAttributeResult[]; // 提醒属性
  messages: RemindMessageResult[];
  template: RemindTemplateResult;
  equipment: any;
  store: StoreResult;
}
