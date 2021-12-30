import { defaultRequest } from '/@/plugins/request'

enum Api {
  // The address does not exist
  Error = '/error',
}

/**
 * @description: Trigger ajax error
 */

export const fireErrorApi = () => defaultRequest.get({ url: Api.Error })
