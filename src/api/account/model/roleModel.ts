import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';
import { AvailableStatus } from '@/utils/constants';

export type RoleParams = {
  q?: string;
  status?: string;
  isAll?: boolean;
};

export interface RoleListItem {
  id: string;
  name: string;
  perm: string;
  status: AvailableStatus;
  sort: string;
  createdAt: string;
}

export type RolePageParams = BasicPageParams & RoleParams;

export type RolePageListGetResultModel = BasicFetchResult<RoleListItem>;

export type RoleListGetResultModel = RoleListItem[];
