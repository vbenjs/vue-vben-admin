import { BasicFetchResult } from '@/api/model/baseModel';

export type DeptParams = {
  deptName?: string;
  status?: string;
};

export interface DeptListItem {
  id: string;
  orderNo: string;
  createTime: string;
  remark: string;
  status: number;
}

export type DeptListGetResultModel = BasicFetchResult<DeptListItem>;
