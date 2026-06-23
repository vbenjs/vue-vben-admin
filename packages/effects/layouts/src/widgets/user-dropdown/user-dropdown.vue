<script setup lang="ts">
import type { Component } from 'vue';

import type { AnyFunction } from '@vben/types';

import { useTemplateRef, watch } from 'vue';

import { useHoverToggle } from '@vben/hooks';
import { Settings } from '@vben/icons';
import { $t } from '@vben/locales';
import { usePreferences } from '@vben/preferences';

import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  VbenAvatar,
  VbenIcon,
} from '@vben-core/shadcn-ui';

import { Preferences } from '../preferences';

interface Props {
  /**
   * 头像
   */
  avatar?: string;
  /**
   * @zh_CN 描述
   */
  description?: string;
  /**
   * 菜单数组
   */
  menus?: Array<{
    handler: AnyFunction;
    icon?: Component | Function | string;
    text: string;
  }>;

  /**
   * 标签文本
   */
  tagText?: string;
  /**
   * 文本
   */
  text?: string;
  /** 触发方式 */
  trigger?: 'both' | 'click' | 'hover';
  /** hover触发时，延迟响应的时间 */
  hoverDelay?: number;
}

defineOptions({
  name: 'UserDropdown',
});

const props = withDefaults(defineProps<Props>(), {
  avatar: '',
  description: '',
  menus: () => [],
  tagText: '',
  text: '',
  trigger: 'click',
  hoverDelay: 500,
});

const emit = defineEmits<{ clearPreferencesAndLogout: [] }>();

const { preferencesButtonPosition } = usePreferences();

const refTrigger = useTemplateRef('refTrigger');
const refContent = useTemplateRef('refContent');
const refPreferences = useTemplateRef('refPreferences');
const [openPopover, hoverWatcher] = useHoverToggle(
  [refTrigger, refContent],
  () => props.hoverDelay,
);

watch(
  () => props.trigger === 'hover' || props.trigger === 'both',
  (val) => {
    if (val) {
      hoverWatcher.enable();
    } else {
      hoverWatcher.disable();
    }
  },
  {
    immediate: true,
  },
);

// 设置 - 打开偏好设置抽屉
function handleOpenSettings() {
  refPreferences.value?.open();
}
</script>

<template>
  <Preferences
    v-if="preferencesButtonPosition.userDropdown"
    ref="refPreferences"
    :show-button="false"
    @clear-preferences-and-logout="emit('clearPreferencesAndLogout')"
  />

  <DropdownMenu v-model:open="openPopover" :modal="false">
    <DropdownMenuTrigger ref="refTrigger" :disabled="props.trigger === 'hover'">
      <div class="mr-2 ml-1 cursor-pointer rounded-full p-1.5 hover:bg-accent">
        <div class="flex-center hover:text-accent-foreground">
          <VbenAvatar :alt="text" :src="avatar" class="size-8" dot />
        </div>
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="mr-2 min-w-60 p-0 pb-1">
      <div ref="refContent">
        <DropdownMenuLabel class="flex items-center p-3">
          <VbenAvatar
            :alt="text"
            :src="avatar"
            class="size-12"
            dot
            dot-class="bottom-0 right-1 border-2 size-4 bg-green-500"
          />
          <div class="ml-2 w-full">
            <div
              v-if="tagText || text || $slots.tagText"
              class="mb-1 flex items-center text-sm font-medium text-foreground"
            >
              {{ text }}
              <slot name="tagText">
                <Badge
                  v-if="tagText"
                  variant="secondary"
                  class="ml-2 text-green-400"
                >
                  {{ tagText }}
                </Badge>
              </slot>
            </div>
            <div class="text-xs font-normal text-muted-foreground">
              {{ description }}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator v-if="menus?.length" />
        <DropdownMenuItem
          v-for="menu in menus"
          :key="menu.text"
          class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
          @click="menu.handler"
        >
          <VbenIcon :icon="menu.icon" class="mr-2 size-4" />
          {{ menu.text }}
        </DropdownMenuItem>
        <DropdownMenuSeparator v-if="preferencesButtonPosition.userDropdown" />
        <DropdownMenuItem
          v-if="preferencesButtonPosition.userDropdown"
          class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
          @click="handleOpenSettings"
        >
          <Settings class="mr-2 size-4" />
          {{ $t('preferences.title') }}
        </DropdownMenuItem>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
