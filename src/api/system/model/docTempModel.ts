import { TemplateEnum } from '../../export';
import { YN } from '@/enums/YN';

export interface DocTemplateResult {
  createdBy: string;
  createdTime: number;
  id: number;
  isEnable: YN;
  resource: null;
  resourceId: string;
  sortNum: number;
  supportMaxRecord: number;
  sysDefault: YN;
  templateName: string;
  templateType: TemplateEnum;
  updatedBy: string;
  updatedTime: number;
}

export interface QueryDocTemplateForm {
  templateType: string;
  isEnable?: YN;
}

export interface UpdateDocTemplateData {
  templateName: string;
  templateType: string;
  resourceId: string;
  isEnable: YN;
  supportMaxRecord: string | number;
  sortNum?: number;
}
