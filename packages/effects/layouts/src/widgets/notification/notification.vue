<script lang="ts" setup>
import type { NotificationItem } from './types';

import { useRouter } from 'vue-router';

import { Bell, CircleCheckBig, CircleX, MailCheck } from '@vben/icons';
import { $t } from '@vben/locales';

import {
  VbenButton,
  VbenIconButton,
  VbenPopover,
  VbenScrollbar,
} from '@vben-core/shadcn-ui';

import { useToggle } from '@vueuse/core';

interface Props {
  /**
   * 显示圆点
   */
  dot?: boolean;
  /**
   * 消息列表
   */
  notifications?: NotificationItem[];
}

defineOptions({ name: 'NotificationPopup' });

withDefaults(defineProps<Props>(), {
  dot: false,
  notifications: () => [],
});

const emit = defineEmits<{
  clear: [];
  makeAll: [];
  read: [NotificationItem];
  remove: [NotificationItem];
  viewAll: [];
}>();

const router = useRouter();
const [open, toggle] = useToggle();

function close() {
  open.value = false;
}

function handleViewAll() {
  emit('viewAll');
  close();
}

function handleMakeAll() {
  emit('makeAll');
}

function handleClear() {
  emit('clear');
}

function handleClick(item: NotificationItem) {
  // 如果通知项有链接，点击时跳转
  if (item.link) {
    navigateTo(item.link, item.query, item.state);
  }
}

function navigateTo(
  link: string,
  query?: Record<string, any>,
  state?: Record<string, any>,
) {
  if (link.startsWith('http://') || link.startsWith('https://')) {
    // 外部链接，在新标签页打开
    window.open(link, '_blank');
  } else {
    // 内部路由链接，支持 query 参数和 state
    router.push({
      path: link,
      query: query || {},
      state,
    });
  }
}
</script>
<template>
  <VbenPopover
    v-model:open="open"
    content-class="relative right-2 w-[360px] p-0"
  >
    <template #trigger>
      <div class="mr-2 flex-center h-full" @click.stop="toggle()">
        <VbenIconButton class="bell-button relative text-foreground">
          <span
            v-if="dot"
            class="absolute top-0.5 right-0.5 size-2 rounded-sm bg-primary"
          ></span>
          <Bell class="size-4" />
        </VbenIconButton>
      </div>
    </template>

    <div class="relative">
      <div class="flex items-center justify-between p-4 py-3">
        <div class="text-foreground">{{ $t('ui.widgets.notifications') }}</div>
        <VbenIconButton
          :disabled="notifications.length <= 0"
          :tooltip="$t('ui.widgets.markAllAsRead')"
          @click="handleMakeAll"
        >
          <MailCheck class="size-4" />
        </VbenIconButton>
      </div>
      <VbenScrollbar v-if="notifications.length > 0">
        <ul class="flex! max-h-[360px] w-full flex-col">
          <template v-for="item in notifications" :key="item.id ?? item.title">
            <li
              class="relative flex w-full cursor-pointer items-start gap-5 border-t border-border p-3 hover:bg-accent"
              @click="handleClick(item)"
            >
              <span
                v-if="!item.isRead"
                class="absolute top-2 right-2 size-2 rounded-sm bg-primary"
              ></span>

              <span
                class="relative flex size-10 shrink-0 overflow-hidden rounded-full"
              >
                <img
                  :src="item.avatar"
                  class="aspect-square size-full object-cover"
                />
              </span>
              <div class="flex flex-col gap-1 leading-none">
                <p class="font-semibold">{{ item.title }}</p>
                <p class="my-1 line-clamp-2 text-xs text-muted-foreground">
                  {{ item.message }}
                </p>
                <p class="line-clamp-2 text-xs text-muted-foreground">
                  {{ item.date }}
                </p>
              </div>
              <div
                class="absolute top-1/2 right-3 flex -translate-y-1/2 flex-col gap-2"
              >
                <VbenIconButton
                  v-if="!item.isRead"
                  size="xs"
                  variant="ghost"
                  class="h-6 px-2"
                  :tooltip="$t('common.confirm')"
                  @click.stop="emit('read', item)"
                >
                  <CircleCheckBig class="size-4" />
                </VbenIconButton>
                <VbenIconButton
                  v-if="item.isRead"
                  size="xs"
                  variant="ghost"
                  class="h-6 px-2 text-destructive"
                  :tooltip="$t('common.delete')"
                  @click.stop="emit('remove', item)"
                >
                  <CircleX class="size-4" />
                </VbenIconButton>
              </div>
            </li>
          </template>
        </ul>
      </VbenScrollbar>

      <template v-else>
        <div class="flex-center min-h-[150px] w-full text-muted-foreground">
          {{ $t('common.noData') }}
        </div>
      </template>

      <div
        class="flex items-center justify-between border-t border-border px-4 py-3"
      >
        <VbenButton
          :disabled="notifications.length <= 0"
          size="sm"
          variant="ghost"
          @click="handleClear"
        >
          {{ $t('ui.widgets.clearNotifications') }}
        </VbenButton>
        <VbenButton size="sm" @click="handleViewAll">
          {{ $t('ui.widgets.viewAll') }}
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
