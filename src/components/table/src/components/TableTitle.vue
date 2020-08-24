<script lang="tsx">
  import { defineComponent, PropOptions } from 'compatible-vue';

  import { BaseTitle } from '@/components/base/index';
  import { useDesign } from '@/hooks/core/useDesign';

  import { isFunction } from '@/utils/is/index';

  import { getSlot } from '@/utils/helper/tsxHelper';
  export default defineComponent({
    name: 'TableTitle',
    props: {
      title: {
        type: [Function, String],
      } as PropOptions<string | ((data: any) => string)>,
      getSelectRows: {
        type: Function,
      } as PropOptions<() => any[]>,
      helpMessage: {
        type: [String, Array],
      } as PropOptions<string | string[]>,
    },
    setup(props, { slots }) {
      const { prefixCls } = useDesign('table-title');

      return () => {
        const { title, getSelectRows = () => {}, helpMessage } = props;
        let tit = title;

        if (isFunction(title)) {
          tit = title({
            selectRows: getSelectRows(),
          });
        }
        return (
          <div class={prefixCls}>
            {tit && <BaseTitle helpMessage={helpMessage}>{tit}</BaseTitle>}
            {!tit && <span>&nbsp;</span>}
            <div class={`${prefixCls}__toolbar`}>{getSlot(slots, 'default')}</div>
          </div>
        );
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-table-title';
  .@{prefix-cls} {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &__toolbar {
      > *:not(:last-child) {
        margin-right: 10px;
      }
    }
  }
</style>
