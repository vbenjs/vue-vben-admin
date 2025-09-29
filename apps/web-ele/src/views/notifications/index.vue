<script lang="ts" setup>
import type { NotificationApi } from '#/api';

import { computed, onMounted, ref, watch } from 'vue';

import { useDebounceFn } from '@vueuse/core';
import dayjs from 'dayjs';
import {
  ElButton,
  ElCard,
  ElDrawer,
  ElEmpty,
  ElInput,
  ElLink,
  ElOption,
  ElPagination,
  ElSelect,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';
import { storeToRefs } from 'pinia';

import { $t } from '#/locales';
import { useNotificationStore } from '#/store';

const notificationStore = useNotificationStore();
const t = $t;

const detailDrawerVisible = ref(false);

const filters = notificationStore.filters;

const {
  currentNotification,
  filteredNotifications: tableData,
  isPolling,
  lastSyncedAt,
  loading,
  unreadCount,
} = storeToRefs(notificationStore);
const pagination = notificationStore.pagination;

const currentAttachments = computed(
  () => currentNotification.value?.attachments ?? [],
);

const hasAttachments = computed(() => currentAttachments.value.length > 0);

function attachmentHasSize(
  attachment: NotificationApi.NotificationAttachment,
): attachment is NotificationApi.NotificationAttachment & { size: string } {
  return typeof attachment.size === 'string' && attachment.size.length > 0;
}

const categoryOptions = computed(() => [
  {
    label: t('page.notifications.filter.category.all'),
    value: 'all',
  },
  {
    label: t('page.notifications.category.announcement'),
    value: 'announcement',
  },
  {
    label: t('page.notifications.category.task'),
    value: 'task',
  },
  {
    label: t('page.notifications.category.message'),
    value: 'message',
  },
]);

const statusOptions = computed(() => [
  {
    label: t('page.notifications.filter.status.all'),
    value: 'all',
  },
  {
    label: t('page.notifications.filter.status.unread'),
    value: 'unread',
  },
  {
    label: t('page.notifications.filter.status.read'),
    value: 'read',
  },
]);

const lastSyncedText = computed(() => {
  if (!lastSyncedAt.value) return t('page.notifications.meta.neverSynced');
  return dayjs(lastSyncedAt.value).format('YYYY-MM-DD HH:mm:ss');
});

onMounted(() => {
  if (tableData.value.length === 0) {
    void notificationStore.refreshNotifications();
  }
});

watch(currentNotification, (value) => {
  if (!value) {
    detailDrawerVisible.value = false;
  }
});

watch(
  () => [filters.category, filters.status],
  () => {
    notificationStore.setPage(1, { silent: true });
  },
);

const debouncedRefresh = useDebounceFn(() => {
  notificationStore.setPage(1, { silent: true });
}, 300);

watch(
  () => filters.search,
  () => {
    debouncedRefresh();
  },
);

function handleRowClick(row: { id: string; status: string }) {
  notificationStore.selectNotification(row.id);
  if (row.status === 'unread') {
    void notificationStore.markAsRead(row.id);
  }
  detailDrawerVisible.value = true;
}

function handleDrawerClose() {
  detailDrawerVisible.value = false;
  notificationStore.selectNotification(null);
}

async function handleTogglePolling() {
  if (isPolling.value) {
    notificationStore.stopPolling();
  } else {
    await notificationStore.startPolling();
  }
}

function handleRefresh() {
  void notificationStore.refreshNotifications();
}

function handlePageChange(page: number) {
  notificationStore.setPage(page);
}

function handlePageSizeChange(size: number) {
  notificationStore.setPageSize(size);
}

function handleMarkAsRead(id: string) {
  void notificationStore.markAsRead(id);
}

function handleMarkAsUnread(id: string) {
  void notificationStore.markAsUnread(id);
}

function handleRemove(id: string) {
  void notificationStore.removeNotification(id);
}

function handleMarkAll() {
  void notificationStore.markAllAsRead();
}

function handleClearAll() {
  void notificationStore.clearNotifications();
}
</script>

<template>
  <div class="notifications-page">
    <ElCard class="notifications-card" shadow="never">
      <template #header>
        <div class="notifications-card__header">
          <div>
            <h2 class="notifications-card__title">
              {{ t('page.notifications.center') }}
            </h2>
            <p class="notifications-card__subtitle">
              {{
                t('page.notifications.subtitle', {
                  count: unreadCount,
                })
              }}
            </p>
          </div>
          <div class="notifications-card__actions">
            <ElButton text type="primary" @click="handleTogglePolling">
              {{
                isPolling
                  ? t('page.notifications.actions.stopPolling')
                  : t('page.notifications.actions.startPolling')
              }}
            </ElButton>
            <ElButton text @click="handleRefresh">
              {{ t('page.notifications.actions.refresh') }}
            </ElButton>
            <ElButton
              text
              type="success"
              :disabled="!unreadCount"
              @click="handleMarkAll"
            >
              {{ t('page.notifications.actions.markAll') }}
            </ElButton>
            <ElButton
              text
              type="danger"
              :disabled="tableData.length === 0"
              @click="handleClearAll"
            >
              {{ t('page.notifications.actions.clear') }}
            </ElButton>
          </div>
        </div>
        <div class="notifications-card__filters">
          <ElSelect
            v-model="filters.category"
            class="notifications-card__filter"
            size="small"
          >
            <ElOption
              v-for="option in categoryOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
          <ElSelect
            v-model="filters.status"
            class="notifications-card__filter"
            size="small"
          >
            <ElOption
              v-for="option in statusOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
          <ElInput
            v-model="filters.search"
            :placeholder="t('page.notifications.filter.placeholder')"
            clearable
            size="small"
            class="notifications-card__search"
          />
        </div>
        <div class="notifications-card__meta">
          <span>
            {{ t('page.notifications.meta.lastSynced') }}：
            <strong>{{ lastSyncedText }}</strong>
          </span>
          <span>
            {{ t('page.notifications.meta.unread', { count: unreadCount }) }}
          </span>
        </div>
      </template>

      <template v-if="tableData.length > 0">
        <ElTable
          :data="tableData"
          row-key="id"
          height="520"
          stripe
          v-loading="loading"
          @row-click="handleRowClick"
        >
          <ElTableColumn
            :label="t('page.notifications.table.title')"
            min-width="240"
            prop="title"
          >
            <template #default="{ row }">
              <div class="notifications-table__title">
                <span class="notifications-table__title-text">
                  {{ row.title }}
                </span>
                <ElTag
                  v-if="row.status === 'unread'"
                  size="small"
                  type="danger"
                >
                  {{ t('page.notifications.badges.unread') }}
                </ElTag>
              </div>
              <div class="notifications-table__message">
                {{ row.message }}
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="t('page.notifications.table.category')"
            prop="category"
            width="140"
          >
            <template #default="{ row }">
              <ElTag size="small" effect="plain">
                {{ t(`page.notifications.category.${row.category}`) }}
              </ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn
            :label="t('page.notifications.table.date')"
            prop="date"
            width="180"
          />
          <ElTableColumn
            :label="t('page.notifications.table.actions')"
            width="220"
          >
            <template #default="{ row }">
              <ElButton link @click.stop="handleRowClick(row)">
                {{ t('page.notifications.actions.open') }}
              </ElButton>
              <ElButton
                v-if="row.status === 'unread'"
                link
                type="primary"
                @click.stop="handleMarkAsRead(row.id)"
              >
                {{ t('page.notifications.actions.markRead') }}
              </ElButton>
              <ElButton
                v-else
                link
                type="warning"
                @click.stop="handleMarkAsUnread(row.id)"
              >
                {{ t('page.notifications.actions.markUnread') }}
              </ElButton>
              <ElButton link type="danger" @click.stop="handleRemove(row.id)">
                {{ t('page.notifications.actions.remove') }}
              </ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
        <div class="notifications-card__pagination">
          <ElPagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="pagination.pageNum"
            :page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            @current-change="handlePageChange"
            @size-change="handlePageSizeChange"
          />
        </div>
      </template>
      <template v-else>
        <ElEmpty :description="t('page.notifications.empty')" />
      </template>
    </ElCard>

    <ElDrawer
      v-model="detailDrawerVisible"
      :title="currentNotification?.title ?? t('page.notifications.drawerTitle')"
      size="35%"
      @close="handleDrawerClose"
    >
      <template v-if="currentNotification">
        <div class="notification-detail">
          <div class="notification-detail__meta">
            <ElTag size="small" effect="plain">
              {{
                t(`page.notifications.category.${currentNotification.category}`)
              }}
            </ElTag>
            <span class="notification-detail__date">
              {{ currentNotification.date }}
            </span>
          </div>
          <p class="notification-detail__message">
            {{ currentNotification.previewText || currentNotification.message }}
          </p>
          <p
            v-if="currentNotification.content"
            class="notification-detail__content"
          >
            {{ currentNotification.content }}
          </p>
          <ElLink
            v-if="currentNotification.link"
            :href="currentNotification.link"
            class="notification-detail__link"
            target="_blank"
            rel="noopener noreferrer"
            type="primary"
          >
            {{ t('page.notifications.detail.link') }}
          </ElLink>
          <div v-if="hasAttachments" class="notification-detail__attachments">
            <h4>{{ t('page.notifications.detail.attachments') }}</h4>
            <ul>
              <li
                v-for="item in currentAttachments"
                :key="`${item.name ?? item.url}-${item.type ?? 'unknown'}`"
              >
                <ElLink
                  :href="item.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  type="primary"
                >
                  {{ item.name ?? item.url }}
                </ElLink>
                <span
                  v-if="attachmentHasSize(item)"
                  class="notification-detail__attachment-size"
                >
                  ({{ item.size }})
                </span>
              </li>
            </ul>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="notification-detail__empty">
          {{ t('page.notifications.emptySelection') }}
        </div>
      </template>
    </ElDrawer>
  </div>
</template>

<style scoped>
.notifications-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notifications-card__header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
}

.notifications-card__title {
  margin: 0;
  font-size: 18px;
}

.notifications-card__subtitle {
  margin: 4px 0 0;
  color: var(--el-text-color-secondary);
}

.notifications-card__pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.notifications-card__actions {
  display: flex;
  gap: 8px;
}

.notifications-card__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.notifications-card__filter {
  width: 180px;
}

.notifications-card__search {
  flex: 1;
  min-width: 200px;
}

.notifications-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
  color: var(--el-text-color-secondary);
}

.notifications-table__title {
  display: flex;
  gap: 10px;
  align-items: center;
}

.notifications-table__title-text {
  font-weight: 600;
}

.notifications-table__message {
  margin-top: 4px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.notification-detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-detail__meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.notification-detail__date {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.notification-detail__message {
  font-weight: 600;
}

.notification-detail__content {
  line-height: 1.6;
  color: var(--el-text-color-regular);
}

.notification-detail__link {
  width: fit-content;
}

.notification-detail__attachments {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.notification-detail__attachments h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.notification-detail__attachments ul {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.notification-detail__attachment-size {
  margin-left: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.notification-detail__empty {
  padding: 32px 0;
  color: var(--el-text-color-secondary);
  text-align: center;
}
</style>
