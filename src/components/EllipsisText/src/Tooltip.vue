<script setup lang="ts">
  import { ref } from 'vue';
  import type { CSSProperties } from 'vue';
  import { rafTimeout, cancelRaf } from './_utils';

  interface Props {
    maxWidth?: number; // 提示框内容最大宽度，单位px
    content?: string; // 展示的文本 string | slot
    tooltip?: string; // 提示的文本 string | slot
    fontSize?: number; // 提示文本字体大小，单位px，优先级高于 overlayStyle
    color?: string; // 提示文本字体颜色，优先级高于 overlayStyle
    backgroundColor?: string; // 提示框背景颜色，优先级高于 overlayStyle
    overlayStyle?: CSSProperties; // 提示框内容区域样式
  }
  withDefaults(defineProps<Props>(), {
    maxWidth: 120,
    content: '暂无内容',
    tooltip: '暂无提示',
    fontSize: 14,
    color: '#FFF',
    backgroundColor: 'rgba(0, 0, 0, .85)',
    overlayStyle: () => ({}),
  });
  const visible = ref(false);
  const hideTimer = ref();
  const top = ref(0); // 提示框top定位
  const left = ref(0); // 提示框left定位
  const contentRef = ref(); // 声明一个同名的模板引用
  const tooltipRef = ref(); // 声明一个同名的模板引用
  function getPosition() {
    const contentWidth = contentRef.value && contentRef.value.offsetWidth; // 展示文本宽度
    const tooltipWidth = tooltipRef.value && tooltipRef.value.offsetWidth; // 提示文本宽度
    const tooltipHeight = tooltipRef.value && tooltipRef.value.offsetHeight; // 提示文本高度
    top.value = tooltipHeight + 4;
    left.value = (tooltipWidth - contentWidth) / 2;
  }
  const emit = defineEmits(['openChange']);
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
      class="m-tooltip-content"
      :class="{ 'show-tip': visible }"
      :style="`--tooltip-font-size: ${fontSize}px; --tooltip-color: ${color}; --tooltip-background-color: ${backgroundColor}; max-width: ${maxWidth}px; top: ${-top}px; left: ${-left}px;`"
      @mouseenter="onShow"
      @mouseleave="onHide"
    >
      <div class="u-tooltip" :style="overlayStyle">
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

<style lang="less" scoped>
  .m-tooltip {
    display: inline-block;
    position: relative;

    .m-tooltip-content {
      position: absolute;
      z-index: 9999;
      width: max-content;
      padding-bottom: 12px;
      transform: scale(0.8); // 缩放变换
      transform-origin: 50% 75%;
      transition:
        transform 0.25s,
        opacity 0.25s;
      opacity: 0;
      pointer-events: none;

      .u-tooltip {
        min-width: 32px;
        min-height: 32px;
        padding: 6px 8px;
        border-radius: 6px;
        background-color: var(--tooltip-background-color);
        box-shadow:
          0 6px 16px 0 rgb(0 0 0 / 8%),
          0 3px 6px -4px rgb(0 0 0 / 12%),
          0 9px 28px 8px rgb(0 0 0 / 5%);
        color: var(--tooltip-color);
        font-size: var(--tooltip-font-size);
        line-height: 1.5714;
        text-align: start;
        text-decoration: none;
        word-wrap: break-word;
      }

      .m-tooltip-arrow {
        content: '';
        display: block;
        position: absolute;
        z-index: 9;
        bottom: 12px;
        left: 50%;
        width: 16px;
        height: 16px;
        overflow: hidden;
        transform: translateX(-50%) translateY(100%) rotate(180deg);
        pointer-events: none;

        &::before {
          position: absolute;
          bottom: 0;
          inset-inline-start: 0;
          width: 16px;
          height: 8px;
          background-color: var(--tooltip-background-color);
          clip-path: path(
            'M 0 8 A 4 4 0 0 0 2.82842712474619 6.82842712474619 L 6.585786437626905 3.0710678118654755 A 2 2 0 0 1 9.414213562373096 3.0710678118654755 L 13.17157287525381 6.82842712474619 A 4 4 0 0 0 16 8 Z'
          );
        }

        &::after {
          content: '';
          position: absolute;
          z-index: 0;
          bottom: 0;
          width: 8.9706px;
          height: 8.9706px;
          inset-inline: 0;
          margin: auto;
          transform: translateY(50%) rotate(-135deg);
          border-radius: 0 0 2px;
          background: transparent;
          box-shadow: 3px 3px 7px rgb(0 0 0 / 10%);
        }
      }
    }

    .show-tip {
      transform: scale(1); // 缩放变换
      opacity: 1;
      pointer-events: auto;
    }
  }
</style>
