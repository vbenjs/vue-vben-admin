<script setup lang="ts">
import type { AnyFunction } from '@vben/types';

import type { Component } from 'vue';
import { computed, ref } from 'vue';

import { $t } from '@vben/locales';
import { IcRoundLogout, IcRoundSettingsSuggest } from '@vben-core/iconify';
import { preferences } from '@vben-core/preferences';
import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  VbenAlertDialog,
  VbenAvatar,
  VbenIcon,
} from '@vben-core/shadcn-ui';
import { isWindowsOs } from '@vben-core/toolkit';

import { useMagicKeys, whenever } from '@vueuse/core';

import { useOpenPreferences } from '../preferences/use-open-preferences';

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
   * 是否启用快捷键
   */
  enableShortcutKey?: boolean;
  /**
   * 菜单数组
   */
  menus?: Array<{ handler: AnyFunction; icon?: Component; text: string }>;

  /**
   * 标签文本
   */
  tagText?: string;
  /**
   * 文本
   */
  text?: string;
}

defineOptions({
  name: 'UserDropdown',
});

const props = withDefaults(defineProps<Props>(), {
  avatar: '',
  description: '',
  enableShortcutKey: true,
  menus: () => [],
  showShortcutKey: true,
  tagText: '',
  text: '',
});

const emit = defineEmits<{ logout: [] }>();
const openPopover = ref(false);
const openDialog = ref(false);

const { handleOpenPreference } = useOpenPreferences();

const altView = computed(() => (isWindowsOs() ? 'Alt' : '⌥'));

const shortcutKeys = computed(() => {
  return props.enableShortcutKey && preferences.shortcutKeys.enable;
});

function handleLogout() {
  // emit
  openDialog.value = true;
  openPopover.value = false;
}

function handleSubmitLogout() {
  emit('logout');
  openDialog.value = false;
}

if (shortcutKeys.value) {
  const keys = useMagicKeys();
  whenever(keys['Alt+KeyQ'], () => {
    if (shortcutKeys.value) {
      handleLogout();
    }
  });

  whenever(keys['Alt+Comma'], () => {
    if (shortcutKeys.value) {
      handleOpenPreference();
    }
  });
}
</script>

<template>
  <VbenAlertDialog
    v-model:open="openDialog"
    :content="$t('widgets.logout-tip')"
    :title="$t('common.prompt')"
    :cancel-text="$t('common.cancel')"
    :submit-text="$t('common.confirm')"
    @submit="handleSubmitLogout"
  />

  <DropdownMenu>
    <DropdownMenuTrigger>
      <div class="hover:bg-accent ml-1 mr-2 cursor-pointer rounded-full p-1.5">
        <div class="hover:text-accent-foreground flex-center">
          <VbenAvatar :alt="text" :src="avatar" class="size-8" dot />
          <!-- <div v-if="text" class="ml-2 text-sm">{{ text }}</div> -->
        </div>
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="mr-2 min-w-[240px] p-0 pb-1">
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
            class="text-foreground mb-1 flex items-center text-sm font-medium"
          >
            {{ text }}
            <Badge class="ml-2 text-green-400">
              {{ tagText }}
            </Badge>
          </div>
          <div class="text-muted-foreground text-xs font-normal">
            {{ description }}
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        v-for="menu in menus"
        :key="menu.text"
        class="lineh mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
        @click="menu.handler"
      >
        <VbenIcon :icon="menu.icon" class="mr-2 size-5" />
        {{ menu.text }}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        v-if="preferences.shortcutKeys.enable"
        class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
        @click="handleOpenPreference"
      >
        <IcRoundSettingsSuggest class="mr-2 size-5" />
        {{ $t('preference.preferences') }}
        <DropdownMenuShortcut v-if="shortcutKeys">
          {{ altView }} ,
        </DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
        @click="handleLogout"
      >
        <IcRoundLogout class="mr-2 size-5" />
        {{ $t('common.logout') }}
        <DropdownMenuShortcut v-if="shortcutKeys">
          {{ altView }} Q
        </DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
