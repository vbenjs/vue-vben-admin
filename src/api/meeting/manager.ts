import qs from 'qs';
import { BasicFetchResult } from '../model/baseModel';
import { MeetingManagerItem } from './model/managerModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Manager = '/api/v1/meeting/managers',
}

/**
 * @description: 会议列表
 */
export function getMeetingManager(params?: any) {
  return defHttp.get<BasicFetchResult<MeetingManagerItem>>({
    url: Api.Manager,
    paramsSerializer: () => qs.stringify(params),
  });
}

/**
 * @description: 会议详细信息
 */
export function showMeetingManager(id: string | number) {
  return defHttp.get<MeetingManagerItem>({
    url: Api.Manager + '/' + id,
  });
}

/**
 * @description: 更新会议信息
 */
export function patchMeetingManager(id: string | number, params: any) {
  return defHttp.patch({
    url: Api.Manager + '/' + id,
    params,
  });
}

/**
 * @description: 删除一条会议信息
 */
export function deleteMeetingManager(id: string | number) {
  return defHttp.delete({
    url: Api.Manager + '/' + id,
  });
}

/**
 * @description: 添加一条会议信息
 */
export function postMeetingManager(params: any) {
  return defHttp.post({
    url: Api.Manager,
    params,
  });
}
