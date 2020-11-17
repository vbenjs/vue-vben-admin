import { defHttp } from '/@/utils/http/axios';

enum Api {
  // The address does not exist
  Error = '/error',
}

/**
 * @description: Trigger ajax error
 */
export function fireErrorApi() {
  return defHttp.request({
    url: Api.Error,
    method: 'GET',
  });
}
