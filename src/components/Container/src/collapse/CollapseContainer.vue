<template>
  <div class="collapse-container p-2">
    <CollapseHeader v-bind="$props" :show="show" @expand="handleExpand">
      <template #title>
        <slot name="title" />
      </template>
    </CollapseHeader>
    <CollapseTransition :enable="canExpan">
      <Skeleton v-if="loading" />
      <div class="collapse-container__body" v-else v-show="show">
        <LazyContainer :timeout="lazyTime" v-if="lazy">
          <slot />
          <template #skeleton>
            <slot name="lazySkeleton" />
          </template>
        </LazyContainer>
        <slot v-else />
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

  import LazyContainer from '../LazyContainer.vue';

  import { triggerWindowResize } from '/@/utils/event/triggerWindowResizeEvent';
  // hook
  import { useTimeoutFn } from '@vueuse/core';

  export default defineComponent({
    components: {
      Skeleton,
      LazyContainer,
      CollapseHeader,
      CollapseTransition,
    },
    name: 'CollapseContainer',
    props: {
      title: {
        type: String as PropType<string>,
        default: '',
      },
      // Can it be expanded
      canExpan: {
        type: Boolean as PropType<boolean>,
        default: true,
      },
      // Warm reminder on the right side of the title
      helpMessage: {
        type: [Array, String] as PropType<string[] | string>,
        default: '',
      },
      // Whether to trigger window.resize when expanding and contracting,
      // Can adapt to tables and forms, when the form shrinks, the form triggers resize to adapt to the height
      triggerWindowResize: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      loading: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      // Delayed loading
      lazy: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
      // Delayed loading time
      lazyTime: {
        type: Number as PropType<number>,
        default: 0,
      },
    },
    setup(props) {
      const showRef = ref(true);
      /**
       * @description: Handling development events
       */
      function handleExpand() {
        const hasShow = !unref(showRef);
        showRef.value = hasShow;

        if (props.triggerWindowResize) {
          // 200 milliseconds here is because the expansion has animation,
          useTimeoutFn(triggerWindowResize, 200);
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
    border-radius: 2px;
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
