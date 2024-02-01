<template>
  <Scrollbar
    ref="scrollbarRef"
    class="scroll-container"
    :scrollHeight="scrollHeight"
    v-bind="$attrs"
  >
    <slot></slot>
  </Scrollbar>
</template>

<script lang="ts" setup>
  import { ref, unref, nextTick } from 'vue';
  import { Scrollbar, ScrollbarType } from '@/components/Scrollbar';
  import { useScrollTo } from '@vben/hooks';
  import { type Nullable } from '@vben/types';

  defineOptions({ name: 'ScrollContainer' });

  defineProps({
    scrollHeight: {
      type: Number,
    },
  });

  const scrollbarRef = ref<Nullable<ScrollbarType>>(null);

  function getScrollWrap() {
    const scrollbar = unref(scrollbarRef);
    if (!scrollbar) {
      return null;
    }
    return scrollbar.wrap;
  }

  /**
   * Scroll to the specified position
   */
  function scrollTo(to: number, duration = 500) {
    const wrap = unref(getScrollWrap());
    nextTick(() => {
      if (!wrap) {
        return;
      }
      const { start } = useScrollTo({
        el: wrap,
        to,
        duration,
      });
      start();
    });
  }

  /**
   * Scroll to the bottom
   */
  function scrollBottom() {
    const wrap = unref(getScrollWrap());
    nextTick(() => {
      if (!wrap) {
        return;
      }
      const scrollHeight = wrap.scrollHeight as number;
      const { start } = useScrollTo({
        el: wrap,
        to: scrollHeight,
      });
      start();
    });
  }

  defineExpose({
    scrollTo,
    scrollBottom,
  });
</script>
<style lang="less">
  .scroll-container {
    width: 100%;
    height: 100%;

    .scrollbar__wrap {
      margin-bottom: 18px !important;
    }

    .scrollbar__view {
      box-sizing: border-box;
    }
  }
</style>
