import type { RequestUploadFileOptions } from '@vben-admin/types'
import type { UploadApiResult } from '@vben-admin/types/model'

import { defHttp } from '/@/plugins/axios'
import { useGlobSetting } from '/@/hooks/setting'

const { uploadUrl = '' } = useGlobSetting()

/**
 * @description: Upload interface
 */
export function uploadApi(
  params: RequestUploadFileOptions,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: uploadUrl,
      onUploadProgress,
    },
    params,
  )
}
