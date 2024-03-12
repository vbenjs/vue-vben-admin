import { YN } from '@/enums/YN';

export interface BatchModifyStatusForm {
  ids: number[];
  status: YN;
}
