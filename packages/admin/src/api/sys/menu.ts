import { defaultRequest } from '/@/plugins/request'
import type { GetMenuListResultModel } from '@vben-admin/types/model'

enum Api {
  GetMenuList = '/getMenuList',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defaultRequest.get<GetMenuListResultModel>({ url: Api.GetMenuList })
}
