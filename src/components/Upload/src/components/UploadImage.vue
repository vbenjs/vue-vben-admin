<template>
  <Upload
    list-type="picture-card"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    @change="handleChange"
    :customRequest="customRequest"
    :data="
      (file) => {
        return { file, type: 'image' };
      }
    "
  >
    <div class="imagebox" :style="{ width: `${width}px`, height: `${height}px` }">
      <img v-show="imageUrl" :src="imageUrl" alt="avatar" class="image-content" />
      <Popconfirm @confirm="deleteImg" title="是否确认删除？">
        <div class="close-icon" @click.stop v-show="imageUrl" v-if="showDelete">
          <Icon icon="ant-design:close-outlined" />
        </div>
      </Popconfirm>
      <div v-show="!imageUrl" class="upload-text-box">
        <Icon icon="ant-design:plus-outlined" :size="32" />
        <div class="ant-upload-text">
          <div v-if="uploadText">{{ uploadText }}</div>
          <div>(可拖拽到此框内上传)</div>
          <div>支持上传jpg/png文件，且不超过10MB</div>
        </div>
      </div>
    </div>
  </Upload>
</template>

<script lang="ts" setup>
  import { message, Upload, UploadChangeParam, UploadFile, Popconfirm } from 'ant-design-vue';
  import { ref, watch } from 'vue';
  import { Icon } from '@/components/Icon';
  import { toDownloadUrl } from '@/utils/file/file';
  import { uploadFile } from '@/api/system/materialFile';
  import { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface';
  import { MaterialType } from '@/api/system/model/fileModel';

  defineOptions({ name: 'UploadImage' });

  interface Props {
    uploadText?: string;
    materialType: MaterialType;
    materialName?: string;
    showDelete?: boolean;
    width?: number;
    height?: number;
    // value?: { resourceId: string };
  }

  const props = withDefaults(defineProps<Props>(), {
    uploadText: '',
    materialName: '',
    showDelete: true,
    width: 247,
    height: 158,
  });

  const modelValue = defineModel('modelValue', {
    type: Object as PropType<
      { resourceId: string; materialType?: string; materialName?: string } | undefined
    >,
    default: undefined,
  });

  const imageUrl = ref('');
  const imageUUID = ref('');
  const loading = ref(false);

  // const emit = defineEmits(['update:value']);
  const updateValue = (uuid: string) => {
    modelValue.value = {
      materialType: props.materialType,
      materialName: props.materialName,
      resourceId: uuid,
    };
  };
  watch(
    () => modelValue.value,
    (value) => {
      if (value) {
        const uuid = value.resourceId;
        if (imageUUID.value === uuid) return;
        imageUUID.value = uuid;
        imageUrl.value = toDownloadUrl({ uuid }, 120);
        updateValue(uuid);
      } else {
        imageUrl.value = '';
      }
    },
  );

  const customRequest = ({ data, onProgress, onSuccess }: UploadRequestOption) => {
    uploadFile(data as any, onProgress).then((response) => {
      onSuccess && onSuccess(response);
    });
  };
  function handleChange(info: UploadChangeParam) {
    if (info.file.status === 'uploading') {
      loading.value = true;
      return;
    }
    if (info.file.status === 'done') {
      const { uuid } = info.file.response;
      if (uuid) updateValue(uuid);
    }
  }
  function beforeUpload(file: UploadFile) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传图片！');
    }
    const isLt10M = (file.size ?? 0) / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('请不要上传超过10M的文件!');
    }
    return isJpgOrPng && isLt10M;
  }
  function deleteImg() {
    imageUrl.value = '';
    modelValue.value = undefined;
  }
</script>

<style lang="less" scoped>
  .ant-upload-select-picture-card i {
    color: #999;
    font-size: 32px;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  :deep(.ant-upload) {
    width: unset !important;
    height: unset !important;
  }

  .imagebox {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    .image-content {
      width: 100%;
      height: 100%;
    }

    .close-icon {
      position: absolute;
      top: 2px;
      right: 0;
      width: 30px;
      height: 30px;
      background-repeat: no-repeat;
      background-size: 30px 30px;
    }
  }
</style>
