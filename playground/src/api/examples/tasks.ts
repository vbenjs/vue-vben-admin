import { requestClient } from '#/api/requestv2';

export namespace TaskPageApi {
  export interface PageFetchParams {
    [key: string]: any;
    page: number;
    page_size: number;
  }
}

/**
 * 获取示例表格数据
 */
async function getTaskList(params: TaskPageApi.PageFetchParams) {
  return requestClient.post('/tasks/search', { params });
}

export { getTaskList };
