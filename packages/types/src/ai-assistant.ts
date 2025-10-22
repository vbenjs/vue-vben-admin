/**
 * AI助手相关类型定义
 */

export type AssistantType = 'document' | 'video' | 'financial' | 'technical' | 'legal';

export interface AssistantSettings {
  /** 最大文件大小（字节） */
  maxFileSize: number;
  /** 允许的文件类型 */
  allowedFileTypes: string[];
  /** 最大对话长度 */
  maxConversationLength: number;
  /** 是否启用质量控制 */
  enableQualityControl: boolean;
  /** 是否启用反馈 */
  enableFeedback: boolean;
}

export interface AssistantConfig {
  /** 助手ID */
  id: string;
  /** 助手类型 */
  type: AssistantType;
  /** 助手名称 */
  name: string;
  /** 助手描述 */
  description: string;
  /** 助手图标 */
  icon: string;
  /** Dify URL */
  difyUrl: string;
  /** 权限要求 */
  permissions: string[];
  /** 是否启用 */
  enabled: boolean;
  /** 使用次数 */
  usageCount: number;
  /** 最后使用时间 */
  lastUsed: Date;
  /** 助手设置 */
  settings: AssistantSettings;
}

export namespace AssistantApi {
  /** 获取助手配置列表的返回值 */
  export interface GetAssistantsResult {
    assistants: AssistantConfig[];
    total: number;
  }

  /** 获取单个助手详情的参数 */
  export interface GetAssistantParams {
    id: string;
  }

  /** 更新助手使用记录的参数 */
  export interface UpdateUsageParams {
    id: string;
  }
}