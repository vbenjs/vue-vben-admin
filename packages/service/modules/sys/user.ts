import type { ErrorMessageMode } from '@admin/types'
import type { LoginParams, LoginResultModel, GetUserInfoModel } from '../model'

import { defaultRequest } from '../../request'

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/getUserInfo',
  GetPermCode = '/getPermCode',
}

/**
 * @description: user login api
 */
export function loginApi(
  params: LoginParams,
  mode: ErrorMessageMode = 'modal',
) {
  return defaultRequest.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  )
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defaultRequest.get<GetUserInfoModel>(
    { url: Api.GetUserInfo },
    { errorMessageMode: 'none' },
  )
}

export function getPermCode() {
  return defaultRequest.get<string[]>({ url: Api.GetPermCode })
}

export function doLogout() {
  return defaultRequest.get({ url: Api.Logout })
}
