<template>
  <BasicModal
    @register="registerModal"
    :width="450"
    :destroyOnClose="true"
    :canFullscreen="false"
    :keyboard="false"
    :maskClosable="false"
    :closable="true"
    title="同步状态"
    footer=""
    :afterClose="afterClose"
    v-bind="$attrs"
  >
    <div class="flex flex-col justify-center items-center">
      <Progress type="circle" :percent="status" />

      <a-button class="mt-6" type="primary" @click="closeSync" v-auth="'sync_stop'">
        停止同步
      </a-button>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { Progress, message } from 'ant-design-vue';
  import { getSyncStatus, stopSync } from '@/api/warehouse/product';

  defineOptions({ name: 'SyncStatusModal' });

  const emit = defineEmits(['success', 'register']);

  const status = ref<string>('');
  const timer = ref<NodeJS.Timeout | null>(null);

  const [registerModal, { closeModal }] = useModalInner(async () => {
    status.value = '';
    watchStatus();
    status.value = await getStatus();
  });

  const getStatus = async () => {
    const data = await getSyncStatus();
    const value = ((data.completeCount / data.totalCount) * 100).toFixed(2);
    return value;
  };

  const watchStatus = () => {
    timer.value = setInterval(async () => {
      status.value = await getStatus();
      if (Number(status.value) >= 100) {
        message.success('同步完成！');
        closeModal();
      }
    }, 1000);
  };

  const closeSync = async () => {
    await stopSync();
    message.success('停止同步成功！');
    closeModal();
  };

  const afterClose = async () => {
    clearInterval(timer.value!);
    timer.value = null;
  };
</script>
