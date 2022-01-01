import type {
  AccountParams,
  DeptListItem,
  MenuParams,
  RoleParams,
  RolePageParams,
  MenuListGetResultModel,
  DeptListGetResultModel,
  AccountListGetResultModel,
  RolePageListGetResultModel,
  RoleListGetResultModel,
} from '../model'
import { defaultRequest } from '../../request'

enum Api {
  AccountList = '/system/getAccountList',
  IsAccountExist = '/system/accountExist',
  DeptList = '/system/getDeptList',
  setRoleStatus = '/system/setRoleStatus',
  MenuList = '/system/getMenuList',
  RolePageList = '/system/getRoleListByPage',
  GetAllRoleList = '/system/getAllRoleList',
}

export const getAccountList = (params: AccountParams) =>
  defaultRequest.get<AccountListGetResultModel>({
    url: Api.AccountList,
    params,
  })

export const getDeptList = (params?: DeptListItem) =>
  defaultRequest.get<DeptListGetResultModel>({ url: Api.DeptList, params })

export const getMenuList = (params?: MenuParams) =>
  defaultRequest.get<MenuListGetResultModel>({ url: Api.MenuList, params })

export const getRoleListByPage = (params?: RolePageParams) =>
  defaultRequest.get<RolePageListGetResultModel>({
    url: Api.RolePageList,
    params,
  })

export const getAllRoleList = (params?: RoleParams) =>
  defaultRequest.get<RoleListGetResultModel>({
    url: Api.GetAllRoleList,
    params,
  })

export const setRoleStatus = (id: number, status: string) =>
  defaultRequest.post({ url: Api.setRoleStatus, params: { id, status } })

export const isAccountExist = (account: string) =>
  defaultRequest.post(
    { url: Api.IsAccountExist, params: { account } },
    { errorMessageMode: 'none' },
  )
