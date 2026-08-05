<script setup lang="ts">
import type { ExplicitDrawerData } from './typed-data-contract';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

const data = ref<ExplicitDrawerData>();

const [Drawer, drawerApi] = useVbenDrawer<ExplicitDrawerData>({
  onOpenChange(isOpen) {
    data.value = isOpen ? drawerApi.getData() : undefined;
  },
});
</script>

<template>
  <Drawer title="显式泛型数据类型">
    <div class="space-y-2 px-2">
      <p>类型来源：{{ data?.method }}</p>
      <p>接收内容：{{ data?.message }}</p>
    </div>
  </Drawer>
</template>
