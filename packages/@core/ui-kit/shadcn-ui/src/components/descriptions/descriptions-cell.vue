<script setup lang="ts">
import type { CSSProperties } from 'vue';

import type { DescriptionsRenderNode, DescriptionsSize } from './types';

import { computed } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { VbenRenderContent } from '../render-content';

interface Props {
  /** 是否边框模式 */
  bordered?: boolean;
  /** 是否显示冒号（仅非边框模式生效） */
  colon?: boolean;
  /** 内容 */
  content?: DescriptionsRenderNode | null;
  /** 内容样式 */
  contentStyle?: CSSProperties;
  /** 单项自定义类名 */
  itemClass?: string;
  /** 标签 */
  label?: DescriptionsRenderNode | null;
  /** 标签样式 */
  labelStyle?: CSSProperties;
  /** 尺寸 */
  size?: DescriptionsSize;
  /** 跨列数 */
  span?: number;
  /** 渲染标签 th 还是 td */
  tag: 'td' | 'th';
  /** 单元格类型 */
  type: 'content' | 'item' | 'label';
}

const props = withDefaults(defineProps<Props>(), {
  bordered: false,
  colon: true,
  content: null,
  contentStyle: undefined,
  itemClass: undefined,
  label: null,
  labelStyle: undefined,
  size: 'middle',
  span: 1,
});

const BORDERED_PADDING: Record<DescriptionsSize, string> = {
  large: 'px-6 py-4',
  middle: 'px-4 py-2.5',
  small: 'px-3 py-2',
};

const PLAIN_PADDING: Record<DescriptionsSize, string> = {
  large: 'pb-6',
  middle: 'pb-4',
  small: 'pb-2',
};

// 冒号通过伪元素追加，避免标签为渲染函数时无法拼接
const COLON_CLASS = "after:content-[':']";

const hasLabel = computed(
  () => props.label !== null && props.label !== undefined,
);
const hasContent = computed(
  () => props.content !== null && props.content !== undefined,
);

// 数字 0 会被 VbenRenderContent 当作 falsy 隐藏，这里转为字符串保证展示；
// 同时将 null 归一为 undefined，匹配 VbenRenderContent 的 content 类型
const displayLabel = computed(() => {
  if (props.label === null || props.label === undefined) return undefined;
  return typeof props.label === 'number' ? String(props.label) : props.label;
});
const displayContent = computed(() => {
  if (props.content === null || props.content === undefined) return undefined;
  return typeof props.content === 'number'
    ? String(props.content)
    : props.content;
});

const cellClass = computed(() => {
  if (props.bordered) {
    return cn(
      'border border-border align-top break-words',
      BORDERED_PADDING[props.size],
      props.type === 'label'
        ? 'bg-muted/50 text-start font-normal text-foreground'
        : 'text-foreground',
      props.itemClass,
    );
  }
  return cn('align-top', PLAIN_PADDING[props.size], props.itemClass);
});

const labelClass = computed(() =>
  cn('mr-2 shrink-0 text-muted-foreground', props.colon && COLON_CLASS),
);
</script>

<template>
  <component :is="tag" :class="cellClass" :colspan="span">
    <!-- 边框模式：每个单元格仅承载 label 或 content -->
    <template v-if="bordered">
      <span v-if="hasLabel" :style="labelStyle">
        <VbenRenderContent :content="displayLabel" />
      </span>
      <span v-if="hasContent" :style="contentStyle">
        <VbenRenderContent :content="displayContent" />
      </span>
    </template>

    <!-- 非边框模式：label + content 容器 -->
    <div v-else class="flex">
      <span v-if="hasLabel" :class="labelClass" :style="labelStyle">
        <VbenRenderContent :content="displayLabel" />
      </span>
      <span
        v-if="hasContent"
        class="break-words text-foreground"
        :style="contentStyle"
      >
        <VbenRenderContent :content="displayContent" />
      </span>
    </div>
  </component>
</template>
