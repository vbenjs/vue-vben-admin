import { StoreResult } from '../../model/storeModel';
import { YN } from '@/enums/YN';
import { AlarmLevel } from '@/enums/alarmLevel';
import { AttributeType } from '@/enums/attributeType';
import { ConditionType } from '@/enums/conditionType';
import { EquipmentType } from '@/enums/equipmentType';

export interface QueryRemindRecordForm {
  remindId?: string;
  equipmentId?: string;
  equipmentName?: string;
  attributeType?: string;
  alarmLevel?: string;
  remindTime?: string;
  handleStatus?: string;
  ignoreToday?: string;
  remindAccountId?: string;
  updateTime?: string;
  createTime?: string;
  readTime?: string;
}

export interface RemindRecordResult {
  id: number; // id
  remindId: number; // 告警配置id
  equipmentType: EquipmentType; // 设备类型
  equipmentId: number; // 设备id
  equipmentName: string; // 设备名称
  attributeType: AttributeType; // 属性类型
  remindMsg: string; // 告警信息
  alarmLevel: AlarmLevel; // 告警等级
  timeRange: string; // 时间范围
  inRange: string; // 时间范围内Y/外N
  statType: string; // 统计方式，最大，最小，累计
  conditionType: ConditionType; // 条件类型，大于/小于
  conditionValue: number; // 条件阈值
  currentValue: number; // 当前值
  attributeUnit: string;
  remindTime: string; // 告警时间
  remindIndex: number; // 当日序号
  handleStatus: YN; // N未处理，Y已处理
  ignoreToday: string; // Y当日忽略
  reason: string; // 备注(原因)
  treatment: string; // 处理方案
  remindAccountId: number; // 通知给
  updateTime: string; // 更新时间
  createTime: string; // 创建时间
  readTime: string; // 阅读时间

  store: StoreResult;
  notificationWait: number;
  notificationCount: number;

  remindAccount: {
    id: number;
    username: string;
    name: string;
    phone: string;
  };
  ccList: {
    id: number;
    accountId: number;
    recordId: number;
    createTime: string;
    account: {
      id: number;
      username: string;
    };
  }[];
}
