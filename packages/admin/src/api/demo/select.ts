import { defHttp } from '/@/plugins/axios'
import type { DemoOptionsItem, selectParams } from '@vben-admin/types/model'
enum Api {
  OPTIONS_LIST = '/select/getDemoOptions',
}

/**
 * @description: Get sample options value
 */
export const optionsListApi = (params?: selectParams) =>
  defHttp.get<DemoOptionsItem[]>({ url: Api.OPTIONS_LIST, params })
