import { defHttp } from '/@/utils/http/axios';

const { get } = defHttp;

enum Api {
  // The address does not exist
  Error = '/error',
}

/**
 * @description: Trigger ajax error
 */

export const fireErrorApi = () => get({ url: Api.Error });
