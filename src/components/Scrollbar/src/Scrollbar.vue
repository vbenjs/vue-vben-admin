<template>
  <div class="scrollbar">
    <div
      ref="wrap"
      :class="[wrapClass, 'scrollbar__wrap', native ? '' : 'scrollbar__wrap--hidden-default']"
      :style="wrapStyle"
      @scroll="handleScroll"
    >
      <component :is="tag" ref="resize" :class="['scrollbar__view', viewClass]" :style="viewStyle">
        <slot></slot>
      </component>
    </div>
    <template v-if="!native">
      <bar :move="moveX" :size="sizeWidth" />
      <bar vertical :move="moveY" :size="sizeHeight" />
    </template>
  </div>
</template>
<script lang="ts" setup>
  import {
    ref,
    onMounted,
    onBeforeUnmount,
    nextTick,
    provide,
    unref,
    watch,
    type PropType,
  } from 'vue';
  import type { StyleValue } from '@/utils/types';
  import { addResizeListener, removeResizeListener } from '@/utils/event';
  import componentSetting from '@/settings/componentSetting';
  import Bar from './bar';

  defineOptions({ name: 'Scrollbar' });

  const props = defineProps({
    native: {
      type: Boolean,
      default: componentSetting.scrollbar?.native ?? false,
    },
    wrapStyle: {
      type: [String, Array, Object] as PropType<StyleValue>,
      default: '',
    },
    wrapClass: {
      type: [String, Array],
      default: '',
    },
    viewClass: {
      type: [String, Array],
      default: '',
    },
    viewStyle: {
      type: [String, Array],
      default: '',
    },
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: 'div',
    },
    scrollHeight: {
      // 用于监控内部scrollHeight的变化
      type: Number,
      default: 0,
    },
  });

  const sizeWidth = ref('0');
  const sizeHeight = ref('0');
  const moveX = ref(0);
  const moveY = ref(0);
  const wrap = ref();
  const resize = ref();

  provide('scroll-bar-wrap', wrap);

  const handleScroll = () => {
    if (!props.native) {
      moveY.value = (unref(wrap).scrollTop * 100) / unref(wrap).clientHeight;
      moveX.value = (unref(wrap).scrollLeft * 100) / unref(wrap).clientWidth;
    }
  };

  const update = () => {
    if (!unref(wrap)) return;

    const heightPercentage = (unref(wrap).clientHeight * 100) / unref(wrap).scrollHeight;
    const widthPercentage = (unref(wrap).clientWidth * 100) / unref(wrap).scrollWidth;

    sizeHeight.value = heightPercentage < 100 ? heightPercentage + '%' : '';
    sizeWidth.value = widthPercentage < 100 ? widthPercentage + '%' : '';
  };

  watch(
    () => props.scrollHeight,
    () => {
      if (props.native) return;
      update();
    },
  );

  defineExpose({
    wrap,
  });

  onMounted(() => {
    if (props.native) return;
    nextTick(update);
    if (!props.noresize) {
      addResizeListener(unref(resize), update);
      addResizeListener(unref(wrap), update);
      addEventListener('resize', update);
    }
  });

  onBeforeUnmount(() => {
    if (props.native) return;
    if (!props.noresize) {
      removeResizeListener(unref(resize), update);
      removeResizeListener(unref(wrap), update);
      removeEventListener('resize', update);
    }
  });
</script>
<style lang="less">
  .scrollbar {
    position: relative;
    height: 100%;
    overflow: hidden;

    &__wrap {
      height: 100%;
      overflow: auto;

      &--hidden-default {
        scrollbar-width: none;

        &::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
          opacity: 0;
        }
      }
    }

    &__thumb {
      display: block;
      position: relative;
      width: 0;
      height: 0;
      transition: 0.3s background-color;
      border-radius: inherit;
      background-color: #9093994d;
      cursor: pointer;

      &:hover {
        background-color: #90939980;
      }
    }

    &__bar {
      position: absolute;
      z-index: 1;
      right: 2px;
      bottom: 2px;
      transition: opacity 80ms ease;
      border-radius: 4px;
      opacity: 0;

      &.is-vertical {
        top: 2px;
        width: 6px;

        & > div {
          width: 100%;
        }
      }

      &.is-horizontal {
        left: 2px;
        height: 6px;

        & > div {
          height: 100%;
        }
      }
    }
  }

  .scrollbar:active > .scrollbar__bar,
  .scrollbar:focus > .scrollbar__bar,
  .scrollbar:hover > .scrollbar__bar {
    transition: opacity 340ms ease-out;
    opacity: 1;
  }
</style>
