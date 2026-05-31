<script setup lang="ts">
import type { ActionItem } from './types';

import { computed, ref } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { Popover, PopoverContent, PopoverTrigger } from '../../ui';
import { VbenButton } from '../button';
import { VbenIcon } from '../icon';

const props = defineProps<{ action: ActionItem }>();

const open = ref(false);

const buttonClass = computed(() =>
  cn(
    'gap-1',
    props.action.danger && 'text-destructive hover:text-destructive',
    props.action.class,
  ),
);

const variant = computed(() => props.action.variant ?? 'link');
const size = computed(() => props.action.size ?? 'default');

function onClick() {
  if (props.action.disabled || props.action.loading) return;
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
}

function onCancel() {
  open.value = false;
}
</script>

<template>
  <!-- 气泡确认 -->
  <Popover v-if="action.popConfirm" v-model:open="open">
    <PopoverTrigger as-child>
      <VbenButton
        :class="buttonClass"
        :disabled="action.disabled"
        :loading="action.loading"
        :size="size"
        class="p-2"
        :variant="variant"
      >
        <VbenIcon :icon="action.icon" v-if="action.icon" class="size-4" />
        <span v-if="action.text">{{ action.text }}</span>
      </VbenButton>
    </PopoverTrigger>
    <PopoverContent class="z-popup w-60" side="top">
      <div class="text-foreground mb-3 text-sm">
        {{ action.popConfirm.title ?? 'Are you sure?' }}
      </div>
      <div class="flex justify-end gap-2">
        <VbenButton size="default" variant="outline" @click="onCancel">
          {{ action.popConfirm.cancelText ?? 'Cancel' }}
        </VbenButton>
        <VbenButton
          :variant="action.danger ? 'destructive' : 'default'"
          size="default"
          class="p-2"
          @click="onConfirm"
        >
          {{ action.popConfirm.okText ?? 'OK' }}
        </VbenButton>
      </div>
    </PopoverContent>
  </Popover>

  <!-- 普通按钮 -->
  <VbenButton
    v-else
    :class="buttonClass"
    :disabled="action.disabled"
    :loading="action.loading"
    :size="size"
    class="p-2"
    :variant="variant"
    @click="onClick"
  >
    <VbenIcon :icon="action.icon" v-if="action.icon" class="size-4" />
    <span v-if="action.text">{{ action.text }}</span>
  </VbenButton>
</template>
