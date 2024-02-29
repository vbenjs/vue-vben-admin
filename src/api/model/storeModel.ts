import { YN } from '@/enums/YN';

export interface QueryStoreForm {
  storeNumber?: string;
  name?: string;
  people?: string;
  createTime?: string;
}

export interface StoreResult {
  id: number;
  storeNumber: string;
  name: string;
  province: string;
  city: string;
  address: string;
  createTime: string;
  creator: string;
  monitorNonoperating: string;
  num: string;
  people: string;
  phone: string;
  remark: string;
  rule: string;
  startTime: string;
  endTime: string;
  monitorStatus: YN;

  store: StoreResult;
}
