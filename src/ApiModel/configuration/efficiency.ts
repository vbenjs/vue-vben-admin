import { YN } from '@/enums/YN';

export interface HxBaseEfficiency {
  id: number; //
  name: string; // 能效名称
  code: string; // 能效编码
  power: string; // norminal功率？
  ratio: string; // efficiency能效比
  enabled: YN; // 启用：Y->是；N->否
  sortNum: number; // 排序
  note: string; // 备注
}

export interface QueryHxBaseEfficiencyForm {
  name?: string;
  code?: string;
  power?: string;
  ratio?: string;
  enabled?: YN;
}
