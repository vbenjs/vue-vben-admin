<script setup lang="ts">
import type { ActionItem } from './types';

import { computed, ref } from 'vue';

import { useSimpleLocale } from '@vben-core/composables';
import { cn } from '@vben-core/shared/utils';

import {
  DropdownMenuItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui';
import { VbenButton } from '../button';
import { VbenIcon } from '../icon';

const props = defineProps<{ action: ActionItem }>();
const emit = defineEmits<{ confirm: [] }>();
const { $t } = useSimpleLocale();
const open = ref(false);

const itemClass = computed(() =>
  cn(
    'cursor-pointer gap-2',
    props.action.danger && 'text-destructive focus:text-destructive',
  ),
);

/**
 * 阻止 reka-ui 事件的默认行为，用于：
 * - @select：阻止点击菜单项后自动关闭菜单，以便弹出气泡确认框；
 * - @open-auto-focus：阻止弹层抢占焦点（避免与菜单的焦点陷阱冲突）；
 * - @focus-outside：阻止因菜单夺回焦点而被误判为「焦点移出」从而关闭弹层。
 */
function preventDefault(event: Event) {
  event.preventDefault();
}

function onClick() {
  if (props.action.disabled) return;
  props.action.onClick?.();
}

function onConfirm() {
  open.value = false;
  const pc = props.action.popConfirm;
  if (pc?.confirm) {
    pc.confirm();
  } else {
    props.action.onClick?.();
  }
  // 确认后关闭整个下拉菜单
  emit('confirm');
}

function onCancel() {
  open.value = false;
}
</script>

<template>
  <!--
    气泡确认：菜单项同时作为 Popover 触发器。
    通过双重 as-child（DropdownMenuItem + PopoverTrigger 均合并到同一个叶子元素），
    使该元素既是菜单项又是弹层触发器；@select 阻止点击后菜单自动关闭。
  -->
  <Popover v-if="action.popConfirm" v-model:open="open">
    <PopoverTrigger as-child>
      <DropdownMenuItem
        as-child
        :class="itemClass"
        :disabled="action.disabled"
        @select="preventDefault"
      >
        <div>
          <VbenIcon v-if="action.icon" :icon="action.icon" class="size-4" />
          {{ action.text }}
        </div>
      </DropdownMenuItem>
    </PopoverTrigger>
    <PopoverContent
      class="z-popup w-60"
      side="left"
      @focus-outside="preventDefault"
      @open-auto-focus="preventDefault"
    >
      <div class="text-foreground mb-3 text-sm">
        {{ action.popConfirm.title ?? $t('confirmTitle') }}
      </div>
      <div class="flex justify-end gap-2">
        <VbenButton size="sm" variant="outline" @click="onCancel">
          {{ action.popConfirm.cancelText ?? $t('cancel') }}
        </VbenButton>
        <VbenButton
          :variant="action.danger ? 'destructive' : 'default'"
          size="sm"
          @click="onConfirm"
        >
          {{ action.popConfirm.okText ?? $t('confirm') }}
        </VbenButton>
      </div>
    </PopoverContent>
  </Popover>

  <!-- 普通下拉项 -->
  <DropdownMenuItem
    v-else
    :class="itemClass"
    :disabled="action.disabled"
    @click="onClick"
  >
    <VbenIcon v-if="action.icon" :icon="action.icon" class="size-4" />
    {{ action.text }}
  </DropdownMenuItem>
</template>
