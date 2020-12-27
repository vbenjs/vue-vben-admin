import { BasicFetchResult } from '/@/api/model/baseModel';

export interface DemoOptionsItem {
  label: string;
  value: string;
}

/**
 * @description: Request list return value
 */
export type DemoOptionsGetResultModel = BasicFetchResult<DemoOptionsItem[]>;
