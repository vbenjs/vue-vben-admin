import type { BasicPageParams, BasicFetchResult } from '../types'
import { request } from '@pkg/request'

/**
 * @description: Request list interface parameters
 */
export type DemoParams = BasicPageParams

export interface DemoListItem {
  id: string
  beginTime: string
  endTime: string
  address: string
  name: string
  no: number
  status: number
}

/**
 * @description: Request list return value
 */
export type DemoListGetResultModel = BasicFetchResult<DemoListItem>

enum Api {
  DEMO_LIST = '/table/getDemoList',
}

/**
 * @description: Get sample list value
 */

export const demoListApi = (params: DemoParams) =>
  request.get<DemoListGetResultModel>({
    url: Api.DEMO_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
