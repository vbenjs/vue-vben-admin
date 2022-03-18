import { request } from '@pkg/request'

enum Api {
  // The address does not exist
  Error = '/error',
}

/**
 * @description: Trigger ajax error
 */

export const fireErrorApi = () => request.get({ url: Api.Error })
