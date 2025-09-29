import { requestClient } from '#/api/request';

export namespace NotificationApi {
  export interface PageResult<T> {
    page?: number;
    size?: number;
    pageNum?: number;
    pageSize?: number;
    total: number;
    records: T[];
    list?: T[];
  }

  export interface QueryUserNotificationParams {
    userId: number;
    readStatus?: NotificationStatusCode;
    notifiType?: NotificationTypeCode;
    priority?: NotificationPriorityCode;
    pageNum?: number;
    pageSize?: number;
    page?: number;
    size?: number;
    keyword?: string;
    sortField?: NotificationSortField;
    sortOrder?: NotificationSortOrder;
  }

  export interface MarkNotificationReadRequest {
    userId: number;
    userNotifiId: number;
  }

  export interface MarkNotificationUnreadRequest {
    userId: number;
    userNotifiId: number;
  }

  export interface MarkNotificationReadAllRequest {
    userId: number;
    userNotifiIds?: number[];
  }

  export interface DeleteNotificationRequest {
    userId: number;
    userNotifiId: number;
  }

  export interface ClearNotificationRequest {
    userId: number;
  }

  export interface UnreadCountResponse {
    userId: number;
    unreadCount: number;
  }

  export interface NotificationAttachment {
    name: string;
    url: string;
    type: string;
    size?: string;
    extra?: string;
  }

  export interface UserNotificationRecord {
    userNotifiId: number;
    notifiId: number;
    userId: number;
    deliveryStatus: DeliveryStatusCode;
    deliveryTime: null | string;
    readStatus: NotificationStatusCode;
    readTime?: null | string;
    channelCode?: null | string;
    createdTime: string;
    updatedTime: string;
    title: string;
    content: string;
    notifiType: NotificationTypeCode;
    priority: NotificationPriorityCode;
    summary?: string;
    previewText?: string;
    avatar?: string;
    icon?: string;
    link?: string;
    attachments?: NotificationAttachment[];
  }

  export interface NotificationDetailParams {
    notifiId: number;
  }

  export interface NotificationDetail {
    notifiId: number;
    templateId: null | number;
    templateCode: null | string;
    templateTitle: null | string;
    templateContent: null | string;
    notifiType: NotificationTypeCode;
    priority: NotificationPriorityCode;
    targetType: TargetTypeCode;
    targetValue: null | string;
    extraData: null | string;
    sendTime: null | string;
    expireTime: null | string;
    statusCode: NotificationStatusCode;
    createdBy: null | number;
    createdTime: string;
    updatedBy: null | number;
    updatedTime: null | string;
    title: null | string;
    content: null | string;
    summary?: null | string;
    previewText?: null | string;
    avatar?: null | string;
    icon?: null | string;
    link?: null | string;
    attachments?: NotificationAttachment[];
  }

  export type NotificationTypeCode = '0' | '1' | '2';
  export type NotificationPriorityCode = '0' | '1' | '2';
  export type NotificationStatusCode = '0' | '1' | '2' | '3';
  export type TargetTypeCode = '0' | '1' | '2';
  export type DeliveryStatusCode = '0' | '1' | '2';
  export type EmptyResponse = null;
  export type NotificationSortField = 'createdTime' | 'priority' | 'readTime';
  export type NotificationSortOrder = 'ASC' | 'DESC';
}

export namespace NotificationTemplateApi {
  export type TemplateStatusCode = '0' | '1';

  export interface TemplateRecord {
    notifiTempId: number;
    templateCode: string;
    templateTitle: string;
    templateContent: string;
    notifiType?: NotificationApi.NotificationTypeCode;
    priority?: NotificationApi.NotificationPriorityCode;
    tempDesc?: string;
    templateStatus: TemplateStatusCode;
    createdBy?: number;
    createdTime?: string;
    updatedBy?: number;
    updatedTime?: string;
  }

  export interface CreateTemplateRequest {
    templateCode: string;
    templateTitle: string;
    templateContent: string;
    notifiType?: NotificationApi.NotificationTypeCode;
    priority?: NotificationApi.NotificationPriorityCode;
    tempDesc?: string;
    templateStatus: TemplateStatusCode;
  }

  export interface UpdateTemplateRequest {
    notifiTempId: number;
    templateTitle?: string;
    templateContent?: string;
    notifiType?: NotificationApi.NotificationTypeCode;
    priority?: NotificationApi.NotificationPriorityCode;
    tempDesc?: string;
    templateStatus?: TemplateStatusCode;
  }

  export interface DeleteTemplateRequest {
    notifiTempId: number;
  }

  export interface TemplateDetailParams {
    notifiTempId: number;
  }

  export interface TemplateListParams {
    templateCode?: string;
    templateStatus?: TemplateStatusCode;
    notifiType?: NotificationApi.NotificationTypeCode;
    priority?: NotificationApi.NotificationPriorityCode;
  }

  export interface TestSendRequest {
    templateId: number;
    userIds: number[];
    extraData?: Record<string, unknown>;
  }

  export interface NotificationAttachmentResponse {
    name: string;
    url: string;
    type: string;
    size?: string;
    extra?: string;
  }

  export interface NotificationResponse {
    notifiId: number;
    templateId: number;
    templateCode: string;
    templateTitle: string;
    templateContent: string;
    notifiType: string;
    priority: string;
    targetType: string;
    targetValue: string;
    extraData: string;
    summary: string;
    previewText: string;
    avatar: string;
    icon: string;
    link: string;
    attachments?: NotificationAttachmentResponse[];
    sendTime: string;
    expireTime: string;
    statusCode: string;
    createdBy: number;
    createdTime: string;
    updatedBy: number;
    updatedTime: string;
  }
}

export function queryUserNotificationsApi(
  params: NotificationApi.QueryUserNotificationParams,
) {
  return requestClient.get<
    NotificationApi.PageResult<NotificationApi.UserNotificationRecord>
  >('/notification/user-notification/list', {
    params,
  });
}

export function getUnreadCountApi(params: { userId: number }) {
  return requestClient.get<NotificationApi.UnreadCountResponse>(
    '/notification/user-notification/unread-count',
    {
      params,
    },
  );
}

export function markNotificationReadApi(
  data: NotificationApi.MarkNotificationReadRequest,
) {
  return requestClient.post<NotificationApi.EmptyResponse>(
    '/notification/user-notification/read',
    data,
  );
}

export function markNotificationUnreadApi(
  data: NotificationApi.MarkNotificationUnreadRequest,
) {
  return requestClient.post<NotificationApi.EmptyResponse>(
    '/notification/user-notification/unread',
    data,
  );
}

export function markNotificationReadAllApi(
  data: NotificationApi.MarkNotificationReadAllRequest,
) {
  return requestClient.post<NotificationApi.EmptyResponse>(
    '/notification/user-notification/read-all',
    data,
  );
}

export function deleteNotificationApi(
  data: NotificationApi.DeleteNotificationRequest,
) {
  return requestClient.delete<NotificationApi.EmptyResponse>(
    '/notification/user-notification/delete',
    {
      data,
    },
  );
}

export function clearNotificationsApi(
  data: NotificationApi.ClearNotificationRequest,
) {
  return requestClient.post<NotificationApi.EmptyResponse>(
    '/notification/user-notification/clear',
    data,
  );
}

export function getNotificationDetailApi(
  params: NotificationApi.NotificationDetailParams,
) {
  return requestClient.get<NotificationApi.NotificationDetail>(
    '/notification/notification/detail',
    {
      params,
    },
  );
}

export function listNotificationTemplatesApi(
  params?: NotificationTemplateApi.TemplateListParams,
) {
  return requestClient.get<NotificationTemplateApi.TemplateRecord[]>(
    '/notification/notification-template/list',
    {
      params,
    },
  );
}

export function createNotificationTemplateApi(
  data: NotificationTemplateApi.CreateTemplateRequest,
) {
  return requestClient.post<NotificationTemplateApi.TemplateRecord>(
    '/notification/notification-template/create',
    data,
  );
}

export function updateNotificationTemplateApi(
  data: NotificationTemplateApi.UpdateTemplateRequest,
) {
  return requestClient.put<NotificationTemplateApi.TemplateRecord>(
    '/notification/notification-template/update',
    data,
  );
}

export function deleteNotificationTemplateApi(
  data: NotificationTemplateApi.DeleteTemplateRequest,
) {
  return requestClient.post<NotificationApi.EmptyResponse>(
    '/notification/notification-template/delete',
    data,
  );
}

export function getNotificationTemplateDetailApi(
  params: NotificationTemplateApi.TemplateDetailParams,
) {
  return requestClient.get<NotificationTemplateApi.TemplateRecord>(
    '/notification/notification-template/detail',
    {
      params,
    },
  );
}

export function testSendNotificationTemplateApi(
  data: NotificationTemplateApi.TestSendRequest,
) {
  return requestClient.post<NotificationTemplateApi.NotificationResponse>(
    '/notification/notification/test-send',
    data,
  );
}
