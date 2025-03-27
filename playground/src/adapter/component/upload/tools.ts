import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface';

import { requestClient } from '#/api/request';

const UPLOAD_URL = '/api/upload';

/**
 * 获取文件base64
 * @param file 文件
 * @returns 文件base64
 */
export function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => resolve(reader.result));
    reader.addEventListener('error', (error) => reject(error));
  });
}

/**
 * 上传文件
 * @param options 上传选项
 * @returns 上传结果
 */
export function customRequest(options: UploadRequestOption<any>) {
  const controller = new AbortController();
  (async function requestWrap() {
    const { file, onError, onProgress, onSuccess } = options;
    if (!file) {
      return;
    }

    // 上传文件
    requestClient
      .upload(
        UPLOAD_URL,
        { file: file as File },
        {
          onUploadProgress(progressEvent) {
            let percent = 0;
            if (progressEvent?.total && progressEvent?.total > 0) {
              // 0 ~ 1
              percent = progressEvent.loaded / progressEvent.total;
            }
            onProgress?.({
              percent: percent * 100,
            });
          },
        },
      )
      .then((res) => {
        onSuccess?.(res);
      })
      .catch((error) => {
        onError?.(error);
      });
  })();
  return {
    abort() {
      controller.abort();
    },
  };
}
