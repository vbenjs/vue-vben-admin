<template>
  <Drawer
    v-if="getIsMobile"
    placement="left"
    :class="prefixCls"
    :width="getMenuWidth"
    :getContainer="false"
    :open="!getCollapsed"
    @close="handleClose"
  >
    <Sider />
  </Drawer>
  <MixSider v-else-if="getIsMixSidebar" />
  <Sider v-else />
</template>

<script lang="ts" setup>
  import Sider from './LayoutSider.vue';
  import MixSider from './MixSider.vue';
  import { Drawer } from 'ant-design-vue';

  import { useAppInject } from '@/hooks/web/useAppInject';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
  import { useDesign } from '@/hooks/web/useDesign';

  defineOptions({ name: 'SiderWrapper' });

  const { prefixCls } = useDesign('layout-sider-wrapper');
  const { getIsMobile } = useAppInject();
  const { setMenuSetting, getCollapsed, getMenuWidth, getIsMixSidebar } = useMenuSetting();

  function handleClose() {
    setMenuSetting({
      collapsed: true,
    });
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-sider-wrapper';

  .@{prefix-cls} {
    .ant-drawer-body {
      height: 100vh;
      padding: 0;
    }

    .ant-drawer-header-no-title {
      display: none;
    }
  }
</style>
