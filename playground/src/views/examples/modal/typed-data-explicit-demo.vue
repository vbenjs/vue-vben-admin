<script setup lang="ts">
import type { ExplicitModalData } from './typed-data-contract';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

const data = ref<ExplicitModalData>();

const [Modal, modalApi] = useVbenModal<ExplicitModalData>({
  onOpenChange(isOpen) {
    data.value = isOpen ? modalApi.getData() : undefined;
  },
});
</script>

<template>
  <Modal title="显式泛型数据类型">
    <div class="space-y-2 px-2">
      <p>类型来源：{{ data?.method }}</p>
      <p>接收内容：{{ data?.message }}</p>
    </div>
  </Modal>
</template>
