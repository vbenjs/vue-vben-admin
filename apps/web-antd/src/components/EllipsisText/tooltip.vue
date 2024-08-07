<script setup lang="ts">
import { ref } from 'vue';
import type { CSSProperties } from 'vue';

import { cancelRaf, rafTimeout } from './_utils';

interface Props {
  backgroundColor?: string; // 提示框背景颜色，优先级高于 overlayStyle
  color?: string; // 提示文本字体颜色，优先级高于 overlayStyle
  content?: string; // 展示的文本 string | slot
  fontSize?: number; // 提示文本字体大小，单位px，优先级高于 overlayStyle
  maxWidth?: number; // 提示框内容最大宽度，单位px
  overlayStyle?: CSSProperties; // 提示框内容区域样式
  tooltip?: string; // 提示的文本 string | slot
}
withDefaults(defineProps<Props>(), {
  backgroundColor: 'rgba(0, 0, 0, .85)',
  color: '#FFF',
  content: '暂无内容',
  fontSize: 14,
  maxWidth: 120,
  overlayStyle: () => ({}),
  tooltip: '暂无提示',
});
const emit = defineEmits(['openChange']);
const visible = ref(false);
const hideTimer = ref();
const top = ref(0); // 提示框top定位
const left = ref(0); // 提示框left定位
const contentRef = ref(); // 声明一个同名的模板引用
const tooltipRef = ref(); // 声明一个同名的模板引用
function getPosition() {
  const contentWidth = contentRef.value?.offsetWidth || 0; // 展示文本宽度
  const tooltipWidth = tooltipRef.value?.offsetWidth || 0; // 提示文本宽度
  const tooltipHeight = tooltipRef.value?.offsetHeight || 0; // 提示文本高度

  top.value = tooltipHeight + 4;
  left.value = (tooltipWidth - contentWidth) / 2;
}
function onShow() {
  getPosition();
  cancelRaf(hideTimer.value);
  visible.value = true;
  emit('openChange', visible.value);
}
function onHide(): void {
  hideTimer.value = rafTimeout(() => {
    visible.value = false;
    emit('openChange', visible.value);
  }, 100);
}
</script>
<template>
  <div class="m-tooltip" @mouseenter="onShow" @mouseleave="onHide">
    <div
      ref="tooltipRef"
      :class="{ 'show-tip': visible }"
      :style="`--tooltip-font-size: ${fontSize}px; --tooltip-color: ${color}; --tooltip-background-color: ${backgroundColor}; max-width: ${maxWidth}px; top: ${-top}px; left: ${-left}px;`"
      class="m-tooltip-content"
      @mouseenter="onShow"
      @mouseleave="onHide"
    >
      <div :style="overlayStyle" class="u-tooltip">
        <slot name="tooltip">{{ tooltip }}</slot>
      </div>
      <div class="m-tooltip-arrow">
        <span class="u-tooltip-arrow"></span>
      </div>
    </div>
    <div ref="contentRef">
      <slot>{{ content }}</slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.m-tooltip {
  position: relative;
  display: inline-block;

  .m-tooltip-content {
    position: absolute;
    z-index: 9999;
    width: max-content;
    padding-bottom: 12px;
    pointer-events: none;
    opacity: 0;
    transition:
      transform 0.25s,
      opacity 0.25s;
    transform: scale(0.8); // 缩放变换
    transform-origin: 50% 75%;

    .u-tooltip {
      min-width: 32px;
      min-height: 32px;
      padding: 6px 8px;
      font-size: var(--tooltip-font-size);
      line-height: 1.5714;
      color: var(--tooltip-color);
      text-align: start;
      text-decoration: none;
      word-wrap: break-word;
      background-color: var(--tooltip-background-color);
      border-radius: 6px;
      box-shadow:
        0 6px 16px 0 rgb(0 0 0 / 8%),
        0 3px 6px -4px rgb(0 0 0 / 12%),
        0 9px 28px 8px rgb(0 0 0 / 5%);
    }

    .m-tooltip-arrow {
      position: absolute;
      bottom: 12px;
      left: 50%;
      z-index: 9;
      display: block;
      width: 16px;
      height: 16px;
      overflow: hidden;
      pointer-events: none;
      content: '';
      transform: translateX(-50%) translateY(100%) rotate(180deg);

      &::before {
        position: absolute;
        inset-inline-start: 0;
        bottom: 0;
        width: 16px;
        height: 8px;
        clip-path: path(
          'M 0 8 A 4 4 0 0 0 2.82842712474619 6.82842712474619 L 6.585786437626905 3.0710678118654755 A 2 2 0 0 1 9.414213562373096 3.0710678118654755 L 13.17157287525381 6.82842712474619 A 4 4 0 0 0 16 8 Z'
        );
        content: ''; // 解决提示框箭头颜色未生效问题
        background-color: var(--tooltip-background-color);
      }

      &::after {
        position: absolute;
        inset-inline: 0;
        bottom: 0;
        z-index: 0;
        width: 8.9706px;
        height: 8.9706px;
        margin: auto;
        content: '';
        background: transparent;
        border-radius: 0 0 2px;
        box-shadow: 3px 3px 7px rgb(0 0 0 / 10%);
        transform: translateY(50%) rotate(-135deg);
      }
    }
  }

  .show-tip {
    pointer-events: auto;
    opacity: 1;
    transform: scale(1); // 缩放变换
  }
}
</style>
