import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';
/**
 * @description: 请求列表接口参数
 */
export type DemoParams = BasicPageParams;

export interface DemoListItem {
  id: string;
  beginTime: string;
  endTime: string;
  address: string;
  name: string;
  no: number;
  status: number;
}

/**
 * @description: 请求列表返回值
 */
export type DemoListGetResultModel = BasicFetchResult<DemoListItem>;
