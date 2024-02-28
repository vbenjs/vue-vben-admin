import { YN } from '@/enums/YN';

export interface HxCustomer {
  id: number; //
  name: string; // 名称
  enabled: YN; // 启用：Y->是；N->否
  sortNum: number; // 排序
  note: string; // 备注
}

export interface QueryHxCustomerForm {
  name?: string;
  enabled?: YN;
}

export interface SysDataRelation {
  mainId: number | string; // 主表id
  subIds: (number | string)[]; // 子表id
}
