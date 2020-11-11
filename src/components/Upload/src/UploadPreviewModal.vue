<template>
  <BasicModal
    wrapClassName="upload-preview-modal"
    v-bind="$attrs"
    width="800px"
    @register="register"
    title="预览"
    :showOkBtn="false"
  >
    <BasicTable @register="registerTable" :dataSource="fileListRef" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, watch, ref, unref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { createPreviewColumns, createPreviewActionColumn } from './data';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { priviewProps } from './props';
  import { PreviewFileItem } from './types';
  import { createImgPreview } from '/@/components/Preview/index';
  import { downloadByUrl } from '/@/utils/file/FileDownload';

  export default defineComponent({
    components: { BasicModal, BasicTable },
    props: priviewProps,
    setup(props, { emit }) {
      const [register, { closeModal }] = useModalInner();
      const fileListRef = ref<PreviewFileItem[]>([]);
      watch(
        () => props.value,
        (value) => {
          fileListRef.value = [];
          value.forEach((item) => {
            fileListRef.value = [
              ...unref(fileListRef),
              {
                url: item,
                type: item.split('.').pop() || '',
                name: item.split('/').pop() || '',
              },
            ];
          });
        },
        { immediate: true }
      );
      // 删除
      function handleRemove(record: PreviewFileItem) {
        const index = fileListRef.value.findIndex((item) => item.url === record.url);
        if (index !== -1) {
          fileListRef.value.splice(index, 1);
          emit(
            'change',
            fileListRef.value.map((item) => item.url)
          );
        }
      }
      // 预览
      function handlePreview(record: PreviewFileItem) {
        const { url = '' } = record;
        createImgPreview({
          imageList: [url],
        });
      }
      // 下载
      function handleDownload(record: PreviewFileItem) {
        const { url = '' } = record;
        downloadByUrl({ url });
      }
      const [registerTable] = useTable({
        columns: createPreviewColumns(),
        pagination: false,
        actionColumn: createPreviewActionColumn({ handleRemove, handlePreview, handleDownload }),
      });
      return {
        register,
        closeModal,
        fileListRef,
        registerTable,
      };
    },
  });
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
