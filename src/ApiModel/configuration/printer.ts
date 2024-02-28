import { YN } from '@/enums/YN';

export interface HxPrinter {
  id: number; //
  name: string; // 名称
  printerCode: string; // 打印机编号（客户端注册后生成）
  originName: string; // 原始名称（打印使用）
  displayName: string; // 显示名称（客户端显示）
  address: string; // ip地址
  enabled: YN; // 启用：Y->是；N->否
  sortNum: number; // 排序
  note: string; // 备注

  clientOnline: boolean;
  createdBy: string;
  createdTime: string;
  hostname: string;
  platform: string;
  printerOnline: boolean;
}

export interface QueryHxPrinterForm {
  name?: string;
  printerCode?: string;
  originName?: string;
  displayName?: string;
  address?: string;
  enabled?: YN;
}

export interface HxPrinterClient {
  clientId: string; // 唯一编号
  clientName: string; // 计算机名称
  platform: string; // 平台
  printList: PrinterInfo[]; // 打印机列表
}

export interface PrinterInfo {
  name: string; // 打印机名称
  displayName: string; // 显示名称
  description: string; // 详情
  status: number; // 状态，3好像是就绪
  isDefault: string; // 是否是默认打印机
}
