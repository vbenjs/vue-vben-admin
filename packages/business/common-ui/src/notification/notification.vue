<script lang="ts" setup>
import {
  IcRoundMarkEmailRead,
  IcRoundNotificationsNone,
} from '@vben-core/iconify';
import {
  ScrollArea,
  VbenButton,
  VbenIconButton,
  VbenPopover,
} from '@vben-core/shadcn-ui';

import { $t } from '@vben/locales';
import { useToggle } from '@vueuse/core';

import type { NotificationItem } from './interface';

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
  viewAll: [];
}>();

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
  emit('read', item);
}
</script>
<template>
  <VbenPopover
    v-model:open="open"
    content-class="relative right-2 w-[360px] p-0"
  >
    <template #trigger>
      <div class="flex-center mr-2 h-full" @click.stop="toggle()">
        <VbenIconButton class="bell-button relative">
          <span
            v-if="dot"
            class="bg-primary absolute right-0.5 top-0.5 h-2 w-2 rounded"
          ></span>
          <IcRoundNotificationsNone class="size-5" />
        </VbenIconButton>
      </div>
    </template>

    <div class="relative">
      <div class="flex items-center justify-between border-b p-4 py-3">
        <div class="text-foreground">{{ $t('widgets.notifications') }}</div>
        <VbenIconButton
          :tooltip="$t('widgets.make-all-notify')"
          @click="handleMakeAll"
        >
          <IcRoundMarkEmailRead />
        </VbenIconButton>
      </div>
      <ScrollArea v-if="notifications.length > 0">
        <ul class="!flex max-h-[360px] w-full flex-col">
          <template v-for="item in notifications" :key="item.title">
            <li
              class="hover:bg-accent relative flex w-full cursor-pointer items-start gap-5 border-t px-3 py-3"
              @click="handleClick(item)"
            >
              <span
                v-if="!item.isRead"
                class="bg-primary absolute right-2 top-2 h-2 w-2 rounded"
              ></span>

              <span
                class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full"
              >
                <img
                  :src="item.avatar"
                  class="aspect-square h-full w-full object-cover"
                  role="img"
                />
              </span>
              <div class="flex flex-col gap-1 leading-none">
                <p class="font-semibold">{{ item.title }}</p>
                <p class="text-muted-foreground my-1 line-clamp-2 text-xs">
                  {{ item.message }}
                </p>
                <p class="text-muted-foreground line-clamp-2 text-xs">
                  {{ item.date }}
                </p>
              </div>
            </li>
          </template>
        </ul>
      </ScrollArea>

      <template v-else>
        <div class="flex-center text-muted-foreground min-h-[150px] w-full">
          {{ $t('common.not-data') }}
        </div>
      </template>

      <div class="flex items-center justify-between border-t px-4 py-3">
        <VbenButton size="sm" variant="ghost" @click="handleClear">
          {{ $t('widgets.clear-notifications') }}
        </VbenButton>
        <VbenButton size="sm" @click="handleViewAll">
          {{ $t('widgets.view-all') }}
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
