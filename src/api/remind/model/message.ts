import { YN } from '@/enums/YN';
import { MessageType } from '@/enums/messageType';

export interface QueryRemindMessageForm {
  title?: string;
  messageType?: MessageType;
  messageCode?: string;
  enabled?: YN;
}

export interface RemindMessageResult {
  id: number; // id
  title: string; // 标题
  messageType: MessageType; // 消息类型，短信、邮件、微信模板消息
  messageCode: string; // 消息编码，短信/微信模板消息
  content: string; // 内容
  mark: string; // 备注
  sortNum: number; // 排序
  enabled: YN;
  createTime: string; // 创建日期
}
