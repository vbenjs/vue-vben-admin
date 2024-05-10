import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams } from '/#/axios';
import { useGlobSetting } from '/@/hooks/setting';

export interface UploadApiResult {
  message: string;
  code: number;
  url: string;
}

export const { uploadUrl = '' } = useGlobSetting();

/**
 * @description: Upload interface
 */
export function uploadApi(
  params: UploadFileParams,
  // onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: uploadUrl,
      // onUploadProgress,
    },
    params,
  );
}
