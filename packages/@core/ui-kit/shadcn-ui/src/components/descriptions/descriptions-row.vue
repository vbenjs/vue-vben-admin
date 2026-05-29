<script setup lang="ts">
import type { CSSProperties } from 'vue';

import type { DescriptionsSize, InternalDescriptionsItem } from './types';

import DescriptionsCell from './descriptions-cell.vue';

interface Props {
  bordered?: boolean;
  colon?: boolean;
  contentStyle?: CSSProperties;
  labelStyle?: CSSProperties;
  row: InternalDescriptionsItem[];
  size?: DescriptionsSize;
  vertical?: boolean;
}

withDefaults(defineProps<Props>(), {
  bordered: false,
  colon: true,
  contentStyle: undefined,
  labelStyle: undefined,
  size: 'middle',
  vertical: false,
});

function mergeStyle(
  base?: CSSProperties,
  override?: CSSProperties,
): CSSProperties | undefined {
  if (!base && !override) return undefined;
  return { ...base, ...override };
}
</script>

<template>
  <!-- 垂直布局：标签独占一行，内容独占一行 -->
  <template v-if="vertical">
    <tr>
      <DescriptionsCell
        v-for="(item, index) in row"
        :key="`label-${item.key ?? index}`"
        tag="th"
        type="label"
        :span="item.span ?? 1"
        :bordered="bordered"
        :colon="colon"
        :size="size"
        :label="item.label ?? null"
        :item-class="item.class"
        :label-style="mergeStyle(labelStyle, item.labelStyle)"
      />
    </tr>
    <tr>
      <DescriptionsCell
        v-for="(item, index) in row"
        :key="`content-${item.key ?? index}`"
        tag="td"
        type="content"
        :span="item.span ?? 1"
        :bordered="bordered"
        :size="size"
        :content="item.content ?? null"
        :item-class="item.class"
        :content-style="mergeStyle(contentStyle, item.contentStyle)"
      />
    </tr>
  </template>

  <!-- 水平 + 边框：每项拆分为 label(th) 与 content(td) -->
  <tr v-else-if="bordered">
    <template v-for="(item, index) in row" :key="item.key ?? index">
      <DescriptionsCell
        tag="th"
        type="label"
        :span="1"
        :bordered="true"
        :size="size"
        :label="item.label ?? null"
        :item-class="item.class"
        :label-style="mergeStyle(labelStyle, item.labelStyle)"
      />
      <DescriptionsCell
        tag="td"
        type="content"
        :span="(item.span ?? 1) * 2 - 1"
        :bordered="true"
        :size="size"
        :content="item.content ?? null"
        :content-style="mergeStyle(contentStyle, item.contentStyle)"
      />
    </template>
  </tr>

  <!-- 水平 + 非边框：每项一个单元格，label 与 content 同列 -->
  <tr v-else>
    <DescriptionsCell
      v-for="(item, index) in row"
      :key="item.key ?? index"
      tag="td"
      type="item"
      :span="item.span ?? 1"
      :colon="colon"
      :size="size"
      :label="item.label ?? null"
      :content="item.content ?? null"
      :item-class="item.class"
      :label-style="mergeStyle(labelStyle, item.labelStyle)"
      :content-style="mergeStyle(contentStyle, item.contentStyle)"
    />
  </tr>
</template>
