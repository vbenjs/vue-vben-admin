<template>
  <div :class="['p-2', prefixCls]">
    <CollapseHeader v-bind="$props" :prefixCls="prefixCls" :show="show" @expand="handleExpand">
      <template #title>
        <slot name="title" />
      </template>
    </CollapseHeader>

    <CollapseTransition :enable="canExpan">
      <Skeleton v-if="loading" />
      <div :class="`${prefixCls}__body`" v-else v-show="show">
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

  import { defineComponent, ref } from 'vue';

  // component
  import { Skeleton } from 'ant-design-vue';
  import { CollapseTransition } from '/@/components/Transition/index';
  import CollapseHeader from './CollapseHeader.vue';
  import LazyContainer from '../LazyContainer.vue';

  import { triggerWindowResize } from '/@/utils/event/triggerWindowResizeEvent';
  // hook
  import { useTimeoutFn } from '/@/hooks/core/useTimeout';
  import { propTypes } from '/@/utils/propTypes';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'CollapseContainer',
    components: {
      Skeleton,
      LazyContainer,
      CollapseHeader,
      CollapseTransition,
    },
    props: {
      title: propTypes.string.def(''),
      // Can it be expanded
      canExpan: propTypes.bool.def(true),
      // Warm reminder on the right side of the title
      helpMessage: {
        type: [Array, String] as PropType<string[] | string>,
        default: '',
      },
      // Whether to trigger window.resize when expanding and contracting,
      // Can adapt to tables and forms, when the form shrinks, the form triggers resize to adapt to the height
      triggerWindowResize: propTypes.bool,
      loading: propTypes.bool,
      // Delayed loading
      lazy: propTypes.bool,
      // Delayed loading time
      lazyTime: propTypes.number.def(0),
    },
    setup(props) {
      const show = ref(true);

      const { prefixCls } = useDesign('collapse-container');

      /**
       * @description: Handling development events
       */
      function handleExpand() {
        show.value = !show.value;
        if (props.triggerWindowResize) {
          // 200 milliseconds here is because the expansion has animation,
          useTimeoutFn(triggerWindowResize, 200);
        }
      }
      return {
        show,
        handleExpand,
        prefixCls,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-collapse-container';

  .@{prefix-cls} {
    background: #fff;
    border-radius: 2px;
    transition: all 0.3s ease-in-out;

    &__header {
      display: flex;
      height: 32px;
      margin-bottom: 10px;
      justify-content: space-between;
      align-items: center;
    }

    &__action {
      display: flex;
      text-align: right;
      flex: 1;
      align-items: center;
      justify-content: flex-end;
    }
  }
</style>
