import { defHttp } from '/@/utils/http/axios';

import type Code from './Code';
import type CodeRequest from './CodeRequest';
import type PreviewResponse from './PreviewResponse';

const domain = '/code';

export function codePreview(data: CodeRequest) {
  return defHttp.post<PreviewResponse>({ url: `${domain}/preview`, data });
}

export { Code, CodeRequest, PreviewResponse };
