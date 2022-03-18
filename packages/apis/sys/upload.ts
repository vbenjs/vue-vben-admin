import type { RequestUploadFileOptions } from '@pkg/types'
import { request } from '@pkg/request'

export interface UploadApiResult {
  message: string
  code: number
  url: string
}

/**
 * @description: Upload interface
 */
export function uploadApi(
  params: RequestUploadFileOptions,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return request.uploadFile<UploadApiResult>(
    {
      // TODO
      // url: context.uploadUrl,
      onUploadProgress,
    },
    params,
  )
}
