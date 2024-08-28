<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { message } from 'ant-design-vue';

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {
    message.info('onConfirm');
    // drawerApi.close();
  },
});
</script>
<template>
  <Drawer title="基础抽屉示例" title-tooltip="标题提示内容">
    <template #extra> extra </template>
    base demo

    <!-- <template #prepend-footer> slot </template> -->
    <!-- <template #append-footer> prepend slot </template> -->
  </Drawer>
</template>
