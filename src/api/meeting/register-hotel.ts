import qs from 'qs';
import { BasicFetchResult } from '../model/baseModel';
import type { MeetingRegisterItem } from './model/registerModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  index = '/api/v1/meeting/register_hotels',
}

/**
 * @description: 列表
 */
export function getMeetingRegisterHotel(params: any) {
  return defHttp.get<BasicFetchResult<MeetingRegisterItem[]>>({
    url: Api.index,
    paramsSerializer: () => qs.stringify(params),
  });
}

/**
 * @description: 详细信息
 */
export function showMeetingRegisterHotel(id: string) {
  return defHttp.get<MeetingRegisterItem>({
    url: Api.index + '/' + id,
  });
}

/**
 * @description: 更新
 */
export function patchMeetingRegisterHotel(id: string | number, params: any) {
  return defHttp.patch({
    url: Api.index + '/' + id,
    params,
  });
}

/**
 * @description: 删除
 */
export function deleteMeetingRegisterHotel(id: string | number) {
  return defHttp.delete({
    url: Api.index + '/' + id,
  });
}

/**
 * @description: 添加
 */
export function postMeetingRegisterHotel(params: any) {
  return defHttp.post({
    url: Api.index,
    params,
  });
}
