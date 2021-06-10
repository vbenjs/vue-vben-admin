import { defHttp } from '/@/utils/http/axios';
import { DemoOptionsItem } from './model/optionsModel';
enum Api {
  OPTIONS_LIST = '/select/getDemoOptions',
}

/**
 * @description: Get sample options value
 */
export const optionsListApi = () => defHttp.get<DemoOptionsItem[]>({ url: Api.OPTIONS_LIST });
