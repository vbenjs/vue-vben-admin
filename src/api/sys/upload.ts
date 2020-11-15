import { UploadApiResult } from './model/uploadModel';
import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams } from '/@/utils/http/axios/types';

enum Api {
  UPLOAD_URL = '/upload',
}

/**
 * @description: 上传接口
 */
export function uploadApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: Api.UPLOAD_URL,
      onUploadProgress,
    },
    params
  );
}
