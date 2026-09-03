<script setup lang="ts">
import type { FactoryModalData } from './typed-data-contract';

import { ref } from 'vue';

import { useFactoryModal } from './typed-data-contract';

const data = ref<FactoryModalData>();

const [Modal, modalApi] = useFactoryModal({
  onOpenChange(isOpen) {
    data.value = isOpen ? modalApi.getData() : undefined;
  },
});
</script>

<template>
  <Modal title="契约工厂数据类型">
    <div class="space-y-2 px-2">
      <p>类型来源：{{ data?.method }}</p>
      <p>接收内容：{{ data?.message }}</p>
    </div>
  </Modal>
</template>
