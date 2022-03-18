import { request } from '@pkg/request'

export interface GetAccountInfoModel {
  email: string
  name: string
  introduction: string
  phone: string
  address: string
}

enum Api {
  ACCOUNT_INFO = '/account/getAccountInfo',
  SESSION_TIMEOUT = '/user/sessionTimeout',
  TOKEN_EXPIRED = '/user/tokenExpired',
}

// Get personal center-basic settings

export const accountInfoApi = () =>
  request.get<GetAccountInfoModel>({ url: Api.ACCOUNT_INFO })

export const sessionTimeoutApi = () =>
  request.post<void>({ url: Api.SESSION_TIMEOUT })

export const tokenExpiredApi = () =>
  request.post<void>({ url: Api.TOKEN_EXPIRED })
