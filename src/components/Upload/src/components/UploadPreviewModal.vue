<template>
  <BasicModal
    width="800px"
    :title="t('component.upload.preview')"
    class="upload-preview-modal"
    v-bind="$attrs"
    @register="register"
    :showOkBtn="false"
  >
    <FileList :dataSource="fileListRef" :columns="columns" :actionColumn="actionColumn" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { watch, ref } from 'vue';
  import FileList from './FileList.vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { handleFnKey, previewProps } from '../props';
  import { BaseFileItem, FileBasicColumn, PreviewFileItem } from '../types/typing';
  import { downloadByUrl } from '@/utils/file/download';
  import { createPreviewColumns, createPreviewActionColumn } from './data';
  import { useI18n } from '@/hooks/web/useI18n';
  import { isArray, isFunction } from '@/utils/is';
  import { BasicColumn } from '@/components/Table';
  import { useMessage } from '@/hooks/web/useMessage';
  import { buildUUID } from '@/utils/uuid';

  const { createMessage } = useMessage();

  const props = defineProps(previewProps);

  const emit = defineEmits(['list-change', 'register', 'delete']);

  let columns: BasicColumn[] | FileBasicColumn[] = createPreviewColumns();
  let actionColumn: any;

  const [register] = useModalInner();
  const { t } = useI18n();

  const fileListRef = ref<BaseFileItem[] | Array<any>>([]);
  watch(
    () => props.previewColumns,
    () => {
      if (Array.isArray(props.previewColumns) && props.previewColumns.length) {
        columns = props.previewColumns;
        actionColumn = null;
      } else if (isFunction(props.previewColumns)) {
        columns = props.previewColumns({ handleRemove, handleAdd });
      } else {
        columns = createPreviewColumns();
        actionColumn = createPreviewActionColumn({ handleRemove, handleDownload });
      }
    },
    { immediate: true },
  );

  watch(
    () => props.value,
    (value) => {
      if (!isArray(value)) value = [];
      if (props.beforePreviewData) {
        value = props.beforePreviewData(value) as any;
        fileListRef.value = value;
        return;
      }
      fileListRef.value = value
        .filter((item) => !!item)
        .map((item) => {
          if (typeof item != 'object') {
            console.error('return value should be object');
            return;
          }
          return {
            uid: item?.uid,
            url: item?.url,
            type: item?.url?.split('.').pop() || '',
            name: item?.url?.split('/').pop() || '',
          };
        });
    },
    { immediate: true },
  );

  // 删除
  function handleRemove(obj: Record<handleFnKey, any>) {
    let { record = {}, valueKey = 'url', uidKey = 'uid' } = obj;
    const index = fileListRef.value.findIndex((item) => item[uidKey] === record[uidKey]);
    if (index !== -1) {
      const removed = fileListRef.value.splice(index, 1);
      emit('delete', removed[0][uidKey]);
      emit('list-change', fileListRef.value, valueKey);
    }
  }
  // 添加
  function handleAdd(obj: Record<handleFnKey, any>) {
    let { record = {}, valueKey = 'url', uidKey = 'uid' } = obj;
    const { maxNumber } = props;
    if (fileListRef.value.length + fileListRef.value.length > maxNumber) {
      return createMessage.warning(t('component.upload.maxNumber', [maxNumber]));
    }
    record[uidKey] = record[uidKey] ?? buildUUID();
    fileListRef.value = [...fileListRef.value, record];
    emit('list-change', fileListRef.value, valueKey);
  }
  // 下载
  function handleDownload(record: PreviewFileItem) {
    const { url = '' } = record;
    downloadByUrl({ url });
  }
</script>
<style lang="less">
  .upload-preview-modal {
    .ant-upload-list {
      display: none;
    }

    .ant-table-wrapper .ant-spin-nested-loading {
      padding: 0;
    }
  }
</style>
