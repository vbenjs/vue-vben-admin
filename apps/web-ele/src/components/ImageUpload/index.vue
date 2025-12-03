<template>
  <div class="component-upload-image">
    <ElUpload
      :file-list="fileList as any"
      :limit="limit"
      :show-file-list="true"
      list-type="picture-card"
      name="file"
      :class="{ hide: fileList.length >= limit }"
      :before-upload="beforeUpload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :http-request="httpRequest"
    >
      <ElIcon><Plus /></ElIcon>
    </ElUpload>
    <div class="el-upload__tip" v-if="showTip">
      请上传
      <template v-if="fileSize">
        大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
      </template>
      <template v-if="fileType">
        格式为 <b style="color: #f56c6c">{{ fileType.join('/') }}</b>
      </template>
      的文件
    </div>
    <ElDialog v-model="dialogVisible" title="预览" width="800" append-to-body>
      <img
        :src="dialogImageUrl"
        style="display: block; max-width: 100%; margin: 0 auto"
      />
    </ElDialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { ElDialog, ElIcon, ElMessage, ElUpload } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { uploadFile } from '#/api/core/file';

interface UploadItem {
  name?: string;
  url?: string;
}

const props = defineProps({
  modelValue: { type: [String, Array, Object] as any, default: '' },
  limit: { type: Number, default: 1 },
  fileSize: { type: Number, default: 1 },
  fileType: {
    type: Array as () => string[],
    default: () => ['png', 'jpg', 'jpeg'],
  },
  isShowTip: { type: Boolean, default: true },
});

const emit = defineEmits(['update:modelValue', 'change']);

const fileList = ref<UploadItem[]>([]);
const dialogImageUrl = ref('');
const dialogVisible = ref(false);

const showTip = computed(
  () => props.isShowTip && (props.fileType?.length || props.fileSize),
);

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      fileList.value = [];
      return;
    }
    if (Array.isArray(val)) {
      const list = (val as any[]).map((item) => {
        if (typeof item === 'string') return { name: item, url: item };
        if (item && typeof item === 'object')
          return { name: item.name ?? 'image', url: item.url ?? '' };
        return { name: 'image', url: '' };
      });
      fileList.value = list;
    } else if (typeof val === 'string') {
      fileList.value = [{ name: 'image', url: val }];
    } else if (val && typeof val === 'object') {
      const url = (val as any)?.url ?? '';
      fileList.value = url ? [{ name: 'image', url }] : [];
    }
  },
  { immediate: true, deep: true },
);

function beforeUpload(file: File) {
  let isImg = false;
  if (props.fileType.length) {
    let fileExtension = '';
    if (file.name.lastIndexOf('.') > -1) {
      fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);
    }
    isImg = props.fileType.some((type) => {
      if (file.type.indexOf(type) > -1) return true;
      if (fileExtension && fileExtension.indexOf(type) > -1) return true;
      return false;
    });
  } else {
    isImg = file.type.indexOf('image') > -1;
  }
  if (!isImg) {
    ElMessage.error(
      `文件格式不正确, 请上传${props.fileType.join('/')}图片格式文件`,
    );
    return false;
  }
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize;
    if (!isLt) {
      ElMessage.error(`上传图片大小不能超过 ${props.fileSize} MB`);
      return false;
    }
  }
  return true;
}

async function httpRequest(option: any) {
  const form = new FormData();
  form.append('uploadPath', '/');
  form.append('biz', 'user_avatar');
  form.append('file', option.file as File);
  try {
    const resp = await uploadFile(form);
    const data = (resp as any) ?? resp;
    const normalize = (s: string) =>
      s
        .trim()
        .replace(/^`+|`+$/g, '')
        .replace(/^"+|"+$/g, '')
        .replace(/^'+|'+$/g, '');
    let url = '';
    let name = option.file?.name ?? 'image';
    if (typeof data === 'string') {
      url = normalize(data);
    } else if (data && typeof data === 'object') {
      url = normalize((data?.url ?? data?.data?.url ?? '') as string);
      name = (data?.fileName ?? data?.data?.fileName ?? name) as string;
    }
    const item = { name, url: url || URL.createObjectURL(option.file as File) };
    fileList.value = [item];
    emit('update:modelValue', url || item.url);
    emit('change', data);
    option.onSuccess?.(data);
  } catch (error) {
    ElMessage.error('上传图片失败');
    option.onError?.(error);
  }
}

function handlePreview(file: any) {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
}

function handleRemove(file: any) {
  const idx = fileList.value.findIndex((f) => f.name === file.name);
  if (idx > -1) {
    fileList.value.splice(idx, 1);
    emit('update:modelValue', Array.isArray(props.modelValue) ? [] : '');
  }
}
</script>

<style scoped lang="scss">
::v-deep.hide .el-upload--picture-card {
  display: none;
}

::v-deep .el-list-enter-active,
::v-deep .el-list-leave-active {
  transition: all 0s;
}

::v-deep .el-list-enter,
::v-deep .el-list-leave-active {
  opacity: 0;
  transform: translateY(0);
}
</style>
