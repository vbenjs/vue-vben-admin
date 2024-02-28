import { defHttp } from '../utils/http/axios';
import { HomeDataVo } from './model/homeModel';

enum Api {
  storeSummary = '/admin/home/storeSummary',
  daySummary = '/admin/home/daySummary',
  monthSummary = '/admin/home/monthSummary',
}

export const getStoreSummary = () =>
  defHttp.get<HomeDataVo>({
    url: Api.storeSummary,
  });

export const getDaySummary = () =>
  defHttp.get<HomeDataVo>({
    url: Api.daySummary,
  });

export const getMonthSummary = () =>
  defHttp.get<HomeDataVo>({
    url: Api.monthSummary,
  });
