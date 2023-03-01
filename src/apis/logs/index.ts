import { defHttp } from '/@/utils/http/axios';

import type SearchParameters from '../SearchParameters';
import type PageResult from '../PageResult';
import type LogEntity from './LogEntity';

const domain = '/logs';

export function listLogs(params: SearchParameters) {
  return defHttp.get<PageResult<LogEntity>>({ url: domain, params }, { joinParamsToUrl: true });
}
