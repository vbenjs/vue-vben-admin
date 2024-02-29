export interface QueryStoreGroupForm {
  storeId?: string | number;
  groupName?: string;
}

export interface StoreGroupResult {
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
}
