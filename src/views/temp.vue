<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { useDesign } from '@/hooks/core/useDesign';

  const { prefixCls } = useDesign('index');

  export default defineComponent({
    name: 'Index',
    setup() {
      return () => <div class={prefixCls}>index</div>;
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
