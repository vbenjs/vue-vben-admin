import { YN } from '@/enums/YN';
import { CompanyType } from '@/enums/companyType';
import { BasePageForm } from '..';

export interface PmCompanyForm {
  name?: string; // 名称
  shortName?: string; // 简称
  code?: string; // 编码
  shortCode?: string; // 短码
  email?: string; // 邮箱
  phone?: string; // 电话
  contract?: string; // 联系人
  contractPhone?: string; // 联系人电话
  uscCode?: string; // 统一社会信息用代码
  uscExpired?: string; // 营业执照有效期
  businessScope?: string; // 经营范围
  website?: string; // 网站
  city?: string; // 市
  province?: string; // 省
  area?: string; // 区
  address?: string; // 地址
  enabled: YN; // 状态：Y->启用；N->禁用
  companyType: CompanyType; // 企业类型
  expiryDate?: string; // 有效期至
  inviterId?: number; // 邀请者ID
  parentId?: number; // 上层集团id
  note?: string; // 备注
}

export type PmCompanyUpdate = PmCompanyForm & { id: number };

export interface PmCompany extends PmCompanyUpdate {
  createdTime: string; // 创建时间
  createdBy: string; // 创建人
  updatedTime: string; // 修改时间
  updatedBy: string; // 更新人
}

export interface QueryPmCompanyForm extends BasePageForm {
  name?: string;
  shortName?: string;
  code?: string;
  shortCode?: string;
  email?: string;
  phone?: string;
  contract?: string;
  contractPhone?: string;
  uscCode?: string;
  uscExpired?: string;
  website?: string;
  city?: string;
  province?: string;
  area?: string;
  enabled?: YN;
  companyType?: CompanyType;
  parentId?: number;
  page?: number;
  limit?: number;
  field?: string;
  order?: string;
  isTable?: boolean;
}
