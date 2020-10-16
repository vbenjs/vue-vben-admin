<template>
  <div class="collapse-container p-2">
    <CollapseHeader v-bind="$props" :show="show" @expand="handleExpand" />
    <CollapseTransition :enable="canExpan">
      <Skeleton v-if="loading" />
      <div class="collapse-container__body" v-else v-show="show">
        <!-- <LazyContainer :timeout="lazyTime" v-if="lazy">
          <slot />
          <template #skeleton>
            <slot name="lazySkeleton" />
          </template>
        </LazyContainer> -->
        <slot />
      </div>
    </CollapseTransition>
  </div>
</template>
<script lang="ts">
  import type { PropType } from 'vue';

  import { defineComponent, ref, unref } from 'vue';
  // component
  import { CollapseTransition } from '/@/components/Transition/index';
  import CollapseHeader from './CollapseHeader.vue';
  import { Skeleton } from 'ant-design-vue';

  // import LazyContainer from '../LazyContainer';

  import { triggerWindowResize } from '/@/utils/event/triggerWindowResizeEvent';
  // hook
  import { useTimeout } from '/@/hooks/core/useTimeout';
  export default defineComponent({
    components: {
      Skeleton,
      // LazyContainer,
      CollapseHeader,
      CollapseTransition,
    },
    name: 'CollapseContainer',
    props: {
      // 标题
      title: {
        type: String as PropType<string>,
        default: '',
      },
      // 是否可以展开
      canExpan: {
        type: Boolean as PropType<boolean>,
        default: true,
      },
      // 标题右侧温馨提醒
      helpMessage: {
        type: [Array, String] as PropType<string[] | string>,
        default: '',
      },
      // 展开收缩的时候是否触发window.resize,
      // 可以适应表格和表单,当表单收缩起来,表格触发resize 自适应高度
      triggerWindowResize: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      loading: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      // 延时加载
      lazy: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      // 延时加载时间
      lazyTime: {
        type: Number as PropType<number>,
        default: 3000,
      },
    },
    setup(props) {
      const showRef = ref(true);
      /**
       * @description: 处理开展事件
       */
      function handleExpand() {
        const hasShow = !unref(showRef);
        showRef.value = hasShow;

        if (props.triggerWindowResize) {
          // 这里200毫秒是因为展开有动画,
          useTimeout(triggerWindowResize, 200);
        }
      }
      return {
        show: showRef,
        handleExpand,
      };
    },
  });
</script>
<style lang="less">
  .collapse-container {
    background: #fff;
    border-radius: 8px;
    transition: all 0.3s ease-in-out;

    &.no-shadow {
      box-shadow: none;
    }

    &__header {
      display: flex;
      height: 32px;
      margin-bottom: 10px;
      justify-content: space-between;
      align-items: center;
    }

    &__action {
      display: flex;
      align-items: center;
    }
  }
</style>
