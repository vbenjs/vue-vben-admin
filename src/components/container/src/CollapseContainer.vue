<script lang="tsx">
  import { defineComponent, ref, unref } from '@/setup/vue';

  // component
  import { CollapseTransition } from '@/components/transition/index';
  import { BaseTitle, BaseArrow } from '@/components/base/index';

  import { getSlot } from '@/utils/helper/tsxHelper';
  import { triggerWindowResize } from '@/utils/event/triggerWindowResizeEvent';
  // hook
  import { useDesign } from '@/hooks/core/useDesign';
  import { useTimeout } from '@/hooks/core/useTimeout';
  // import { useTimeout } from '@/hooks/core/useTimeout';

  // import { tableStore } from '@/store/index';
  export default defineComponent({
    name: 'CollapseContainer',
    props: {
      // 标题
      title: {
        type: String,
        default: '',
      },
      // 是否可以展开
      canExpan: {
        type: Boolean,
        default: true,
      },
      // 标题右侧温馨提醒
      helpMessage: {
        type: [Array, String],
        default: '',
      },
      // 展开收缩的时候是否触发window.resize,
      // 可以适应表格和表单,当表单收缩起来,表格触发resize 自适应高度
      triggerWindowResize: {
        type: Boolean,
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    setup(props, { slots }) {
      const showRef = ref(true);
      const { prefixCls } = useDesign('collapse-container');

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

        // tableStore.setHasResizeStateAction(true);
        // useTimeout(() => {
        //   tableStore.setHasResizeStateAction(false);
        // }, 0);
      }

      /**
       * @description: 渲染顶部
       */
      function renderHeader() {
        return (
          <div class={`${prefixCls}__header`}>
            <BaseTitle helpMessage={props.helpMessage}>
              {props.title || getSlot(slots, 'title')}
            </BaseTitle>
            <div class={`${prefixCls}__action`}>
              {getSlot(slots, 'action')}
              {props.canExpan ? (
                <BaseArrow expand={!unref(showRef)} onClick={handleExpand} />
              ) : null}
            </div>
          </div>
        );
      }
      return () => (
        <div class={prefixCls}>
          {renderHeader()}
          <CollapseTransition enable={props.canExpan}>
            <div class={`${prefixCls}__body`} v-show={unref(showRef)}>
              {getSlot(slots, 'default')}
            </div>
          </CollapseTransition>
        </div>
      );
    },
  });
</script>
<style scoped lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-collapse-container';

  .@{prefix-cls} {
    padding: 10px;
    background: #fff;

    &__header {
      display: flex;
      justify-content: space-between;
      height: 32px;
      align-items: center;
      // margin-bottom: 10px;
    }

    &__action {
      display: flex;
      align-items: center;
    }
  }
</style>
