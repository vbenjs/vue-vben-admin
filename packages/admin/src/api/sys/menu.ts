import { defHttp } from '/@/plugins/axios'
import type { GetMenuListResultModel } from '@vben-admin/types/model'

enum Api {
  GetMenuList = '/getMenuList',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get<GetMenuListResultModel>({ url: Api.GetMenuList })
}
