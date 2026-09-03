<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

interface SharedData {
  content: string;
  payload: string;
}

const data = ref<SharedData>();

const [Modal, modalApi] = useVbenModal<SharedData>({
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    console.info('onConfirm');
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      data.value = modalApi.getData();
    }
  },
});

defineExpose({ modalApi });
</script>
<template>
  <Modal title="数据共享示例">
    <div class="flex-col-center">外部传递数据： {{ data }}</div>
  </Modal>
</template>
