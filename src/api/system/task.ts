import { BasicPageParams, BasicPaginationResult } from '../model/baseModel';
import { defHttp } from '/@/utils/http/axios';

export interface Task {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  service: string;
  type: number;
  status: number;
  startTime: any;
  endTime: any;
  limit: number;
  cron: string;
  every: number;
  data: string;
  jobOpts: string;
  remark: string;
}

export interface TaskLog {
  id: number;
  createdAt: string;
  updatedAt: string;
  status: number;
  detail: string;
  consumeTime: number;
  task: Task;
}

export interface SysTaskParam {
  name: string;
  service: string;
  type: number;
  status: number;
  startTime: string;
  endTime: string;
  limit: number;
  cron: string;
  every: number;
  data: string;
  remark: string;
}

/** 获取任务详情返回结果 */
export interface SysTaskInfo {
  createdAt: string;
  updatedAt: string;
  id: number;
  name: string;
  service: string;
  type: number;
  status: number;
  startTime: string;
  endTime: string;
  limit: number;
  cron: string;
  every: number;
  data: string;
  jobOpts: string;
  remark: string;
}

enum Api {
  Base = '/system/tasks',
}

export const getTaskList = (params?: BasicPageParams) =>
  defHttp.get<BasicPaginationResult<Task>>({ url: Api.Base, params });

export const getTaskInfo = (id: number) => defHttp.get<SysTaskInfo>({ url: `${Api.Base}/${id}` });

export const taskAdd = (params?: SysTaskParam) =>
  defHttp.post({ url: Api.Base, params }, { successMessageMode: 'message' });

export const taskUpdate = (id: number, params?: SysTaskParam) =>
  defHttp.put({ url: `${Api.Base}/${id}`, params }, { successMessageMode: 'message' });

export const taskDelete = (id: number) => defHttp.delete({ url: `${Api.Base}/${id}` });

export const taskOnce = (id: number) =>
  defHttp.put({ url: `${Api.Base}/${id}/once` }, { successMessageMode: 'message' });

export const taskStart = (id: number) =>
  defHttp.put({ url: `${Api.Base}/${id}/start` }, { successMessageMode: 'message' });

export const taskStop = (id: number) =>
  defHttp.put({ url: `${Api.Base}/${id}/stop` }, { successMessageMode: 'message' });
