<template>
  <div>
    <Space>
      <a-button
        type="primary"
        @click="openUploadModal"
        preIcon="carbon:cloud-upload"
        :disabled="disabled"
      >
        {{ t('component.upload.upload') }}
      </a-button>
      <Tooltip placement="bottom" v-if="showPreview">
        <template #title>
          {{ t('component.upload.uploaded') }}
          <template v-if="fileList.length">
            {{ fileList.length }}
          </template>
        </template>
        <a-button @click="openPreviewModal">
          <Icon icon="bi:eye" />
          <template v-if="fileList.length && showPreviewNumber">
            {{ fileList.length }}
          </template>
        </a-button>
      </Tooltip>
    </Space>
    <UploadModal
      v-bind="bindValue"
      :previewFileList="fileList"
      :fileListOpenDrag="fileListOpenDrag"
      :fileListDragOptions="fileListDragOptions"
      @register="registerUploadModal"
      @change="handleChange"
      @delete="handleDelete"
    />

    <UploadPreviewModal
      :value="fileList"
      :max-number="bindValue.maxNumber"
      @register="registerPreviewModal"
      @list-change="handlePreviewChange"
      @delete="handlePreviewDelete"
      :preview-columns="props.previewColumns"
      :before-preview-data="props.beforePreviewData"
    />
  </div>
</template>
<script lang="ts" setup>
  import { ref, watch, unref, computed, useAttrs } from 'vue';
  import { Recordable } from '@vben/types';
  import Icon from '@/components/Icon/Icon.vue';
  import { Tooltip, Space } from 'ant-design-vue';
  import { useModal } from '@/components/Modal';
  import { uploadContainerProps } from './props';
  import { omit } from 'lodash-es';
  import { useI18n } from '@/hooks/web/useI18n';
  import { isArray, isObject, isString } from '@/utils/is';
  import UploadModal from './components/UploadModal.vue';
  import UploadPreviewModal from './components/UploadPreviewModal.vue';
  import { BaseFileItem } from './types/typing';
  import { buildUUID } from '@/utils/uuid';

  defineOptions({ name: 'BasicUpload' });

  const props = defineProps(uploadContainerProps);

  const emit = defineEmits(['change', 'delete', 'preview-delete', 'update:value']);

  const attrs = useAttrs();
  const { t } = useI18n();
  // 上传modal
  const [registerUploadModal, { openModal: openUploadModal }] = useModal();

  //   预览modal
  const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();

  const fileList = ref<BaseFileItem[] | any[]>([]);

  const showPreview = computed(() => {
    const { emptyHidePreview } = props;
    if (!emptyHidePreview) return true;
    return emptyHidePreview ? fileList.value.length > 0 : true;
  });

  const bindValue = computed(() => {
    const value = { ...attrs, ...props };
    return omit(value, 'onChange');
  });

  const isFirstRender = ref<boolean>(true);

  function getValue(valueKey = 'url') {
    const list = (fileList.value || []).map((item: any) => {
      return item[valueKey];
    });
    return list;
  }
  function genFileListByUrls(urls: string[]) {
    const list = urls.map((e) => {
      return {
        uid: buildUUID(),
        url: e,
      };
    });
    return list;
  }
  watch(
    () => props.value,
    (v = []) => {
      let values: string[] = [];
      if (v) {
        if (isArray(v)) {
          values = v;
        } else if (typeof v == 'string') {
          values.push(v);
        }
        fileList.value = values.map((item) => {
          if (item && isString(item)) {
            return {
              uid: buildUUID(),
              url: item,
            };
          } else if (item && isObject(item)) {
            return item;
          } else {
            return;
          }
        }) as any;
      }
      emit('update:value', values);
      if (!isFirstRender.value) {
        emit('change', values);
        isFirstRender.value = false;
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );

  // 上传modal保存操作
  function handleChange(urls: string[], valueKey: string) {
    fileList.value = [...unref(fileList), ...(genFileListByUrls(urls) || [])];
    const values = getValue(valueKey);
    emit('update:value', values);
    emit('change', values);
  }

  // 预览modal保存操作
  function handlePreviewChange(fileItems: string[], valueKey: string) {
    fileList.value = [...(fileItems || [])];
    const values = getValue(valueKey);
    emit('update:value', values);
    emit('change', values);
  }

  function handleDelete(record: Recordable<any>) {
    emit('delete', record);
  }

  function handlePreviewDelete(url: string) {
    emit('preview-delete', url);
  }
</script>
