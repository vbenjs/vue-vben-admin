import { Account } from '../../system/model/accountModel';
import { YN } from '@/enums/YN';

export interface QueryRemindTemplateForm {
  title?: string;
  enabled?: YN;
  createTime?: string;
  updateTime?: string;
}

export interface RemindTemplateResult {
  id: number; // id
  title: string; // 模板名称
  maxRemindCount: number; // 最大告警次数，0为不限制
  remindInterval: number; // 告警间隔秒，最低60
  operatorId: number; // 通知运营
  remindManagerCount: number; // 达最大次数后通知管理，0为不通知
  // managerIds: string; // 通知管理（多个）
  mark: string; // 备注
  sortNum: number; // 排序
  enabled: YN; // 启用Y/禁用N
  createTime: string; // 创建日期
  createBy: string; // 创建者
  updateTime: string; // 更新日期
  updateBy: string; // 更新者
  remindOperator: Account;
  remindManager: Account[];
  // messages: RemindMessageResult[]; // 告警消息
}
