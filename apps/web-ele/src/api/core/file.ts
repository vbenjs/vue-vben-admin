import { requestClient } from '#/api/request';

/**
 * 上传文件
 */
export async function uploadFile(data: FormData) {
  return requestClient.post('/file/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
