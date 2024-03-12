import { YN } from '@/enums/YN';
import { BasePageForm } from '..';

export interface PmAreaForm {
  companyId?: number; // 企业id
  name?: string; // 名称
  parentId?: number; // 上层位置id
  idPath?: string; // 路径所有id
  enabled: YN; // 状态：Y->启用；N->禁用
  note?: string; // 备注
}

export type PmAreaUpdate = PmAreaForm & { id: number };

export interface PmArea extends PmAreaUpdate {
  createdTime: string; // 创建时间
  createdBy: string; // 创建人
  updatedTime: string; // 修改时间
  updatedBy: string; // 更新人
}

export interface QueryPmAreaForm extends BasePageForm {
  companyId?: number;
  name?: string;
  parentId?: number;
  idPath?: string;
  enabled?: YN;
}
