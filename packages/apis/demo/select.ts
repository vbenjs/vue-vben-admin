import { request } from '@pkg/request'

export interface DemoOptionsItem {
  label: string
  value: string
}

export interface SelectParams {
  id: number | string
}

enum Api {
  OPTIONS_LIST = '/select/getDemoOptions',
}

/**
 * @description: Get sample options value
 */
export const optionsListApi = (params?: SelectParams) =>
  request.get<DemoOptionsItem[]>({ url: Api.OPTIONS_LIST, params })
