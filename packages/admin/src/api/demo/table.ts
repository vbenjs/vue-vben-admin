import { defaultRequest } from '/@/plugins/request'
import type {
  DemoParams,
  DemoListGetResultModel,
} from '@vben-admin/types/model'

enum Api {
  DEMO_LIST = '/table/getDemoList',
}

/**
 * @description: Get sample list value
 */

export const demoListApi = (params: DemoParams) =>
  defaultRequest.get<DemoListGetResultModel>({
    url: Api.DEMO_LIST,
    params,
    headers: {
      // @ts-ignore
      ignoreCancelToken: true,
    },
  })
