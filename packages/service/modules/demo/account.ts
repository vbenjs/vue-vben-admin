import type { GetAccountInfoModel } from '../model'

import { defaultRequest } from '../../request'

enum Api {
  ACCOUNT_INFO = '/account/getAccountInfo',
  SESSION_TIMEOUT = '/user/sessionTimeout',
  TOKEN_EXPIRED = '/user/tokenExpired',
}

// Get personal center-basic settings

export const accountInfoApi = () =>
  defaultRequest.get<GetAccountInfoModel>({ url: Api.ACCOUNT_INFO })

export const sessionTimeoutApi = () =>
  defaultRequest.post<void>({ url: Api.SESSION_TIMEOUT })

export const tokenExpiredApi = () =>
  defaultRequest.post<void>({ url: Api.TOKEN_EXPIRED })
