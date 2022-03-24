import qs from 'qs';
import { BasicFetchResult } from '../model/baseModel';
import type { MeetingRegisterItem } from './model/registerModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Register = '/admin/v1/meeting/registers',
}

/**
 * @description: 列表
 */
export function getMeetingRegister(params: any) {
  return defHttp.get<BasicFetchResult<MeetingRegisterItem[]>>({
    url: Api.Register,
    paramsSerializer: () => qs.stringify(params),
  });
}

/**
 * @description: 详细信息
 */
export function showMeetingRegister(id: string) {
  return defHttp.get<MeetingRegisterItem>({
    url: Api.Register + '/' + id,
  });
}

/**
 * @description: 更新
 */
export function patchMeetingRegister(id: string | number, params: any) {
  return defHttp.patch({
    url: Api.Register + '/' + id,
    params,
  });
}

/**
 * @description: 删除
 */
export function deleteMeetingRegister(id: string | number) {
  return defHttp.delete({
    url: Api.Register + '/' + id,
  });
}

/**
 * @description: 添加
 */
export function postMeetingRegister(params: any) {
  return defHttp.post({
    url: Api.Register,
    params,
  });
}
