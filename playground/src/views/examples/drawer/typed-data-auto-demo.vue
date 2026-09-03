<script setup lang="ts">
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

interface AutoDrawerData {
  message: string;
  method: '自动推导';
}

const data = ref<AutoDrawerData>();

const [Drawer, drawerApi] = useVbenDrawer<AutoDrawerData>({
  onOpenChange(isOpen) {
    data.value = isOpen ? drawerApi.getData() : undefined;
  },
});

defineExpose({ drawerApi });
</script>

<template>
  <Drawer title="自动推导数据类型">
    <div class="space-y-2 px-2">
      <p>类型来源：{{ data?.method }}</p>
      <p>接收内容：{{ data?.message }}</p>
    </div>
  </Drawer>
</template>
