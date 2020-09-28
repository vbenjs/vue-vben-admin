<template>
  <Scrollbar
    ref="scrollbarRef"
    :wrapClass="`scrollbar__wrap`"
    :viewClass="`scrollbar__view`"
    class="scroll-container"
  >
    <slot />
  </Scrollbar>
</template>

<script lang="ts">
  // component
  import { defineComponent, ref, unref, nextTick } from 'vue';
  import { Scrollbar } from '/@/components/Scrollbar';

  // hook
  import { useScrollTo } from '/@/hooks/event/useScrollTo';

  export default defineComponent({
    name: 'ScrollContainer',
    components: { Scrollbar },
    setup() {
      const scrollbarRef = ref<RefInstanceType<any>>(null);

      function scrollTo(to: number, duration = 500) {
        const scrollbar = unref(scrollbarRef);
        if (!scrollbar) return;
        nextTick(() => {
          const { start } = useScrollTo({
            el: unref(scrollbar.$.wrap),
            to,
            duration,
          });
          start();
        });
      }

      function getScrollWrap() {
        const scrollbar = unref(scrollbarRef);
        if (!scrollbar) return null;
        return scrollbar.$.wrap;
      }

      function scrollBottom() {
        const scrollbar = unref(scrollbarRef);
        if (!scrollbar) return;
        nextTick(() => {
          const scrollHeight = scrollbar.$.wrap.scrollHeight as number;
          const { start } = useScrollTo({
            el: unref(scrollbar.$.wrap),
            to: scrollHeight,
          });
          start();
        });
      }
      return {
        scrollbarRef,
        scrollTo,
        scrollBottom,
        getScrollWrap,
      };
    },
  });
</script>
<style lang="less">
  .scroll-container {
    width: 100%;
    height: 100%;

    .scrollbar__wrap {
      margin-bottom: 18px !important;
      overflow-x: hidden;
    }

    .scrollbar__view {
      box-sizing: border-box;
    }
  }
</style>
