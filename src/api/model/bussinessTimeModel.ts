import { YN } from '@/enums/YN';

export interface QueryBusinessTimeForm {
  isEnable?: YN;
  remark?: string;
}

export interface BusinessTimeResult {
  id: number;
  startTime: string;
  endTime: string;
  remark: string;
  sortNum: string;
  status: YN;
}
