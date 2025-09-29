import type { NotificationItem } from '@vben/layouts';

import type { NotificationApi } from '#/api';

import { computed, reactive, ref, watch } from 'vue';

import { useAppConfig } from '@vben/hooks';
import { useUserStore } from '@vben/stores';

import { useIntervalFn } from '@vueuse/core';
import dayjs from 'dayjs';
import { defineStore } from 'pinia';

import {
  clearNotificationsApi,
  deleteNotificationApi,
  getNotificationDetailApi,
  getUnreadCountApi,
  markNotificationReadAllApi,
  markNotificationReadApi,
  markNotificationUnreadApi,
  queryUserNotificationsApi,
} from '#/api';

const PREVIEW_LIMIT = 6;
const DEFAULT_PAGE_SIZE = 10;
// SSE 连续失败达到该次数后触发轮询兜底
const MAX_SSE_FAILURES_BEFORE_POLLING = 3;

type NotificationCategory = 'announcement' | 'message' | 'task';
type NotificationStatus = 'read' | 'unread';

type NotificationFilterCategory = 'all' | NotificationCategory;
type NotificationFilterStatus = 'all' | NotificationStatus;

interface NotificationRecord extends NotificationItem {
  id: string;
  userNotificationId: number;
  notificationId: number;
  category: NotificationCategory;
  createdAt: null | string;
  content: string;
  status: NotificationStatus;
  priorityCode: NotificationApi.NotificationPriorityCode;
  deliveryStatus: NotificationApi.DeliveryStatusCode;
  summary: string;
  previewText: string;
  link: null | string;
  icon: null | string;
  attachments: NotificationApi.NotificationAttachment[];
}

interface NotificationFilters {
  category: NotificationFilterCategory;
  status: NotificationFilterStatus;
  search: string;
}

interface RefreshOptions {
  silent?: boolean;
}

const CATEGORY_TO_TYPE_MAP: Record<
  NotificationCategory,
  NotificationApi.NotificationTypeCode
> = {
  announcement: '0',
  task: '1',
  message: '2',
};

const TYPE_TO_CATEGORY_MAP: Record<
  NotificationApi.NotificationTypeCode,
  NotificationCategory
> = {
  '0': 'announcement',
  '1': 'task',
  '2': 'message',
};

const STATUS_TO_CODE_MAP: Record<
  NotificationStatus,
  NotificationApi.NotificationStatusCode
> = {
  unread: '0',
  read: '1',
};

const CODE_TO_STATUS_MAP: Record<
  NotificationApi.NotificationStatusCode,
  NotificationStatus
> = {
  '0': 'unread',
  '1': 'read',
  '2': 'read',
  '3': 'unread',
};

function buildAvatar(category: NotificationCategory) {
  const code = category.slice(0, 2).toUpperCase();
  return `https://avatar.vercel.sh/notice.svg?text=${code}`;
}

function mapApiRecordToNotification(
  record: NotificationApi.UserNotificationRecord,
): NotificationRecord {
  const createdAt = record.deliveryTime ?? record.createdTime ?? null;
  const formattedDate = createdAt
    ? dayjs(createdAt).format('YYYY-MM-DD HH:mm')
    : '';
  const category = TYPE_TO_CATEGORY_MAP[record.notifiType] ?? 'announcement';
  const status = CODE_TO_STATUS_MAP[record.readStatus] ?? 'unread';
  const summary = record.summary ?? record.previewText ?? '';
  const previewText = record.previewText ?? record.summary ?? '';
  const content = record.content ?? '';
  const avatar = record.avatar ?? buildAvatar(category);

  return {
    id: String(record.userNotifiId),
    userNotificationId: record.userNotifiId,
    notificationId: record.notifiId,
    avatar,
    category,
    content,
    createdAt,
    date: formattedDate,
    isRead: status === 'read',
    message: summary || content,
    status,
    title: record.title ?? '',
    priorityCode: record.priority,
    deliveryStatus: record.deliveryStatus,
    summary: summary || content,
    previewText: previewText || content,
    link: record.link ?? null,
    icon: record.icon ?? null,
    attachments: record.attachments ?? [],
  };
}

async function ensureNotificationDetail(record: NotificationRecord) {
  if (!record.notificationId) return;
  try {
    const detail = await getNotificationDetailApi({
      notifiId: record.notificationId,
    });
    const content = detail.content ?? detail.templateContent ?? record.content;
    const summary = detail.summary ?? detail.previewText ?? record.summary;
    if (content) {
      record.content = content;
    }
    record.summary = summary ?? record.summary;
    record.previewText = detail.previewText ?? record.previewText;
    record.message = record.previewText || record.summary || record.content;
    record.link = detail.link ?? record.link;
    record.icon = detail.icon ?? record.icon;
    record.attachments = detail.attachments ?? record.attachments;
  } catch (error) {
    console.warn('Failed to load notification detail', error);
  }
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<NotificationRecord[]>([]);
  const loading = ref(false);
  const lastSyncedAt = ref<null | number>(null);
  const unreadCount = ref(0);
  const isSseConnected = ref(false);
  // 记录连续 SSE 失败次数以及是否已进入轮询兜底
  const sseFailureCount = ref(0);
  const isPollingFallback = ref(false);
  const sseSource = ref<EventSource | null>(null);
  const currentSseUserId = ref<null | string>(null);
  const sseListeners = ref<null | {
    error: (event: Event) => void;
    message: (event: MessageEvent) => void;
    notification: (event: MessageEvent) => void;
    open: (event: Event) => void;
  }>(null);

  let reconnectTimer: null | ReturnType<typeof setTimeout> = null;

  const filters = reactive<NotificationFilters>({
    category: 'all',
    status: 'all',
    search: '',
  });

  const selectedNotificationId = ref<null | string>(null);
  const pagination = reactive({
    pageNum: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });

  const userStore = useUserStore();
  const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);
  const isClient = typeof window !== 'undefined';
  const supportsSse = isClient && 'EventSource' in window;

  // 判断当前是否存在有效的登录用户
  function hasActiveUser() {
    return Boolean(userStore.userInfo?.userId);
  }

  function resolveSseEndpoint(): null | string {
    // 仅在浏览器环境下才能建立 SSE 连接；SSR 或其它非客户端场景无 window 对象，直接返回 null。
    if (!isClient) return null;

    // 去除构建时注入的 API 基础地址中的首尾空格。
    const base = (apiURL ?? '').trim();

    // 判断基础地址是否已经包含协议（例如 http:// 或 https://），用于决定后续拼接方式。
    const hasProtocol = /^https?:\/\//i.test(base);

    let normalizedBase: string;

    if (!base) {
      // 若未配置基础地址，则使用当前站点的 origin，保持 SSE 与页面同源。
      normalizedBase = window.location.origin;
    } else if (hasProtocol) {
      // 已经是完整的绝对地址，直接复用。
      normalizedBase = base;
    } else if (base.startsWith('/')) {
      // 以 / 开头说明是相对根路径（如 "/api"），补上当前 origin 拼成绝对地址。
      normalizedBase = `${window.location.origin}${base}`;
    } else {
      // 其余情况视为普通相对路径（如 "api"），在 origin 后加 / 连接。
      normalizedBase = `${window.location.origin}/${base}`;
    }

    // 去掉末尾多余的 /，再拼接 SSE 接口路径，避免出现双斜杠。
    return `${normalizedBase.replace(/\/$/, '')}/notification/notification-sse/connect`;
  }

  const sortedNotifications = computed(() =>
    [...notifications.value].sort(
      (a, b) =>
        dayjs(b.createdAt ?? 0).valueOf() - dayjs(a.createdAt ?? 0).valueOf(),
    ),
  );

  const hasUnread = computed(() => unreadCount.value > 0);

  const previewNotifications = computed<NotificationItem[]>(() =>
    sortedNotifications.value.slice(0, PREVIEW_LIMIT).map((item) => ({
      id: item.id,
      avatar: item.avatar,
      date: item.date,
      isRead: item.status === 'read',
      message: item.message,
      title: item.title,
    })),
  );

  const filteredNotifications = computed(() =>
    sortedNotifications.value.filter((item) => {
      const matchCategory =
        filters.category === 'all' || item.category === filters.category;
      const matchStatus =
        filters.status === 'all' || item.status === filters.status;
      const matchSearch =
        !filters.search ||
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.message.toLowerCase().includes(filters.search.toLowerCase());
      return matchCategory && matchStatus && matchSearch;
    }),
  );

  const currentNotification = computed(
    () =>
      sortedNotifications.value.find(
        (item) => item.id === selectedNotificationId.value,
      ) ?? null,
  );

  async function refreshNotifications(options: RefreshOptions = {}) {
    const userId = userStore.userInfo?.userId;
    if (!userId) return;

    if (!options.silent) {
      loading.value = true;
    }

    try {
      const params: NotificationApi.QueryUserNotificationParams = {
        userId,
        pageNum: pagination.pageNum,
        pageSize: pagination.pageSize,
      };

      if (filters.category !== 'all') {
        params.notifiType = CATEGORY_TO_TYPE_MAP[filters.category];
      }

      if (filters.status !== 'all') {
        params.readStatus = STATUS_TO_CODE_MAP[filters.status];
      }

      if (filters.search) {
        params.keyword = filters.search;
      }

      const [listResult, unreadResult] = await Promise.all([
        queryUserNotificationsApi(params),
        getUnreadCountApi({ userId }),
      ]);

      const records =
        listResult.records ??
        listResult.list ??
        ([] as NotificationApi.UserNotificationRecord[]);

      notifications.value = records.map((record) =>
        mapApiRecordToNotification(record),
      );
      pagination.total = listResult.total ?? notifications.value.length;
      if (typeof listResult.pageNum === 'number') {
        pagination.pageNum = listResult.pageNum;
      } else if (typeof listResult.page === 'number') {
        pagination.pageNum = listResult.page;
      }

      if (typeof listResult.pageSize === 'number') {
        pagination.pageSize = listResult.pageSize;
      }
      unreadCount.value = unreadResult.unreadCount ?? 0;
      lastSyncedAt.value = Date.now();
    } catch (error) {
      console.warn('Failed to refresh notifications', error);
    } finally {
      loading.value = false;
    }
  }

  function selectNotification(id: null | string) {
    selectedNotificationId.value = id;
    if (!id) return;

    const target = notifications.value.find((item) => item.id === id);
    if (target) {
      ensureNotificationDetail(target);
    }
  }

  async function markAsRead(id: string) {
    const userId = userStore.userInfo?.userId;
    if (!userId) return;

    const target = notifications.value.find((item) => item.id === id);
    const userNotificationId = target?.userNotificationId ?? Number(id);
    if (!userNotificationId) return;

    try {
      await markNotificationReadApi({
        userId,
        userNotifiId: userNotificationId,
      });
      if (target) {
        target.status = 'read';
        target.isRead = true;
      }
      unreadCount.value = Math.max(unreadCount.value - 1, 0);
    } catch (error) {
      console.warn('Failed to mark notification as read', error);
    }
  }

  async function markAllAsRead() {
    const userId = userStore.userInfo?.userId;
    if (!userId) return;

    const unreadItems = notifications.value.filter(
      (item) => item.status === 'unread',
    );
    if (unreadItems.length === 0) return;

    try {
      await markNotificationReadAllApi({
        userId,
        userNotifiIds: unreadItems.map((item) => item.userNotificationId),
      });
      notifications.value = notifications.value.map((item) => ({
        ...item,
        status: 'read',
        isRead: true,
      }));
      unreadCount.value = 0;
    } catch (error) {
      console.warn('Failed to mark notifications as read', error);
    } finally {
      await refreshNotifications({ silent: true });
    }
  }

  async function markAsUnread(id: string) {
    const userId = userStore.userInfo?.userId;
    if (!userId) return;

    const target = notifications.value.find((item) => item.id === id);
    const userNotificationId = target?.userNotificationId ?? Number(id);
    if (!userNotificationId) return;

    try {
      await markNotificationUnreadApi({
        userId,
        userNotifiId: userNotificationId,
      });
      if (target && target.status !== 'unread') {
        target.status = 'unread';
        target.isRead = false;
        unreadCount.value += 1;
      }
    } catch (error) {
      console.warn('Failed to mark notification as unread', error);
    }
  }

  async function clearNotifications() {
    const userId = userStore.userInfo?.userId;
    if (!userId) return;

    try {
      await clearNotificationsApi({ userId });
      notifications.value = [];
      unreadCount.value = 0;
      selectNotification(null);
      pagination.total = 0;
      pagination.pageNum = 1;
    } catch (error) {
      console.warn('Failed to clear notifications', error);
    }
  }

  async function removeNotification(id: string) {
    const userId = userStore.userInfo?.userId;
    if (!userId) return;

    const target = notifications.value.find((item) => item.id === id);
    const userNotificationId = target?.userNotificationId ?? Number(id);
    if (!userNotificationId) return;

    try {
      await deleteNotificationApi({
        userId,
        userNotifiId: userNotificationId,
      });
      notifications.value = notifications.value.filter(
        (item) => item.id !== id,
      );
      if (target?.status === 'unread') {
        unreadCount.value = Math.max(unreadCount.value - 1, 0);
      }
      pagination.total = Math.max(pagination.total - 1, 0);
      if (selectedNotificationId.value === id) {
        selectNotification(null);
      }
    } catch (error) {
      console.warn('Failed to remove notification', error);
    }
  }

  function recalcUnreadCount() {
    unreadCount.value = notifications.value.filter(
      (item) => item.status === 'unread',
    ).length;
  }

  function clearReconnectTimer() {
    if (!reconnectTimer) return;
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  function disconnectSse() {
    if (!supportsSse) return;
    clearReconnectTimer();
    currentSseUserId.value = null;
    if (sseSource.value) {
      if (sseListeners.value) {
        const { open, message, notification, error } = sseListeners.value;
        sseSource.value.removeEventListener('open', open);
        sseSource.value.removeEventListener('message', message);
        sseSource.value.removeEventListener('notification', notification);
        sseSource.value.removeEventListener('error', error);
        sseListeners.value = null;
      }
      sseSource.value.close();
      sseSource.value = null;
    }
    isSseConnected.value = false;
  }

  function scheduleReconnect() {
    if (!supportsSse || reconnectTimer || !hasActiveUser()) return;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      connectSse();
    }, 5000);
  }

  if (isClient) {
    watch(
      () => userStore.userInfo?.userId,
      // 用户 ID 发生变化时重建 SSE，并清理旧的连接状态
      (userId) => {
        if (!supportsSse) return;
        if (userId) {
          sseFailureCount.value = 0;
          connectSse();
        } else {
          disconnectSse();
          stopPolling();
          sseFailureCount.value = 0;
        }
      },
      { immediate: true },
    );
  }

  function upsertNotification(record: NotificationRecord) {
    const index = notifications.value.findIndex(
      (item) => item.id === record.id,
    );
    if (index === -1) {
      notifications.value = [record, ...notifications.value];
      pagination.total += 1;
    } else {
      notifications.value.splice(index, 1, {
        ...notifications.value[index],
        ...record,
      });
    }
    recalcUnreadCount();
    lastSyncedAt.value = Date.now();
  }

  function isNotificationRecordPayload(
    value: unknown,
  ): value is NotificationApi.UserNotificationRecord {
    return (
      !!value &&
      typeof value === 'object' &&
      'userNotifiId' in value &&
      'notifiId' in value
    );
  }

  function extractNotificationPayload(
    payload: unknown,
  ): NotificationApi.UserNotificationRecord[] {
    if (!payload) return [];
    if (Array.isArray(payload)) {
      return payload.filter((item) => isNotificationRecordPayload(item));
    }
    if (isNotificationRecordPayload(payload)) {
      return [payload];
    }
    if (typeof payload === 'object') {
      const container = payload as Record<string, unknown>;
      const maybeData = container.data ?? container.records;
      if (Array.isArray(maybeData)) {
        return maybeData.filter((item) => isNotificationRecordPayload(item));
      }
      if (isNotificationRecordPayload(maybeData)) {
        return [maybeData];
      }
      const maybeNotification = container.notification ?? container.record;
      if (isNotificationRecordPayload(maybeNotification)) {
        return [maybeNotification];
      }
    }
    return [];
  }

  function handleSseMessage(eventData: string) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(eventData);
    } catch {
      // keepalive or invalid payload
      return;
    }

    if (parsed && typeof parsed === 'object') {
      const maybeUnread = (parsed as Record<string, unknown>).unreadCount;
      if (typeof maybeUnread === 'number') {
        unreadCount.value = maybeUnread;
      }
    }

    const records = extractNotificationPayload(parsed);
    if (records.length === 0) {
      return;
    }

    for (const record of records) {
      const mapped = mapApiRecordToNotification(record);
      upsertNotification(mapped);
    }
  }

  function connectSse() {
    if (!supportsSse) return;
    const userId = userStore.userInfo?.userId;
    if (!userId) return;
    const connectionKey = String(userId);

    clearReconnectTimer();

    if (sseSource.value) {
      if (currentSseUserId.value === connectionKey) {
        return;
      }
      disconnectSse();
    }

    try {
      const endpoint = resolveSseEndpoint();
      if (!endpoint) return;
      const url = new URL(endpoint);
      const source = new EventSource(url.toString(), {
        withCredentials: true,
      });
      currentSseUserId.value = connectionKey;
      sseSource.value = source;

      // 连接成功后重置失败计数，并在需要时停止兜底轮询
      const handleOpen = () => {
        isSseConnected.value = true;
        sseFailureCount.value = 0;
        if (isPollingFallback.value) {
          stopPolling();
        }
      };

      const handleMessage = (event: MessageEvent) => {
        if (typeof event.data !== 'string') return;
        handleSseMessage(event.data);
      };

      const handleNotification = (event: MessageEvent) => {
        if (typeof event.data !== 'string') return;
        handleSseMessage(event.data);
      };

      // 任意错误都先关闭 SSE，再根据失败计数决定是否启用轮询兜底
      const handleError = (event: Event) => {
        console.warn('Notification SSE encountered an error', event);
        isSseConnected.value = false;
        sseFailureCount.value = Math.min(
          sseFailureCount.value + 1,
          MAX_SSE_FAILURES_BEFORE_POLLING,
        );

        disconnectSse();

        if (!hasActiveUser()) {
          return;
        }

        if (
          sseFailureCount.value >= MAX_SSE_FAILURES_BEFORE_POLLING &&
          !isActive.value &&
          !isPollingFallback.value
        ) {
          isPollingFallback.value = true;
          void startPolling({ silent: true });
        }

        scheduleReconnect();
      };

      source.addEventListener('open', handleOpen);
      source.addEventListener('message', handleMessage);
      source.addEventListener('notification', handleNotification);
      source.addEventListener('error', handleError);
      sseListeners.value = {
        error: handleError,
        message: handleMessage,
        notification: handleNotification,
        open: handleOpen,
      };
    } catch (error) {
      console.warn('Failed to establish notification SSE connection', error);
      scheduleReconnect();
    }
  }

  function setFilter<K extends keyof NotificationFilters>(
    key: K,
    value: NotificationFilters[K],
  ) {
    filters[key] = value;
  }

  function resetFilters() {
    filters.category = 'all';
    filters.status = 'all';
    filters.search = '';
  }

  const {
    pause: pausePolling,
    resume: resumePolling,
    isActive,
  } = useIntervalFn(
    async () => {
      await refreshNotifications({ silent: true });
    },
    60_000,
    { immediate: false },
  );

  // 启动轮询时先做一次刷新，确保数据同步
  async function startPolling(options: RefreshOptions = {}) {
    await refreshNotifications(options);
    if (!hasActiveUser()) {
      return;
    }
    resumePolling();
  }

  // 停止轮询时同步清空兜底标记
  function stopPolling() {
    pausePolling();
    isPollingFallback.value = false;
  }

  function setPage(pageNum: number, options: RefreshOptions = {}) {
    if (!Number.isInteger(pageNum) || pageNum < 1) return;
    const samePage = pagination.pageNum === pageNum;
    pagination.pageNum = pageNum;
    if (samePage) {
      void refreshNotifications(options);
      return;
    }
    void refreshNotifications(options);
  }

  function setPageSize(pageSize: number, options: RefreshOptions = {}) {
    if (!Number.isInteger(pageSize) || pageSize < 1) return;
    const sameSize = pagination.pageSize === pageSize;
    pagination.pageSize = pageSize;
    pagination.pageNum = 1;
    if (sameSize) {
      void refreshNotifications(options);
      return;
    }
    void refreshNotifications(options);
  }

  function resetPagination() {
    pagination.pageNum = 1;
    pagination.pageSize = DEFAULT_PAGE_SIZE;
  }

  // 退出登录等场景需要同步重置所有状态，避免残留连接或计数
  function $reset() {
    stopPolling();
    disconnectSse();
    clearReconnectTimer();
    notifications.value = [];
    loading.value = false;
    lastSyncedAt.value = null;
    unreadCount.value = 0;
    isSseConnected.value = false;
    sseFailureCount.value = 0;
    isPollingFallback.value = false;
    sseSource.value = null;
    currentSseUserId.value = null;
    sseListeners.value = null;
    selectedNotificationId.value = null;
    filters.category = 'all';
    filters.status = 'all';
    filters.search = '';
    pagination.pageNum = 1;
    pagination.pageSize = DEFAULT_PAGE_SIZE;
    pagination.total = 0;
  }

  return {
    clearNotifications,
    connectSse,
    currentNotification,
    filteredNotifications,
    filters,
    hasUnread,
    isSseConnected,
    isPollingFallback,
    isPolling: isActive,
    lastSyncedAt,
    loading,
    markAllAsRead,
    markAsRead,
    markAsUnread,
    previewNotifications,
    pagination,
    refreshNotifications,
    removeNotification,
    disconnectSse,
    resetFilters,
    resetPagination,
    selectNotification,
    setFilter,
    setPage,
    setPageSize,
    startPolling,
    stopPolling,
    sseFailureCount,
    unreadCount,
    $reset,
  };
});
