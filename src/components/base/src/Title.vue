<script lang="tsx">
  import BaseHelp from './Help.vue';
  import { defineComponent } from 'compatible-vue';

  // hook
  import { useDesign } from '@/hooks/core/useDesign';

  import { getSlot } from '@/utils/helper/tsxHelper';

  export default defineComponent({
    name: 'BaseTitle',
    props: {
      helpMessage: {
        type: [String, Array],
        default: '',
      },
    },
    setup(props, { slots }) {
      const { prefixCls } = useDesign('base-title');
      return () => (
        <span class={prefixCls}>
          {getSlot(slots, 'default')}
          {props.helpMessage && <BaseHelp class={`${prefixCls}__help`} text={props.helpMessage} />}
        </span>
      );
    },
  });
</script>
<style scoped lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-base-title';

  .@{prefix-cls} {
    position: relative;
    display: flex;
    padding-left: 7px;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: @text-color-base;

    .unselect();

    &::before {
      position: absolute;
      top: 4px;
      left: 0;
      width: 3px;
      height: 16px;
      margin-right: 4px;
      background: @primary-color;
      content: '';
    }

    &__help {
      margin-left: 10px;
    }
  }
</style>
