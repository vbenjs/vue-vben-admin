import http from '@/utils/http/axios';

enum Api {
  // 该地址不存在
  Error = '/error',
}

/**
 * @description: 触发ajax错误
 */
export function fireErrorApi() {
  return http.request({
    url: Api.Error,
    method: 'GET',
  });
}
