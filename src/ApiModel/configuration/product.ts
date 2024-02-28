import { YN } from '@/enums/YN';

export interface HxBaseProduct {
  id: number; //
  name: string; // 产品名称
  code: string; // 产品编码
  spec: string; // 产品规格
  shape: string; // 产品图形
  figure: string; // 产品figure
  bar: string; // 产品bar
  pn: string; // 产品料号
  enabled: YN; // 启用：Y->是；N->否
  sortNum: number; // 排序
  note: string; // 备注
}

export interface QueryHxBaseProductForm {
  name?: string;
  code?: string;
  spec?: string;
  shape?: string;
  figure?: string;
  bar?: string;
  pn?: string;
  enabled?: YN;
  notInCustomerId?: number;
}
