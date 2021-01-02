import { defHttp } from '/@/utils/http/axios';
import { DemoOptionsGetResultModel } from './model/optionsModel';

enum Api {
  OPTIONS_LIST = '/select/getDemoOptions',
}

/**
 * @description: Get sample options value
 */
export function optionsListApi() {
  return defHttp.request<DemoOptionsGetResultModel>({
    url: Api.OPTIONS_LIST,
    method: 'GET',
  });
}
