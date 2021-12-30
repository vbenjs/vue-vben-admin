import type { RequestUploadFileOptions } from '@vben-admin/types'
import type { UploadApiResult } from '@vben-admin/types/model'

import { defaultRequest } from '/@/plugins/request'
import { useGlobSetting } from '/@/hooks/setting'

const { uploadUrl = '' } = useGlobSetting()

/**
 * @description: Upload interface
 */
export function uploadApi(
  params: RequestUploadFileOptions,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defaultRequest.uploadFile<UploadApiResult>(
    {
      url: uploadUrl,
      onUploadProgress,
    },
    params,
  )
}
