import { BasePageForm } from '..';

export interface PmCompanySupplierForm {
  companyId?: number; // 企业id
  supplierId?: number; // 供应商id
  name?: string; // 名称
  note?: string; // 备注
}

export type PmCompanySupplierUpdate = PmCompanySupplierForm & { id: number };

export interface PmCompanySupplier extends PmCompanySupplierUpdate {
  createdTime: string; // 创建时间
  createdBy: string; // 创建人
  updatedTime: string; // 修改时间
  updatedBy: string; // 更新人
}

export interface QueryPmCompanySupplierForm extends BasePageForm {
  companyId?: number;
  supplierId?: number;
  name?: string;
}
