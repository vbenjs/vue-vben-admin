<template>
  <Layout :class="prefixCls">
    <LayoutFeatures />
    <LayoutHeader fixed ref="headerRef" v-if="getShowFullHeaderRef" />
    <Layout>
      <LayoutSideBar v-if="getShowSidebar" />
      <Layout :class="`${prefixCls}__main`">
        <LayoutMultipleHeader />
        <LayoutContent />
        <LayoutFooter />
      </Layout>
    </Layout>
  </Layout>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Layout } from 'ant-design-vue';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

  import LayoutHeader from './header/index.vue';
  import LayoutContent from './content/index.vue';
  import LayoutSideBar from './sider';
  import LayoutMultipleHeader from './header/LayoutMultipleHeader';

  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { createLayoutContext } from './useLayoutContext';

  import { registerGlobComp } from '/@/components/registerGlobComp';

  export default defineComponent({
    name: 'DefaultLayout',
    components: {
      LayoutFeatures: createAsyncComponent(() => import('/@/layouts/default/feature/index.vue')),
      LayoutFooter: createAsyncComponent(() => import('/@/layouts/default/footer/index.vue')),
      LayoutHeader,
      LayoutContent,
      LayoutSideBar,
      LayoutMultipleHeader,
      Layout,
    },
    setup() {
      // ! Only register global components here
      // ! Can reduce the size of the first screen code
      // default layout It is loaded after login. So it won’t be packaged to the first screen
      registerGlobComp();

      const headerRef = ref<ComponentRef>(null);

      const { prefixCls } = useDesign('default-layout');

      createLayoutContext({ fullHeader: headerRef });

      const { getShowFullHeaderRef } = useHeaderSetting();

      const { getShowSidebar } = useMenuSetting();

      return {
        getShowFullHeaderRef,
        getShowSidebar,
        headerRef,
        prefixCls,
      };
    },
  });
</script>
<style lang="less">
  @import (reference) '../../design/index.less';
  @prefix-cls: ~'@{namespace}-default-layout';

  .@{prefix-cls} {
    display: flex;
    width: 100%;
    min-height: 100%;
    background: @content-bg;
    flex-direction: column;

    > .ant-layout {
      min-height: 100%;
    }

    &__main {
      margin-left: 1px;
    }
  }
</style>
