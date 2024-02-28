import { ProductType } from '@/enums/productType';
import { BasePageForm } from '..';
import { YN } from '@/enums/YN';
import { HxProduct } from './product';

export interface HxBillItem {
  id: number; // id
  billCode: string; // 单据编号
  productCode: string; // 产品编号
  productType: ProductType; // 类型，盒、箱、托
  scanCreate: YN; // 是否扫码创建， Y/N
  scanConfirm: YN; // 是否扫码确认， Y/N
  confirmStatus: YN; // 确认状态， Y/N
  confirmTime: string; // 确认时间
  confirmName: string; // 接收人
  confirmBy: string; // 接收人
  confirmItem: number; // 确认数量
  totalItem: number; // 总数量
  note: string; // 备注

  product: HxProduct;
}

export interface QueryHxBillItemForm extends BasePageForm {
  billCode?: string; // 单据编号
  productCode?: string; // 产品编号
  productType?: ProductType; // 类型，盒、箱、托
  scanCreate?: YN; // 是否扫码创建， Y/N
  scanConfirm?: YN; // 是否扫码确认， Y/N
  confirmStatus?: YN; // 确认状态， Y/N
  confirmTime?: string; // 确认时间
  confirmName?: string; // 接收人
  confirmBy?: string; // 接收人
}
