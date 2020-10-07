import { defHttp } from '/@/utils/http/axios';
import { DemoParams, DemoListGetResultModel } from './model/tableModel';

enum Api {
  DEMO_LIST = '/table/getDemoList',
}

/**
 * @description: 获取示例列表值
 */
export function demoListApi(params: DemoParams) {
  return defHttp.request<DemoListGetResultModel>({
    url: Api.DEMO_LIST,
    method: 'GET',
    params,
  });
}
