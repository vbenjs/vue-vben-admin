<script lang="tsx">
  import { defineComponent, ref, unref, PropOptions } from 'compatible-vue';

  // component
  import { CollapseTransition } from '@/components/transition/index';
  import { BaseTitle, BaseArrow } from '@/components/base/index';
  import { Skeleton } from 'ant-design-vue';
  import { LazyContainer } from '@/components/container/index';

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
      } as PropOptions<string>,
      // 是否可以展开
      canExpan: {
        type: Boolean,
        default: true,
      } as PropOptions<boolean>,
      // 标题右侧温馨提醒
      helpMessage: {
        type: [Array, String],
        default: '',
      } as PropOptions<string[] | string>,
      // 展开收缩的时候是否触发window.resize,
      // 可以适应表格和表单,当表单收缩起来,表格触发resize 自适应高度
      triggerWindowResize: {
        type: Boolean,
        default: false,
      } as PropOptions<boolean>,
      loading: {
        type: Boolean,
        default: false,
      } as PropOptions<boolean>,
      // 延时加载
      lazy: {
        type: Boolean,
        default: false,
      } as PropOptions<boolean>,
      // 延时加载时间
      lazyTime: {
        type: Number,
        default: 3000,
      } as PropOptions<number>,
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
        const { helpMessage, title, canExpan } = props;
        return (
          <div class={`${prefixCls}__header`}>
            <BaseTitle helpMessage={helpMessage}>{title || getSlot(slots, 'title')}</BaseTitle>
            <div class={`${prefixCls}__action`}>
              {getSlot(slots, 'action')}
              {canExpan ? <BaseArrow expand={!unref(showRef)} onClick={handleExpand} /> : null}
            </div>
          </div>
        );
      }
      return () => {
        const { canExpan, loading, lazy, lazyTime } = props;
        return (
          <div class={prefixCls}>
            {renderHeader()}
            <CollapseTransition enable={canExpan}>
              {loading ? (
                <Skeleton />
              ) : (
                <div class={`${prefixCls}__body`} v-show={unref(showRef)}>
                  {lazy ? (
                    <LazyContainer timeout={lazyTime}>
                      {getSlot(slots, 'default')}
                      <template slot="skeleton">{getSlot(slots, 'lazySkeleton')}</template>
                    </LazyContainer>
                  ) : (
                    getSlot(slots, 'default')
                  )}
                </div>
              )}
            </CollapseTransition>
          </div>
        );
      };
    },
  });
</script>
<style scoped lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-collapse-container';

  .@{prefix-cls} {
    padding: 10px;
    background: @white;
    border-radius: 4px;
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
