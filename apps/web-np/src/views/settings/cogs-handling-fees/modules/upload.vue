<script lang="ts" setup>
import type { UploadProps } from 'ant-design-vue';

import { VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { message, Upload } from 'ant-design-vue';

const selectedFile = defineModel();

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isCSV = file.type === 'text/csv';
  if (!isCSV) {
    message.error(`${file.name} is not a CSV file`);
    return false;
  }

  selectedFile.value = file;
  return false;
};
</script>
<template>
  <div class="">
    <Upload accept=".csv" :max-count="1" :before-upload="beforeUpload">
      <VbenButton variant="outline">
        <IconifyIcon icon="ant-design:upload-outlined" class="mr-2 size-5" />
        Choose *.csv file to import
      </VbenButton>
    </Upload>
  </div>
</template>
