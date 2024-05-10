import { BasicPaginationResult } from '../model/baseModel';
import { defHttp } from '/@/utils/http/axios';

export interface OnlineUserListItem {
  id: number;
  ip: string;
  username: string;
  isCurrent: true;
  time: string;
  os: string;
  browser: string;
  disable: boolean;
}

export type OnlineUserListResult = BasicPaginationResult<OnlineUserListItem>;

enum Api {
  List = '/system/online/list',
  Kick = '/system/online/kick',
}

export const getOnlineList = () => defHttp.get<OnlineUserListResult>({ url: Api.List });

export const kickUser = (data: { id: number }) => defHttp.post({ url: Api.Kick, data });
