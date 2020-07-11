<script lang="tsx">
  // components
  import { defineComponent } from 'compatible-vue';
  import House from '../house/index.vue';

  // hook
  import { useDesign } from '@/hooks/core/useDesign';
  export default defineComponent({
    name: 'Welcome',
    setup() {
      // 样式前缀
      const { prefixCls } = useDesign('welcome');
      return () => {
        return (
          <div class={prefixCls}>
            <House />
          </div>
        );
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-welcome';

  .@{prefix-cls} {
    // 禁止选中
    .unselect();
    .size(100%);
    // 垂直居中
    .flex-center();

    &-img {
      .size(500px, 506px);

      // 媒体查询
      .respond-to(small, {.size(300px, 306px) ;});
      .respond-to(medium, {.size(360px, 366px) ;});
      .respond-to(large, {.size(500px, 506px) ;});
    }
  }
</style>
