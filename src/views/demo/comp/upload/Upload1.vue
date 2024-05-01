<template>
  
    <Alert message="基础示例" />
    <BasicUpload
      :maxSize="20"
      :maxNumber="10"
      @change="handleChange"
      :api="uploadApi"
      class="my-5"
      :accept="['image/*']"
    />

</template>

<script setup lang="ts">
  import { BasicUpload } from '@/components/Upload';
  import { uploadApi } from '@/api/sys/upload';
  import { useMessage } from '@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  import { Alert } from 'ant-design-vue';
  function handleChange(list: string[]) {
    createMessage.success(`已上传文件${JSON.stringify(list)}`);
  }
</script>

<style scoped>

</style>