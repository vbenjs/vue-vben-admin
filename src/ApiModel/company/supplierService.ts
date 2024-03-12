import { BasePageForm } from '..';

export interface PmSupplierServiceForm {
  companyId?: number; // 企业id
  supplierId?: number; // 供应商id
  name?: string; // 名称
  note?: string; // 备注
}

export type PmSupplierServiceUpdate = PmSupplierServiceForm & { id: number };

export interface PmSupplierService extends PmSupplierServiceUpdate {
  createdTime: string; // 创建时间
  createdBy: string; // 创建人
  updatedTime: string; // 修改时间
  updatedBy: string; // 更新人
}

export interface QueryPmSupplierServiceForm extends BasePageForm {
  companyId?: number;
  supplierId?: number;
  name?: string;
}
