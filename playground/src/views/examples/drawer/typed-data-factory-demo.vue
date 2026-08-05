<script setup lang="ts">
import type { FactoryDrawerData } from './typed-data-contract';

import { ref } from 'vue';

import { useFactoryDrawer } from './typed-data-contract';

const data = ref<FactoryDrawerData>();

const [Drawer, drawerApi] = useFactoryDrawer({
  onOpenChange(isOpen) {
    data.value = isOpen ? drawerApi.getData() : undefined;
  },
});
</script>

<template>
  <Drawer title="契约工厂数据类型">
    <div class="space-y-2 px-2">
      <p>类型来源：{{ data?.method }}</p>
      <p>接收内容：{{ data?.message }}</p>
    </div>
  </Drawer>
</template>
