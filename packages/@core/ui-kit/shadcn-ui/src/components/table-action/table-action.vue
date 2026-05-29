<script setup lang="ts">
import type { ActionItem, TableActionProps } from './types';

import { computed } from 'vue';

import { Ellipsis, IconifyIcon } from '@vben-core/icons';
import { cn } from '@vben-core/shared/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
} from '../../ui';
import { VbenButton } from '../button';
import { VbenTooltip } from '../tooltip';
import ActionItemComp from './action-item.vue';

defineOptions({ name: 'VbenTableAction' });

const props = withDefaults(defineProps<TableActionProps>(), {
  actions: () => [],
  align: 'end',
  class: undefined,
  divider: false,
  dropdownActions: () => [],
  hasPermission: undefined,
  moreText: undefined,
});

function checkVisible(item: ActionItem): boolean {
  // 权限
  if (item.auth && props.hasPermission && !props.hasPermission(item.auth)) {
    return false;
  }
  // ifShow
  if (typeof item.ifShow === 'boolean') return item.ifShow;
  if (typeof item.ifShow === 'function') return item.ifShow();
  return true;
}

const visibleActions = computed(() =>
  (props.actions ?? []).filter((item) => checkVisible(item)),
);
const visibleDropdownActions = computed(() =>
  (props.dropdownActions ?? []).filter((item) => checkVisible(item)),
);

const alignClass = computed(
  () =>
    ({ center: 'justify-center', end: 'justify-end', start: 'justify-start' })[
      props.align
    ],
);

function tooltipSide(action: ActionItem) {
  return typeof action.tooltip === 'object'
    ? (action.tooltip.side ?? 'top')
    : 'top';
}
function tooltipContent(action: ActionItem) {
  return typeof action.tooltip === 'object'
    ? action.tooltip.content
    : action.tooltip;
}

function onDropdownClick(item: ActionItem) {
  if (item.disabled) return;
  item.onClick?.();
}
</script>

<template>
  <div :class="cn('flex items-center gap-1', alignClass, props.class)">
    <template
      v-for="(action, index) in visibleActions"
      :key="action.key ?? index"
    >
      <VbenTooltip
        v-if="action.tooltip && !action.popConfirm"
        :side="tooltipSide(action)"
      >
        <template #trigger>
          <ActionItemComp :action="action" />
        </template>
        {{ tooltipContent(action) }}
      </VbenTooltip>
      <ActionItemComp v-else :action="action" />

      <Separator
        v-if="divider && index < visibleActions.length - 1"
        orientation="vertical"
        class="h-4"
      />
    </template>

    <DropdownMenu v-if="visibleDropdownActions.length > 0">
      <DropdownMenuTrigger as-child>
        <VbenButton class="gap-1 p-2" variant="link">
          <Ellipsis class="size-4" />
          <span v-if="moreText">{{ moreText }}</span>
        </VbenButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <template
          v-for="(item, index) in visibleDropdownActions"
          :key="item.key ?? index"
        >
          <DropdownMenuItem
            :class="
              cn(
                'cursor-pointer gap-2',
                item.danger && 'text-destructive focus:text-destructive',
              )
            "
            :disabled="item.disabled"
            @click="onDropdownClick(item)"
          >
            <IconifyIcon :icon="item.icon" v-if="item.icon" class="size-4" />
            {{ item.text }}
          </DropdownMenuItem>
          <DropdownMenuSeparator
            v-if="divider && index < visibleDropdownActions.length - 1"
          />
        </template>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
