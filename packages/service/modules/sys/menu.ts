import type { GetMenuListResultModel } from '../model'
import { defaultRequest } from '../../request'

enum Api {
  GetMenuList = '/getMenuList',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defaultRequest.get<GetMenuListResultModel>({ url: Api.GetMenuList })
}
