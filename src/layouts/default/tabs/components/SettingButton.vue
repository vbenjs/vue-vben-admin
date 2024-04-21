<template>
  <span :class="`${prefixCls}__extra-fold`" @click="openDrawer(true)">
    <Icon icon="ion:settings-outline" />
    <SettingDrawer @register="register" />
  </span>
</template>
<script lang="ts" setup>
  import SettingDrawer from '@/layouts/default/setting/SettingDrawer';
  import Icon from '@/components/Icon/Icon.vue';

  import { useDrawer } from '@/components/Drawer';

  import { useDesign } from '@/hooks/web/useDesign';

  defineOptions({ name: 'SettingButton' });

  const [register, { openDrawer }] = useDrawer();
  const { prefixCls } = useDesign('multiple-tabs-content');
</script>
