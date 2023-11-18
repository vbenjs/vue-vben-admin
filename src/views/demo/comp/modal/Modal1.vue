<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="register"
    title="Modal Title"
    :helpMessage="['提示1', '提示2']"
    @open-change="handleShow"
  >
    <template #insertFooter>
      <a-button type="primary" danger @click="setLines" :disabled="loading">点我更新内容</a-button>
    </template>
    <template v-if="loading">
      <div class="h-full text-center line-height-100px">加载中，稍等3秒……</div>
    </template>
    <template v-if="!loading">
      <ul>
        <li v-for="index in lines" :key="index">加载完成{{ index }}！</li>
      </ul>
    </template>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';

  const loading = ref(true);
  const lines = ref(10);
  const [register, { setModalProps, redoModalHeight }] = useModalInner();

  watch(
    () => lines.value,
    () => {
      redoModalHeight();
    },
  );

  function handleShow(open: boolean) {
    if (open) {
      loading.value = true;
      setModalProps({ loading: true, confirmLoading: true });
      setTimeout(() => {
        lines.value = Math.round(Math.random() * 30 + 5);
        loading.value = false;
        setModalProps({ loading: false, confirmLoading: false });
      }, 3000);
    }
  }

  function setLines() {
    lines.value = Math.round(Math.random() * 20 + 10);
  }
</script>
