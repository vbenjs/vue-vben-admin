import { YN } from '@/enums/YN';

export interface HxPda {
  id: number; //
  name: string; // 名称
  code: string; // 编号
  enabled: YN; // 启用：Y->是；N->否
  packageCount: number; // 默认盒数
  boxCount: number; // 默认箱数
  shortageBox: YN; // 箱中是否允许不足：Y->是；N->否
  shortagePallet: YN; // 托中是否允许不足：Y->是；N->否
  shortageStore: YN; // 允许不完整入库：Y->是；N->否
  mixBox: YN; // 箱中是否允许混装：Y->是；N->否
  mixPallet: YN; // 托中是否允许混装：Y->是；N->否
  modifyLock: YN; // pda是否可修改配置：Y->是；N->否（盒/箱数）
  sortNum: number; // 排序
  note: string; // 备注

  boxRule: string; // 盒规则
  billInRule: string; // 入库单规则
}

export interface QueryHxPdaForm {
  name?: string;
  code?: string;
  enabled?: YN;
}
