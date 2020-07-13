<script lang="tsx">
  // component
  import { defineComponent } from 'compatible-vue';

  // hook
  import { useDesign } from '@/hooks/core/useDesign';

  import { getSlot } from '@/utils/helper/tsxHelper';

  import { TypeEnum, ScrollContainerOptions } from './types';
  export default defineComponent({
    name: 'ScrollContainer',
    props: {
      // 启用滚动条
      enableScroll: {
        type: Boolean,
        default: true,
      },
      type: {
        type: String,
        default: TypeEnum.MAIN,
        validate: (v: TypeEnum) => [TypeEnum.DEFAULT, TypeEnum.MAIN].includes(v),
      },
    },
    setup({ type, enableScroll }: ScrollContainerOptions, { slots }) {
      const { prefixCls } = useDesign('scroll');

      return () =>
        enableScroll ? (
          <scrollbar
            wrap-class={`${type}-scrollbar__wrap`}
            view-class={`${type}-scrollbar__view`}
            class={prefixCls}
          >
            {getSlot(slots, 'default')}
          </scrollbar>
        ) : (
          <div class={`${prefixCls}--disabled`}> {getSlot(slots, 'default')}</div>
        );
    },
  });
</script>
<style scoped lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-scroll';

  .@{prefix-cls} {
    width: 100%;
    height: 100%;

    &--disabled {
      // padding: 16px;
    }

    /deep/.el-scrollbar__wrap.default-scrollbar__wrap {
      margin-bottom: 18px !important;
      overflow-x: hidden;
    }

    /deep/ .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    /deep/ .el-scrollbar__view {
      &.main-scrollbar__view {
        padding: 16px;
        box-sizing: border-box;
      }
    }
  }
</style>
