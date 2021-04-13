<template>
  <div :class="prefixCls">
    <CollapseHeader
      v-bind="getBindValues"
      :prefixCls="prefixCls"
      :show="show"
      @expand="handleExpand"
    >
      <template #title>
        <slot name="title"></slot>
      </template>
      <template #action>
        <slot name="action"></slot>
      </template>
    </CollapseHeader>

    <div class="p-2">
      <CollapseTransition :enable="canExpan">
        <Skeleton v-if="loading" :active="active" />
        <div :class="`${prefixCls}__body`" v-else v-show="show">
          <slot></slot>
        </div>
      </CollapseTransition>
    </div>

    <div :class="`${prefixCls}__footer`" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script lang="ts">
  import type { PropType } from 'vue';

  import { defineComponent, ref, computed } from 'vue';

  // component
  import { Skeleton } from 'ant-design-vue';
  import { CollapseTransition } from '/@/components/Transition';
  import CollapseHeader from './CollapseHeader.vue';

  import { triggerWindowResize } from '/@/utils/event';
  // hook
  import { useTimeoutFn } from '/@/hooks/core/useTimeout';
  import { propTypes } from '/@/utils/propTypes';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'CollapseContainer',
    components: {
      Skeleton,
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
      loading: propTypes.bool.def(false),
      active: propTypes.bool.def(true),
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

      const getBindValues = computed((): any => {
        return props;
      });

      return {
        show,
        handleExpand,
        prefixCls,
        getBindValues,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-collapse-container';

  .@{prefix-cls} {
    background-color: @component-background;
    border-radius: 2px;
    transition: all 0.3s ease-in-out;

    &__header {
      display: flex;
      height: 32px;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid @border-color-light;
    }

    &__footer {
      border-top: 1px solid @border-color-light;
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
