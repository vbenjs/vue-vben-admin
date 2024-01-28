import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';
import { AvailableStatus } from '@/utils/constants';

export type RoleParams = {
  roleName?: string;
  status?: string;
};

export interface RoleListItem {
  id: string;
  roleName: string;
  roleValue: string;
  status: AvailableStatus;
  orderNo: string;
  createTime: string;
}

export type RolePageParams = BasicPageParams & RoleParams;

export type RolePageListGetResultModel = BasicFetchResult<RoleListItem>;

export type RoleListGetResultModel = RoleListItem[];
