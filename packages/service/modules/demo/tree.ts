import { defaultRequest } from '../../request'

enum Api {
  TREE_OPTIONS_LIST = '/tree/getDemoOptions',
}

/**
 * @description: Get sample options value
 */
export const treeOptionsListApi = (params?: Recordable) =>
  defaultRequest.get<Recordable[]>({ url: Api.TREE_OPTIONS_LIST, params })
