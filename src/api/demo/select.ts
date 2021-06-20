import { defHttp } from '/@/utils/http/axios';
import { DemoOptionsItem, selectParams } from './model/optionsModel';
enum Api {
  OPTIONS_LIST = '/select/getDemoOptions',
}

/**
 * @description: Get sample options value
 */
export const optionsListApi = (params?: selectParams) =>
  defHttp.post<DemoOptionsItem[]>({ url: Api.OPTIONS_LIST, params });
