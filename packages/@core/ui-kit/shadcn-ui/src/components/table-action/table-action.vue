<script setup lang="ts">
import type { ActionItem, TableActionProps } from './types';

import { computed, ref } from 'vue';

import { Ellipsis } from '@vben-core/icons';
import { cn } from '@vben-core/shared/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
} from '../../ui';
import { VbenButton } from '../button';
import { VbenTooltip } from '../tooltip';
import ActionDropdownItemComp from './action-dropdown-item.vue';
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

const dropdownOpen = ref(false);

/**
 * 当与气泡确认（Popover）交互时，避免误关闭整个下拉菜单。
 * Popover 内容被 Portal 渲染到菜单之外，默认会被判定为「点击外部」而关闭菜单。
 */
function onContentInteractOutside(event: Event) {
  const target = (event as CustomEvent).detail?.originalEvent?.target as
    | HTMLElement
    | null
    | undefined;
  if (target?.closest('[data-slot="popover-content"]')) {
    event.preventDefault();
  }
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

    <DropdownMenu
      v-if="visibleDropdownActions.length > 0"
      v-model:open="dropdownOpen"
    >
      <DropdownMenuTrigger as-child>
        <VbenButton class="gap-1 p-2" variant="link">
          <Ellipsis class="size-4" />
          <span v-if="moreText">{{ moreText }}</span>
        </VbenButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        @interact-outside="onContentInteractOutside"
      >
        <template
          v-for="(item, index) in visibleDropdownActions"
          :key="item.key ?? index"
        >
          <ActionDropdownItemComp
            :action="item"
            @confirm="dropdownOpen = false"
          />
          <DropdownMenuSeparator
            v-if="divider && index < visibleDropdownActions.length - 1"
          />
        </template>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
