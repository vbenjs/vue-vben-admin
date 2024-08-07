<script setup lang="ts">
import { computed, nextTick, ref, watchEffect } from 'vue';
import type { CSSProperties } from 'vue';

import { useNamespace } from '@vben/hooks';
import { VbenTooltip } from '@vben-core/shadcn-ui/components/tooltip';

interface Props {
  expand?: boolean; // 是否启用点击文本展开全部
  line?: number; // 最大行数
  maxWidth?: number | string; // 文本最大宽度
  tooltip?: boolean; // 是否启用文本提示框
  tooltipBackgroundColor?: string; // 提示框背景颜色，优先级高于 overlayStyle
  tooltipColor?: string; // 提示文本字体颜色，优先级高于 overlayStyle
  tooltipFontSize?: number; // 提示文本字体大小，单位px，优先级高于 overlayStyle
  // 以下均为 tooltip 组件属性
  tooltipMaxWidth?: number; // 提示框内容最大宽度，单位px，默认不设置时，提示文本内容自动与展示文本宽度保持一致
  tooltipOverlayStyle?: CSSProperties; // 提示框内容区域样式
}
const props = withDefaults(defineProps<Props>(), {
  expand: false,
  line: undefined,
  maxWidth: '100%',
  tooltip: true,
  tooltipBackgroundColor: 'rgba(0, 0, 0, .85)',
  tooltipColor: '#FFF',
  tooltipFontSize: 14,
  tooltipMaxWidth: undefined,
  tooltipOverlayStyle: () => ({ padding: '8px 12px', textAlign: 'justify' }),
});
const emit = defineEmits(['expandChange']);

const { b, e } = useNamespace('m-ellipsis');

const textMaxWidth = computed(() => {
  if (typeof props.maxWidth === 'number') {
    return `${props.maxWidth}px`;
  }
  return props.maxWidth;
});
const showTooltip = ref();
const ellipsis = ref();
const defaultTooltipMaxWidth = ref();
watchEffect(() => {
  showTooltip.value = props.tooltip;
});
watchEffect(
  () => {
    if (props.tooltip) {
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
    v-if="showTooltip"
    :background-color="tooltipBackgroundColor"
    :color="tooltipColor"
    :font-size="tooltipFontSize"
    :max-width="defaultTooltipMaxWidth"
    :overlay-style="tooltipOverlayStyle"
  >
    <template #tooltip>
      <slot name="tooltip">
        <slot></slot>
      </slot>
    </template>
    <div
      ref="ellipsis"
      :class="[line ? e('line') : e('not-line'), { 'cursor-pointer': expand }]"
      :style="`-webkit-line-clamp: ${line}; max-width: ${textMaxWidth};`"
      class="cursor-text overflow-hidden"
      @click="expand ? onExpand() : () => false"
      v-bind="$attrs"
    >
      <slot></slot>
    </div>
  </VbenTooltip>
  <div
    v-else
    ref="ellipsis"
    :class="[
      b(),
      line ? e('line') : e('not-line'),
      { 'cursor-pointer': expand },
    ]"
    :style="`-webkit-line-clamp: ${line}; max-width: ${textMaxWidth};`"
    class="cursor-text overflow-hidden"
    @click="expand ? onExpand() : () => false"
    v-bind="$attrs"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss">
.cursor-pointer {
  cursor: pointer;
}
</style>
