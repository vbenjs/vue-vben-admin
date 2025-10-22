import { requestClient } from '#/api/request';
import type { AssistantApi, AssistantConfig } from '@vben/types';

/**
 * 获取AI助手配置列表
 */
export async function getAssistantConfigsApi() {
  return requestClient.get<AssistantApi.GetAssistantsResult>('/ai-assistant/configs');
}

/**
 * 获取单个AI助手详情
 */
export async function getAssistantDetailApi(params: AssistantApi.GetAssistantParams) {
  return requestClient.get<AssistantConfig>(`/ai-assistant/configs/${params.id}`);
}

/**
 * 更新助手使用记录
 */
export async function updateAssistantUsageApi(params: AssistantApi.UpdateUsageParams) {
  return requestClient.post<void>(`/ai-assistant/usage/${params.id}`);
}

/**
 * 获取助手使用统计
 */
export async function getAssistantStatsApi() {
  return requestClient.get<Record<string, number>>('/ai-assistant/stats');
}