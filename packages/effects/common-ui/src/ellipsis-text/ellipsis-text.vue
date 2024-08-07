<script setup lang="ts">
import { computed, nextTick, ref, watchEffect } from 'vue';
import type { CSSProperties } from 'vue';

import { VbenTooltip } from '@vben-core/shadcn-ui/components/tooltip';

interface Props {
  expand?: boolean; // 是否启用点击文本展开全部
  line?: number; // 最大行数
  maxWidth?: number | string; // 文本最大宽度
  placement: 'bottom' | 'left' | 'right' | 'top'; // 提示框位置
  tooltip?: boolean; // 是否启用文本提示框
  tooltipBackgroundColor?: string; // 提示框背景颜色，优先级高于 overlayStyle
  tooltipColor?: string; // 提示文本字体颜色，优先级高于 overlayStyle
  tooltipFontSize?: number; // 提示文本字体大小，单位px，优先级高于 overlayStyle
  tooltipMaxWidth?: number; // 提示框内容最大宽度，单位px，默认不设置时，提示文本内容自动与展示文本宽度保持一致
  tooltipOverlayStyle?: CSSProperties; // 提示框内容区域样式
}
const props = withDefaults(defineProps<Props>(), {
  expand: false,
  line: 1,
  maxWidth: '100%',
  placement: 'top',
  tooltip: true,
  tooltipBackgroundColor: 'red',
  tooltipColor: '',
  tooltipFontSize: 14,
  tooltipMaxWidth: undefined,
  tooltipOverlayStyle: () => ({ textAlign: 'justify' }),
});
const emit = defineEmits(['expandChange']);

const textMaxWidth = computed(() => {
  if (typeof props.maxWidth === 'number') {
    return `${props.maxWidth}px`;
  }
  return props.maxWidth;
});
const showTooltip = ref(false);
const ellipsis = ref();
const defaultTooltipMaxWidth = ref();
watchEffect(() => {
  showTooltip.value = props.tooltip;
});
watchEffect(
  () => {
    if (props.tooltip && ellipsis.value) {
      defaultTooltipMaxWidth.value =
        props.tooltipMaxWidth ?? ellipsis.value.offsetWidth + 24;
    }
  },
  { flush: 'post' },
);
function onExpand() {
  const { style } = ellipsis.value;
  const isExpanded = !style['-webkit-line-clamp'];
  if (props.tooltip) {
    showTooltip.value = !isExpanded;
  }

  nextTick(() => {
    style['-webkit-line-clamp'] = isExpanded ? props.line : '';
  });

  emit('expandChange', !isExpanded);
}
</script>
<template>
  <VbenTooltip
    :content-style="{
      maxWidth: `${defaultTooltipMaxWidth}px`,
      fontSize: `${tooltipFontSize}px`,
      color: tooltipColor,
      ...tooltipOverlayStyle,
    }"
    :disabled="!showTooltip"
    :overlay-style="tooltipOverlayStyle"
    :side="placement"
  >
    <slot name="tooltip">
      <slot></slot>
    </slot>

    <template #trigger>
      <div
        ref="ellipsis"
        :class="{
          pointer: expand,
          [$style.ellipsisOneLine]: line === 1,
          [$style.ellipsisMultiLine]: line > 1,
        }"
        :style="`-webkit-line-clamp: ${line}; max-width: ${textMaxWidth};`"
        class="cursor-text overflow-hidden"
        @click="expand ? onExpand() : () => false"
        v-bind="$attrs"
        :data-line="line"
      >
        <slot></slot>
      </div>
    </template>
  </VbenTooltip>
</template>

<style>
.pointer {
  @apply cursor-pointer;
}
</style>

<style module>
.ellipsisOneLine {
  @apply inline-block truncate;
}

.ellipsisMultiLine {
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>
