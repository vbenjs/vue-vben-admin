<script setup lang="ts">
import type {
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from 'ant-design-vue';

import { ref, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { Image, message, Upload } from 'ant-design-vue';

import { customRequest, getBase64 } from './tools';

interface Props {
  action?: string;
  disabled?: boolean;
  maxCount?: number;
  maxSize?: number;
  multiple?: boolean;
  uploadText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  action: '',
  disabled: false,
  maxCount: 1,
  maxSize: 512, // 默认 2MB
  multiple: false,
  uploadText: '上传图片',
});

// 绑定值
const modelValue = defineModel<string>({});
// 文件列表
const fileList = ref<UploadFile[]>([]);
// 开启预览
const previewVisible = ref(false);
// 预览图片
const previewImage = ref('');
// 错误信息
const errorMessage = ref('');
// 允许的图片类型
const acceptTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

watch(
  () => modelValue.value,
  (val) => {
    fileList.value = val
      ? val.split(';').map((item) => ({
          name: item,
          uid: item,
          url: item,
        }))
      : [];
  },
);

// 上传前验证
const handleBeforeUpload = (file: File) => {
  errorMessage.value = '';

  // 验证文件大小
  const fileSizeKB = file.size / 1024;
  if (fileSizeKB > props.maxSize) {
    const errorMsg = `图片大小不能超过 ${props.maxSize / 1024} MB`;
    errorMessage.value = errorMsg;
    message.error(errorMsg);
    return false;
  }

  // 验证文件类型
  const fileType = file.type.toLowerCase();
  const isImage = fileType.startsWith('image/');
  if (!isImage) {
    const errorMsg = '只能上传图片文件';
    errorMessage.value = errorMsg;
    message.error(errorMsg);
    return false;
  }

  return true;
};

// 处理文件变更
const handleChange = (info: UploadChangeParam) => {
  const { file, fileList: newFileList } = info;

  // 更新文件列表
  fileList.value = newFileList;

  // 处理上传状态
  if (file.status === 'done') {
    message.success(`${file.name} 上传成功`);
    // 更新 modelValue
    modelValue.value = fileList.value
      .filter((f) => f.status === 'done' && f.url)
      .map((f) => f.url!)
      .join(';');
  } else if (file.status === 'error') {
    errorMessage.value = `上传失败: ${file.error?.message}`;
    message.error(`${file.name} 上传失败`);
  }
};

const onPreview = async (file: UploadProps['fileList'][number]) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
};

const onRemove = () => {
  errorMessage.value = '';
};
</script>

<template>
  <div class="image-upload">
    <Upload
      v-model:file-list="fileList"
      list-type="picture-card"
      :before-upload="handleBeforeUpload"
      :action="action"
      :multiple="multiple"
      :max-count="maxCount"
      :disabled="disabled"
      :accept="acceptTypes.join(',')"
      @change="handleChange"
      @preview="onPreview"
      @remove="onRemove"
      :custom-request="customRequest"
    >
      <div
        v-if="fileList.length < maxCount"
        class="flex flex-col items-center justify-center"
      >
        <IconifyIcon icon="ep:plus" class="text-xl" />
        <div class="text-md mt-2">{{ uploadText }}</div>
      </div>
    </Upload>

    <!-- 图片预览 -->
    <Image
      style="display: none"
      :preview="{
        visible: previewVisible,
        onVisibleChange: (val) => {
          previewVisible = val;
        },
      }"
      :src="previewImage"
    />
    <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>
  </div>
</template>
