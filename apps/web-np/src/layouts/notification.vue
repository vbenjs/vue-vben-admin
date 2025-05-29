<script lang="ts" setup>
import type { INotification } from '#/store';

import { computed, onMounted, reactive } from 'vue';

import {
  VbenButton,
  VbenIconButton,
  VbenPopover,
  VbenScrollbar,
} from '@vben/common-ui';
import { Bell } from '@vben/icons';
import { $t } from '@vben/locales';

import { useToggle } from '@vueuse/core';
import { Modal } from 'ant-design-vue';
import dayjs from 'dayjs';

import {
  clearAllNotification,
  getNotificationList,
  makeAlltNotificationAsRead,
} from '#/api';
import { useShopStore } from '#/store';

const [open, toggle] = useToggle();
const shopStore = useShopStore();

const state = reactive({
  clearLoading: false,
  markAllAsReadLoading: false,
  notificationList: [] as INotification[],
});

onMounted(() => {
  loadData();

  shopStore.pusherChannel.bind(
    shopStore.pusherEventName,
    (payload: INotification) => {
      if (payload.reloadNotification) {
        loadData();
      }
    },
  );
});

const showDot = computed(() =>
  state.notificationList.some((item) => !item.readAt),
);

const loadData = () => {
  getNotificationList().then((res) => {
    state.notificationList = res;
  });
};

function handleMakeAll() {
  state.markAllAsReadLoading = true;
  makeAlltNotificationAsRead().then(() => {
    state.markAllAsReadLoading = false;
    loadData();
  });
}

function handleClear() {
  Modal.confirm({
    title: `Clear Notifications`,
    content:
      "Once you clear all notifications, you can't recover them. Are you sure you want to continue?",
    okText: 'Yes',
    cancelText: 'No',
    onOk: async () => {
      state.clearLoading = true;

      clearAllNotification().then(() => {
        state.clearLoading = false;
        state.notificationList = [];
      });
    },
  });
}

const getFileName = (item: INotification) => {
  const fileName = item.urlName ?? item.url ?? '';

  if (fileName.length <= 33) {
    return fileName;
  }

  // Try to get the start and last 10 chars of the file name
  return `${fileName.slice(0, 15)}...${fileName.slice(-18)}`;
};
</script>
<template>
  <VbenPopover
    v-model:open="open"
    content-class="relative right-2 w-[360px] p-0"
  >
    <template #trigger>
      <div class="flex-center mr-1 h-full" @click.stop="toggle()">
        <VbenIconButton class="bell-button text-foreground relative">
          <span
            v-if="showDot"
            class="bg-primary absolute right-0.5 top-0.5 h-2 w-2 rounded"
          ></span>
          <Bell class="size-4" />
        </VbenIconButton>
      </div>
    </template>

    <div class="relative">
      <div class="flex items-center justify-between p-4 py-3">
        <div class="text-foreground">{{ $t('ui.widgets.notifications') }}</div>
      </div>
      <VbenScrollbar v-if="state.notificationList.length > 0">
        <ul class="!flex max-h-[360px] w-full flex-col">
          <template v-for="item in state.notificationList" :key="item.title">
            <li
              class="hover:bg-accent border-border relative flex w-full items-start gap-5 border-t px-3 py-3"
            >
              <span
                v-if="!item.readAt"
                class="bg-primary absolute right-2 top-2 h-2 w-2 rounded"
              ></span>

              <div class="flex flex-col gap-1 leading-none">
                <p class="text-sm font-semibold">{{ item.title }}</p>
                <p class="text-muted-foreground my-1 line-clamp-2 text-xs">
                  {{ item.message }}
                </p>
                <p
                  class="text-muted-foreground my-1 line-clamp-2 text-xs"
                  v-if="item.url && item.urlType === 'file'"
                >
                  Download:
                  <a
                    :href="item.url"
                    class="text-blue-600 underline hover:text-blue-800"
                  >
                    {{ getFileName(item) }}
                  </a>
                </p>
                <p class="text-muted-foreground line-clamp-2 text-xs">
                  {{ dayjs(item.createdAt) }}
                </p>
              </div>
            </li>
          </template>
        </ul>
      </VbenScrollbar>

      <template v-else>
        <div class="flex-center text-muted-foreground min-h-[150px] w-full">
          {{ $t('common.noData') }}
        </div>
      </template>

      <div
        class="border-border flex items-center justify-between border-t px-4 py-3"
      >
        <VbenButton
          :loading="state.clearLoading"
          :disabled="state.notificationList.length <= 0"
          size="sm"
          variant="ghost"
          @click="handleClear"
        >
          {{ $t('ui.widgets.clearNotifications') }}
        </VbenButton>

        <VbenButton
          :loading="state.markAllAsReadLoading"
          :disabled="!showDot"
          size="sm"
          @click="handleMakeAll"
        >
          {{ $t('ui.widgets.markAllAsRead') }}
        </VbenButton>
      </div>
    </div>
  </VbenPopover>
</template>

<style scoped>
:deep(.bell-button) {
  &:hover {
    svg {
      animation: bell-ring 1s both;
    }
  }
}

@keyframes bell-ring {
  0%,
  100% {
    transform-origin: top;
  }

  15% {
    transform: rotateZ(10deg);
  }

  30% {
    transform: rotateZ(-10deg);
  }

  45% {
    transform: rotateZ(5deg);
  }

  60% {
    transform: rotateZ(-5deg);
  }

  75% {
    transform: rotateZ(2deg);
  }
}
</style>
