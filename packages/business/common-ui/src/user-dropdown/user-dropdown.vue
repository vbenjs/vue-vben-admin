<script setup lang="ts">
import type { AnyFunction } from '@vben/types';

import { IcRoundLogout, IcRoundSettingsSuggest } from '@vben-core/iconify';
import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  VbenAlertDialog,
  VbenAvatar,
  VbenIcon,
} from '@vben-core/shadcn-ui';

import type { Component } from 'vue';

import { $t } from '@vben/locales';
import { preference } from '@vben/preference';
import { ref } from 'vue';

import { useOpenPreference } from '../preference/use-open-preference';

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

withDefaults(defineProps<Props>(), {
  avatar: '',
  description: '',
  menus: () => [],
  tagText: '',
  text: '',
});

const emit = defineEmits<{ logout: [] }>();
const openPopover = ref(false);
const openDialog = ref(false);

const { handleOpenPreference } = useOpenPreference();

function handleLogout() {
  // emit
  openDialog.value = true;
  openPopover.value = false;
}

function handleSubmitLogout() {
  emit('logout');
  openDialog.value = false;
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
        v-if="preference"
        class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
        @click="handleOpenPreference"
      >
        <IcRoundSettingsSuggest class="mr-2 size-5" />
        {{ $t('preference.preferences') }}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        class="mx-1 flex cursor-pointer items-center rounded-sm py-1 leading-8"
        @click="handleLogout"
      >
        <IcRoundLogout class="mr-2 size-5" />
        {{ $t('common.logout') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
