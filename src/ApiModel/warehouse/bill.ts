import { YN } from '@/enums/YN';
import { BillStatus } from '@/enums/billStatus';
import { BillType } from '@/enums/billType';
import { SourceType } from '@/enums/sourceType';
import { BasePageForm } from '..';
import { HxBillItem } from './bilItem';

export interface HxBill {
  id: number; // id
  type: BillType; // 类型，出、入
  billCode: string; // 单据编号
  templateId: string; // 打印模版id，多个用,分割
  billDate: Date; // 单据日期
  outCode: string; // 外部单据编号，如出库单对应了订单号
  customerId: number; // 客户id
  source: SourceType; // 来源，pc/pda
  printCount: number; // 打印次数
  status: BillStatus; // 状态
  allMatch: YN; // 是否完全匹配， Y/N
  note: string; // 备注
  preparedEnd: Date; // 制单完成时间
  receiveStart: Date; // 接收开始时间
  receiveEnd: Date; // 接收完成时间
  receiveName: string; // 接收人
  receiveBy: string; // 接收人
  createdName: string; // 制单人
  createdBy: string; // 创建人

  itemList: HxBillItem[];
}

export interface QueryHxBillForm extends BasePageForm {
  type?: BillType; // 类型，出、入
  billCode?: string; // 单据编号
  templateId?: string; // 打印模版id，多个用,分割
  billDate?: string; // 单据日期
  outCode?: string; // 外部单据编号，如出库单对应了订单号
  customerId?: number; // 客户id
  source?: SourceType; // 来源，pc/pda
  status?: BillStatus; // 状态
  allMatch?: YN; // 是否完全匹配， Y/N
  preparedEnd?: string; // 制单完成时间
  receiveStart?: string; // 接收开始时间
  receiveEnd?: string; // 接收完成时间
  receiveName?: string; // 接收人
  receiveBy?: string; // 接收人
  createdName?: string; // 制单人
  createdTime?: string; // 创建时间
  createdBy?: string; // 创建人
  updatedTime?: string; // 修改时间
  updatedBy?: string; // 更新人
}
