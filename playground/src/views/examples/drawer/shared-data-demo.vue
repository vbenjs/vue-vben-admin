<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { message } from 'antdv-next';

interface SharedData {
  content: string;
  payload: string;
}

const data = ref<SharedData>();

const [Drawer, drawerApi] = useVbenDrawer<SharedData>({
  onCancel() {
    drawerApi.close();
  },
  onConfirm() {
    message.info('onConfirm');
    // drawerApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      data.value = drawerApi.getData();
    }
  },
});

defineExpose({ drawerApi });
</script>
<template>
  <Drawer title="数据共享示例">
    <div class="flex-col-center">外部传递数据： {{ data }}</div>
  </Drawer>
</template>
