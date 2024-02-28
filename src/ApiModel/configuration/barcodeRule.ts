import { YN } from '@/enums/YN';
import { BarcodeRuleType } from '@/enums/barcodeRuleType';

export interface HxBarcodeRule {
  id: number; //
  ruleType: BarcodeRuleType; // 规格类型，盒、箱、托、其他
  bindField: string; // 绑定字段
  name: string; // 名称
  content: string; // 内容
  verify: string; // 校验规则
  enabled: YN; // 启用：Y->是；N->否
  sortNum: number; // 排序
  note: string; // 备注
}

export interface QueryHxBarcodeRuleForm {
  ruleType?: BarcodeRuleType;
  bindField?: string;
  name?: string;
  enabled?: string;
}
