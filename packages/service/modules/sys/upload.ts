import type { RequestUploadFileOptions } from '@admin/types'
import type { UploadApiResult } from '../model'

import { defaultRequest } from '../../request'
import { context } from '../../_bridge'

/**
 * @description: Upload interface
 */
export function uploadApi(
  params: RequestUploadFileOptions,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defaultRequest.uploadFile<UploadApiResult>(
    {
      url: context.uploadUrl,
      onUploadProgress,
    },
    params,
  )
}
