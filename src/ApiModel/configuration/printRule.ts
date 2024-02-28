import { YN } from '@/enums/YN';
import { PrintRuleType } from '@/enums/printRuleType';
import { TemplateType } from '@/enums/templateType';
import { HxBarcodeRule } from './barcodeRule';
import { HxCustomer } from './customer';
import { HxPda } from './pda';
import { HxPrintTemplate } from './printTemplate';
import { HxPrinter } from './printer';
import { Account } from '@/ApiModel/system/accountModel';

export interface HxPrintRule {
  id: number;
  customerId: number; // 客户id
  name: string; // 名称
  templateId: number; // 模版id
  templateType: TemplateType; // 模版类型，盒、箱、托、出库单、入库单
  printerId: number; // 打印机id
  barcodeId: number; // 生成规则id
  refType: PrintRuleType; // 关联pda/用户id
  refId: number; // 关联id
  defaultRule: YN; // 默认规则：Y->是；N->否
  enabled: YN; // 启用：Y->是；N->否
  sortNum: number; // 排序
  note: string; // 备注

  customer?: HxCustomer;
  template?: HxPrintTemplate;
  printer?: HxPrinter;
  barcodeRule?: HxBarcodeRule;
  pda?: HxPda;
  account?: Account;
}

export interface QueryHxPrintRuleForm {
  name?: string; // 名称
  templateId?: number; // 模版id
  templateType?: TemplateType; // 模版类型，盒、箱、托、出库单、入库单
  defaultRule?: YN; // 默认规则：Y->是；N->否
  refType: PrintRuleType; // 关联pda/用户id
  refId: number; // 关联id
  refInfo: string; // 关联信息
  barcodeId?: number; // 生成规则id
  enabled?: YN; // 启用：Y->是；N->否
}
