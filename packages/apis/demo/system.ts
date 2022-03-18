import type { BasicPageParams, BasicFetchResult } from '../types'
import { request } from '@pkg/request'

export type AccountParams = BasicPageParams & {
  account?: string
  nickname?: string
}

export type RoleParams = {
  roleName?: string
  status?: string
}

export type RolePageParams = BasicPageParams & RoleParams

export type DeptParams = {
  deptName?: string
  status?: string
}

export type MenuParams = {
  menuName?: string
  status?: string
}

export interface AccountListItem {
  id: string
  account: string
  email: string
  nickname: string
  role: number
  createTime: string
  remark: string
  status: number
}

export interface DeptListItem {
  id: string
  orderNo: string
  createTime: string
  remark: string
  status: number
}

export interface MenuListItem {
  id: string
  orderNo: string
  createTime: string
  status: number
  icon: string
  component: string
  permission: string
}

export interface RoleListItem {
  id: string
  roleName: string
  roleValue: string
  status: number
  orderNo: string
  createTime: string
}

/**
 * @description: Request list return value
 */
export type AccountListGetResultModel = BasicFetchResult<AccountListItem>

export type DeptListGetResultModel = BasicFetchResult<DeptListItem>

export type MenuListGetResultModel = BasicFetchResult<MenuListItem>

export type RolePageListGetResultModel = BasicFetchResult<RoleListItem>

export type RoleListGetResultModel = RoleListItem[]

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
  request.get<AccountListGetResultModel>({
    url: Api.AccountList,
    params,
  })

export const getDeptList = (params?: DeptListItem) =>
  request.get<DeptListGetResultModel>({ url: Api.DeptList, params })

export const getSysMenuList = (params?: MenuParams) =>
  request.get<MenuListGetResultModel>({ url: Api.MenuList, params })

export const getRoleListByPage = (params?: RolePageParams) =>
  request.get<RolePageListGetResultModel>({
    url: Api.RolePageList,
    params,
  })

export const getAllRoleList = (params?: RoleParams) =>
  request.get<RoleListGetResultModel>({
    url: Api.GetAllRoleList,
    params,
  })

export const setRoleStatus = (id: number, status: string) =>
  request.post({ url: Api.setRoleStatus, params: { id, status } })

export const isAccountExist = (account: string) =>
  request.post(
    { url: Api.IsAccountExist, params: { account } },
    { errorMessageMode: 'none' },
  )
