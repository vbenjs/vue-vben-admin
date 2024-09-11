<script setup lang="ts">
import { computed, type CSSProperties, ref, watchEffect } from 'vue';

import { VbenTooltip } from '@vben-core/shadcn-ui';

interface Props {
  /**
   * 是否启用点击文本展开全部
   * @default false
   */
  expand?: boolean;
  /**
   * 文本最大行数
   * @default 1
   */
  line?: number;
  /**
   * 文本最大宽度
   * @default '100%'
   */
  maxWidth?: number | string;
  /**
   * 提示框位置
   * @default 'top'
   */
  placement?: 'bottom' | 'left' | 'right' | 'top';
  /**
   * 是否启用文本提示框
   * @default true
   */
  tooltip?: boolean;
  /**
   * 提示框背景颜色，优先级高于 overlayStyle
   */
  tooltipBackgroundColor?: string;
  /**
   * 提示文本字体颜色，优先级高于 overlayStyle
   */
  tooltipColor?: string;
  /**
   * 提示文本字体大小，单位px，优先级高于 overlayStyle
   */
  tooltipFontSize?: number;
  /**
   * 提示框内容最大宽度，单位px，默认不设置时，提示文本内容自动与展示文本宽度保持一致
   */
  tooltipMaxWidth?: number;
  /**
   * 提示框内容区域样式
   * @default { textAlign: 'justify' }
   */
  tooltipOverlayStyle?: CSSProperties;
}

const props = withDefaults(defineProps<Props>(), {
  expand: false,
  line: 1,
  maxWidth: '100%',
  placement: 'top',
  tooltip: true,
  tooltipBackgroundColor: '',
  tooltipColor: '',
  tooltipFontSize: 14,
  tooltipMaxWidth: undefined,
  tooltipOverlayStyle: () => ({ textAlign: 'justify' }),
});
const emit = defineEmits<{ expandChange: [boolean] }>();

const textMaxWidth = computed(() => {
  if (typeof props.maxWidth === 'number') {
    return `${props.maxWidth}px`;
  }
  return props.maxWidth;
});
const ellipsis = ref();
const isExpand = ref(false);
const defaultTooltipMaxWidth = ref();

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
  isExpand.value = !isExpand.value;
  emit('expandChange', isExpand.value);
}

function handleExpand() {
  props.expand && onExpand();
}
</script>
<template>
  <div>
    <VbenTooltip
      :content-style="{
        ...tooltipOverlayStyle,
        maxWidth: `${defaultTooltipMaxWidth}px`,
        fontSize: `${tooltipFontSize}px`,
        color: tooltipColor,
        backgroundColor: tooltipBackgroundColor,
      }"
      :disabled="!props.tooltip || isExpand"
      :side="placement"
    >
      <slot name="tooltip">
        <slot></slot>
      </slot>

      <template #trigger>
        <div
          ref="ellipsis"
          :class="{
            '!cursor-pointer': expand,
            ['block truncate']: line === 1,
            [$style.ellipsisMultiLine]: line > 1,
          }"
          :style="{
            '-webkit-line-clamp': isExpand ? '' : line,
            'max-width': textMaxWidth,
          }"
          class="cursor-text overflow-hidden"
          @click="handleExpand"
          v-bind="$attrs"
        >
          <slot></slot>
        </div>
      </template>
    </VbenTooltip>
  </div>
</template>

<style module>
.ellipsisMultiLine {
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>
