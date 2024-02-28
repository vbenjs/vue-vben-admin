import { YN } from '@/enums/YN';
import { OtherDataType } from '@/enums/baseDataType';

export interface HxBaseData {
  id: number; //
  dataType: OtherDataType; // 数据类型, 班次、线别、片源、单多晶类型、等级、颜色
  name: string; // 名称
  code: string; // 编码
  other: string; // 别名
  bar: string; // 条码值
  enabled: YN; // 启用：Y->是；N->否
  sortNum: number; // 排序
  note: string; // 备注
}

export interface QueryHxBaseDataForm {
  dataType: OtherDataType;
  name?: string;
  code?: string;
  other?: string;
  bar?: string;
  enabled?: YN;
}
