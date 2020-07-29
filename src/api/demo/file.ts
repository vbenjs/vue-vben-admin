import http from '@/utils/http/axios';

enum Api {
  DEMO_LIST = 'http://entropymine.com/jason/testbed/mime/oct2/file.txt',
}

/**
 * @description: 跨域，请求不通过
 */
export function downloadApi() {
  return http.request(
    {
      url: Api.DEMO_LIST,
      method: 'GET',
    },
    { apiUrl: '', joinPrefix: false }
  );
}
