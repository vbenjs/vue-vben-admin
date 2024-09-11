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
  import { Alert } from 'ant-design-vue';
  import { BasicUpload } from '@/components/Upload';
  import { useMessage } from '@/hooks/web/useMessage';
  import { uploadApi } from '@/api/sys/upload';

  const { createMessage } = useMessage();
  function handleChange(list: string[]) {
    createMessage.success(`已上传文件${JSON.stringify(list)}`);
  }
</script>
