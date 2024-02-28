import { BasePageForm } from '..';

export interface HxScanCode {
  id: number;
  barcode: string; // 条码值
  pdaCode: string; // pda
  createdTime: string; // 创建时间
  createdBy: string; // 创建人
}

export interface QueryHxScanCodeForm extends BasePageForm {
  barcode?: string;
  pdaCode?: string;
}
