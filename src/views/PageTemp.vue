<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { useDesign } from '@/hooks/core/useDesign';

  export default defineComponent({
    name: 'Index',
    setup() {
      const { prefixCls } = useDesign('index');

      return () => {
        return <div class={prefixCls}>index</div>;
      };
    },
  });
</script>
<style scoped lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-index';

  .@{prefix-cls} {
    position: relative;
  }
</style>
