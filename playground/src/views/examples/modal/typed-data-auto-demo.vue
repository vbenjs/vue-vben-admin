<script setup lang="ts">
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

interface AutoModalData {
  message: string;
  method: '自动推导';
}

const data = ref<AutoModalData>();

const [Modal, modalApi] = useVbenModal<AutoModalData>({
  onOpenChange(isOpen) {
    data.value = isOpen ? modalApi.getData() : undefined;
  },
});

defineExpose({ modalApi });
</script>

<template>
  <Modal title="自动推导数据类型">
    <div class="space-y-2 px-2">
      <p>类型来源：{{ data?.method }}</p>
      <p>接收内容：{{ data?.message }}</p>
    </div>
  </Modal>
</template>
