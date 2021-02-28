import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type Params = BasicPageParams & {
  account?: string;
  nickname?: string;
};

export interface DemoListItem {
  id: string;
  account: string;
  email: string;
  nickname: string;
  role: number;
  updateTime: string;
  remark: string;
}

/**
 * @description: Request list return value
 */
export type DemoListGetResultModel = BasicFetchResult<DemoListItem>;
