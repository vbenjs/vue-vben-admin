import type { DemoOptionsItem, selectParams } from '../model'
import { defaultRequest } from '../../request'

enum Api {
  OPTIONS_LIST = '/select/getDemoOptions',
}

/**
 * @description: Get sample options value
 */
export const optionsListApi = (params?: selectParams) =>
  defaultRequest.get<DemoOptionsItem[]>({ url: Api.OPTIONS_LIST, params })
