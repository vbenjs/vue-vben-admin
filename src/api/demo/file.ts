import http from '@/utils/http/axios';
import { UploadResult, UploadParams } from './model/fileModel';
enum Api {
  DEMO_LIST = 'http://entropymine.com/jason/testbed/mime/oct2/file.txt',
  UploadFile = '/file/upload',
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

/**
 * @description: 上传
 */
export function uploadApi(params: UploadParams) {
  return http.request<UploadResult[]>({
    url: Api.UploadFile,
    method: 'GET',
    params,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
