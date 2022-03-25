import qs from 'qs';
import type { BasicFetchResult } from '../model/baseModel';
import type { MeetingHotelItem } from './model/hotelModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  Hotel = '/api/v1/meeting/hotels',
}

/**
 * @description: 酒店列表
 */
export function getMeetingHotel(params?: any) {
  return defHttp.get<BasicFetchResult<MeetingHotelItem>>({
    url: Api.Hotel,
    paramsSerializer: () => qs.stringify(params),
  });
}

/**
 * @description: 酒店详细信息
 */
export function showMeetingHotel(id: string) {
  return defHttp.get<MeetingHotelItem>({
    url: Api.Hotel + '/' + id,
  });
}

/**
 * @description: 更新酒店信息
 */
export function patchMeetingHotel(id: string, params: any) {
  return defHttp.patch({
    url: Api.Hotel + '/' + id,
    params,
  });
}

/**
 * @description: 删除一个酒店
 */
export function deleteMeetingHotel(id: string | number) {
  return defHttp.delete({
    url: Api.Hotel + '/' + id,
  });
}

/**
 * @description: 添加一个酒店
 */
export function postMeetingHotel(params: any) {
  return defHttp.post({
    url: Api.Hotel,
    params,
  });
}
