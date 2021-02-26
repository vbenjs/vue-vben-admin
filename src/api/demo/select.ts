import { defHttp } from '/@/utils/http/axios';
import { DemoOptionsGetResultModel } from './model/optionsModel';
const { get } = defHttp;

enum Api {
  OPTIONS_LIST = '/select/getDemoOptions',
}

/**
 * @description: Get sample options value
 */
export const optionsListApi = () => get<DemoOptionsGetResultModel>({ url: Api.OPTIONS_LIST });
