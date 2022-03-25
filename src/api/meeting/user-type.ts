import qs from 'qs';
import type { MeetingUserType } from './model/userTypeModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  UserType = '/api/v1/meeting/user_types',
}

/**
 * @description: 列表
 */
export function getMeetingUserType(params?: any) {
  return defHttp.get<MeetingUserType[]>({
    url: Api.UserType,
    paramsSerializer: () => qs.stringify(params),
  });
}

/**
 * @description: 详细信息
 */
export function showMeetingUserType(id: string) {
  return defHttp.get<MeetingUserType>({
    url: Api.UserType + '/' + id,
  });
}

/**
 * @description: 更新
 */
export function patchMeetingUserType(id: string | number, params: any) {
  return defHttp.patch({
    url: Api.UserType + '/' + id,
    params,
  });
}

/**
 * @description: 删除
 */
export function deleteMeetingUserType(id: string | number) {
  return defHttp.delete({
    url: Api.UserType + '/' + id,
  });
}

/**
 * @description: 添加
 */
export function postMeetingUserType(params: any) {
  return defHttp.post({
    url: Api.UserType,
    params,
  });
}
