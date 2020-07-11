<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Layout } from 'ant-design-vue';
  // hooks
  import { useDesign } from '@/hooks/core/useDesign';

  import { ContentEnum } from '@/enums/appEnum';
  import { appStore } from '@/store/modules/app';

  export default defineComponent({
    name: 'DefaultLayoutContent',
    setup() {
      const { prefixCls } = useDesign('layout-content');

      return () => {
        const { getProjCfg } = appStore;
        const { contentMode } = getProjCfg;
        const wrapClass = contentMode === ContentEnum.FULL ? 'full' : 'fixed';
        return (
          <Layout.Content class={[prefixCls, wrapClass]}>
            <router-view />
          </Layout.Content>
        );
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-layout-content';

  .@{prefix-cls} {
    position: relative;
    // margin: 16px 16px 0;

    &.fixed {
      width: 1200px;
      margin: 0 auto;
    }
  }
</style>
