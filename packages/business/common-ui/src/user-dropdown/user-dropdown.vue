<script setup lang="ts">
import { IcRoundLogout } from '@vben-core/iconify';
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
import { AnyFunction } from '@vben-core/typings';

import type { Component } from 'vue';

import { $t } from '@vben/locales';
import { ref } from 'vue';

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
    <DropdownMenuContent class="mr-2 min-w-[240px] p-0">
      <DropdownMenuLabel class="border-border flex items-center border-b p-3">
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
        class="mx-1 rounded-sm py-2.5"
        @click="menu.handler"
      >
        <VbenIcon :icon="menu.icon" class="mr-2 size-4" />
        {{ menu.text }}
      </DropdownMenuItem>

      <DropdownMenuSeparator />
      <DropdownMenuItem class="w-full p-0">
        <div
          class="border-border flex-center hover:bg-accent hover:text-accent-foreground h-10 w-full cursor-pointer border-t"
          @click="handleLogout"
        >
          <IcRoundLogout class="mr-2" />
          {{ $t('common.logout') }}
        </div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
