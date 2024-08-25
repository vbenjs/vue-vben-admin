<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    message.info('onConfirm');
    // modalApi.close();
  },
});

const list = ref<number[]>([]);

list.value = Array.from({ length: 10 }, (_v, k) => k + 1);

function handleUpdate() {
  list.value = Array.from({ length: 6 }, (_v, k) => k + 1);
}
</script>
<template>
  <Modal title="自动计算高度">
    <div
      v-for="item in list"
      :key="item"
      class="even:bg-heavy bg-muted flex-center h-[220px] w-full"
    >
      {{ item }}
    </div>

    <template #prepend-footer>
      <Button type="link" @click="handleUpdate">点击更新数据</Button>
    </template>
  </Modal>
</template>
