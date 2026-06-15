<script setup lang="ts">
import type { VNode } from 'vue';

import type { DescriptionsItemType, DescriptionsProps } from './types';

import { computed, useSlots } from 'vue';

import { cn } from '@vben-core/shared/utils';

import DescriptionsRow from './descriptions-row.vue';
import {
  calcRows,
  normalizeItems,
  parseItemsFromSlot,
  resolveColumn,
  useScreens,
} from './use-descriptions';

defineOptions({ name: 'VbenDescriptions' });

const props = withDefaults(defineProps<DescriptionsProps>(), {
  bordered: false,
  class: undefined,
  colon: true,
  column: undefined,
  contentStyle: undefined,
  extra: undefined,
  items: undefined,
  labelStyle: undefined,
  layout: 'horizontal',
  size: 'middle',
  title: undefined,
});

const slots = useSlots();
const screens = useScreens();

// 优先使用 items；否则从默认插槽中解析 VbenDescriptionsItem
const resolvedItems = computed<DescriptionsItemType[]>(() => {
  if (props.items && props.items.length > 0) return props.items;
  const nodes = (slots.default?.() ?? []) as VNode[];
  return parseItemsFromSlot(nodes);
});

const mergedColumn = computed(() => resolveColumn(props.column, screens.value));
const mergedItems = computed(() =>
  normalizeItems(resolvedItems.value, screens.value),
);
const rows = computed(() => calcRows(mergedItems.value, mergedColumn.value));

const hasHeader = computed(
  () => !!props.title || !!props.extra || !!slots.title || !!slots.extra,
);

const tableClass = computed(() =>
  cn(
    'w-full table-auto border-collapse text-sm',
    // 非边框模式下，去掉最后一行的底部间距
    !props.bordered && '[&>tbody>tr:last-child>td]:pb-0',
  ),
);
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <div v-if="hasHeader" class="mb-5 flex items-center justify-between gap-4">
      <div class="text-base font-semibold text-foreground">
        <slot name="title">{{ title }}</slot>
      </div>
      <div class="text-foreground">
        <slot name="extra">{{ extra }}</slot>
      </div>
    </div>

    <table :class="tableClass">
      <tbody>
        <DescriptionsRow
          v-for="(row, index) in rows"
          :key="index"
          :row="row"
          :vertical="layout === 'vertical'"
          :bordered="bordered"
          :colon="colon"
          :size="size"
          :label-style="labelStyle"
          :content-style="contentStyle"
        />
      </tbody>
    </table>
  </div>
</template>
