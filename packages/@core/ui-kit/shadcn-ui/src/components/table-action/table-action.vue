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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui';
import { VbenButton } from '../button';
import { VbenIcon } from '../icon';
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

// 缓存根节点类名，避免每次渲染都执行 cn()（内部 tailwind-merge 解析开销较大）
const wrapperClass = computed(() =>
  cn('flex items-center gap-1', alignClass.value, props.class),
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

/**
 * 预计算每个主操作的渲染视图模型：
 * - 普通按钮在本组件内直接渲染，不再为每个操作多包一层子组件，
 *   表格大量行时可显著减少组件实例数；
 * - 仅 popConfirm 操作仍交由子组件维护独立弹层状态；
 * - 类名等在此一次性计算并缓存，避免模板每次渲染都执行 cn()。
 */
const renderedActions = computed(() => {
  const list = visibleActions.value;
  return list.map((action, index) => {
    const hasTooltip = !!action.tooltip && !action.popConfirm;
    return {
      action,
      buttonClass: cn(
        'gap-1 p-2',
        action.danger && 'text-destructive hover:text-destructive',
        action.class,
      ),
      hasTooltip,
      isConfirm: !!action.popConfirm,
      key: action.key ?? index,
      showDivider: props.divider && index < list.length - 1,
      size: action.size ?? 'default',
      tooltipContent: hasTooltip ? tooltipContent(action) : undefined,
      tooltipSide: hasTooltip ? tooltipSide(action) : 'top',
      variant: action.variant ?? 'link',
    };
  });
});

const dropdownOpen = ref(false);

function onActionClick(action: ActionItem) {
  if (action.disabled || action.loading) return;
  action.onClick?.();
}

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
  <div :class="wrapperClass">
    <!-- 所有主操作共享同一个 TooltipProvider，避免每个 tooltip 各建一个 provider -->
    <TooltipProvider v-if="renderedActions.length > 0" :delay-duration="0">
      <template v-for="item in renderedActions" :key="item.key">
        <!-- 气泡确认：需独立弹层状态，交由子组件维护 -->
        <ActionItemComp v-if="item.isConfirm" :action="item.action" />

        <!-- 带提示的普通按钮 -->
        <Tooltip v-else-if="item.hasTooltip">
          <TooltipTrigger as-child tabindex="-1">
            <VbenButton
              :class="item.buttonClass"
              :disabled="item.action.disabled"
              :loading="item.action.loading"
              :size="item.size"
              :variant="item.variant"
              @click="onActionClick(item.action)"
            >
              <VbenIcon
                v-if="item.action.icon"
                :icon="item.action.icon"
                class="size-4"
              />
              <span v-if="item.action.text">{{ item.action.text }}</span>
            </VbenButton>
          </TooltipTrigger>
          <TooltipContent
            :side="item.tooltipSide"
            class="side-content bg-accent text-popover-foreground rounded-md"
          >
            {{ item.tooltipContent }}
          </TooltipContent>
        </Tooltip>

        <!-- 普通按钮 -->
        <VbenButton
          v-else
          :class="item.buttonClass"
          :disabled="item.action.disabled"
          :loading="item.action.loading"
          :size="item.size"
          :variant="item.variant"
          @click="onActionClick(item.action)"
        >
          <VbenIcon
            v-if="item.action.icon"
            :icon="item.action.icon"
            class="size-4"
          />
          <span v-if="item.action.text">{{ item.action.text }}</span>
        </VbenButton>

        <Separator v-if="item.showDivider" orientation="vertical" class="h-4" />
      </template>
    </TooltipProvider>

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
