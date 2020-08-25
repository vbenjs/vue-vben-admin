<template>
  <scrollbar
    ref="scrollbarRef"
    :wrap-class="`${type}-scrollbar__wrap`"
    :view-class="`${type}-scrollbar__view`"
    :class="prefixCls"
  >
    <slot />
  </scrollbar>
</template>

<script lang="tsx">
  // component
  import { defineComponent, PropOptions, ref, unref, nextTick } from 'compatible-vue';
  import { Scrollbar } from '@/components/scrollbar';

  // hook
  import { useDesign } from '@/hooks/core/useDesign';
  import { useScrollTo } from '@/hooks/event/useScrollTo';

  import { TypeEnum } from './types';
  export default defineComponent({
    name: 'ScrollContainer',
    components: { Scrollbar },
    props: {
      // 滚动类型
      type: {
        type: String,
        default: TypeEnum.MAIN,
        validate: (v: TypeEnum) => [TypeEnum.DEFAULT, TypeEnum.MAIN].includes(v),
      } as PropOptions<TypeEnum>,
    },
    setup() {
      const { prefixCls } = useDesign('scroll');
      const scrollbarRef = ref<any>(null);

      function scrollTo(to: number, duration = 500) {
        nextTick(() => {
          const { start } = useScrollTo({
            el: unref(unref(scrollbarRef).wrap),
            to,
            duration,
          });
          start();
        });
      }

      function getScrollWrap() {
        return unref(scrollbarRef).wrap;
      }

      function scrollBottom() {
        nextTick(() => {
          const scrollHeight = unref(scrollbarRef).wrap.scrollHeight as number;
          const { start } = useScrollTo({
            el: unref(unref(scrollbarRef).wrap),
            to: scrollHeight,
          });
          start();
        });
      }
      return {
        prefixCls,
        scrollbarRef,
        scrollTo,
        scrollBottom,
        getScrollWrap,
      };
    },
  });
</script>
<style scoped lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-scroll';

  .@{prefix-cls} {
    width: 100%;
    height: 100%;

    /deep/.scrollbar__wrap.default-scrollbar__wrap {
      margin-bottom: 18px !important;
      overflow-x: hidden;
    }

    /deep/ .scrollbar__wrap {
      overflow-x: hidden;
    }

    /deep/ .scrollbar__view {
      &.main-scrollbar__view {
        box-sizing: border-box;
      }
    }
  }
</style>
