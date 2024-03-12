<template>
  <Upload
    list-type="picture-card"
    class="avatar-uploader"
    :before-upload="beforeUpload"
    :file-list="fileList"
    @preview="handlePreview"
    @change="handleChange"
    :customRequest="customRequest"
    @remove="remove"
    :data="
      (file) => {
        return { file, type: 'image' };
      }
    "
  >
    <div>
      <Icon icon="ant-design:plus-outlined" :size="32" />
      <div style="margin-top: 8px">Upload</div>
    </div>
  </Upload>
</template>

<script lang="ts" setup>
  import { message, Upload } from 'ant-design-vue';
  import { computed, ref, toRaw, unref, watch } from 'vue';
  import { propTypes } from '@/utils/propTypes';
  import { Icon } from '@/components/Icon';
  import { UploadChangeParam, UploadFile } from 'ant-design-vue/es/upload/interface';
  import { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface';
  import { uploadFile } from '@/api/system/materialFile';
  import { toDownloadUrl } from '@/utils/file/file';
  import { buildShortUUID } from '@/utils/uuid';
  import { useMessage } from '@/hooks/web/useMessage';
  import { createImgPreview } from '@/components/Preview';

  const fileList = ref<any[]>([]);
  const { createConfirm } = useMessage();
  const props = defineProps({
    uploadText: propTypes.string.def(''),
    materialName: propTypes.string.def(''),
    materialType: propTypes.string.def(''),
    refId: propTypes.number,
    value: {
      type: Array as PropType<any[]>,
      default: null,
    },
  });
  const emit = defineEmits(['update:value']);
  const uuids = computed(() => {
    return fileList.value.map((item) => item.uuid).filter((item) => item);
  });

  watch(
    () => props.value,
    (value) => {
      if (!value) return (fileList.value = []);
      value.forEach((item) => {
        const uuid = item.uuid ?? item.resourceId;
        if (unref(uuids).includes(uuid)) return;
        const url = toDownloadUrl({ uuid }, 120);
        fileList.value.push({
          uid: item.id ?? buildShortUUID(),
          name: props.materialName,
          status: 'done',
          uuid,
          url,
        });
      });
      handleDelete(value.map((item) => item.uuid ?? item.resourceId));
    },
  );
  const handleDelete = (uuids: number[] = []) => {
    let indexNum: number | undefined = undefined;
    fileList.value.every((item, index) => {
      const uuid = item.uuid;
      const isNeed = uuid && uuids.includes(uuid);
      if (!isNeed) indexNum = index;
      return isNeed;
    });
    if (indexNum === undefined) return;
    fileList.value.splice(indexNum, 1);
    handleDelete(uuids);
  };

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
  const updateValue = () => {
    emit(
      'update:value',
      toRaw(fileList.value).map((item) => {
        return {
          materialName: props.materialName,
          materialType: props.materialType,
          resourceId: item.response?.uuid ?? item.uuid,
          refId: props.refId,
        };
      }),
    );
  };
  function handleChange(info: UploadChangeParam) {
    const status = info.file.status;
    if (!status) return;
    fileList.value = info.fileList;
    if (status === 'done') {
      updateValue();
    }
  }
  const remove = (file) => {
    createConfirm({
      iconType: 'warning',
      title: '删除',
      content: '确定删除该文件吗？',
      onOk: () => {
        const index = fileList.value.findIndex((item) => item.uid === file.uid);
        fileList.value.splice(index, 1);
        updateValue();
      },
    });
    return false;
  };
  async function handlePreview({ uuid }: any) {
    const url = toDownloadUrl({ uuid }, 640);
    if (!url) return;
    createImgPreview({ imageList: [url], defaultWidth: 700, rememberState: true });
  }

  const customRequest = ({ data, onProgress, onSuccess }: UploadRequestOption) => {
    uploadFile(data as any, onProgress).then((response) => {
      onSuccess && onSuccess(response);
    });
  };
  defineExpose({
    fileList,
  });
</script>

<style lang="less" scoped>
  .avatar-uploader {
    min-height: 104px;
  }

  .avatar-uploader-disabled {
    .ant-upload {
      display: none;
    }
  }

  .ant-upload-list-item-info::before {
    left: 0;
  }
</style>
