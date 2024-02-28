import { YN } from '@/enums/YN';
import { TemplateType } from '@/enums/templateType';

export interface HxPrintTemplate {
  id: number; //
  templateType: TemplateType; // 模版类型，盒、箱、托、出库单、入库单
  name: string; // 名称
  content: string; // 内容
  enabled: YN; // 启用：Y->是；N->否
  sortNum: number; // 排序
  note: string; // 备注
}

export interface QueryHxPrintTemplateForm {
  templateType?: TemplateType;
  name?: string;
  enabled?: YN;
}
