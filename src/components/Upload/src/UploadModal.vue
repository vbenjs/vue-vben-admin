<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    @ok="handleOk"
    :closeFunc="handleCloseFunc"
    :maskClosable="false"
    width="800px"
    title="上传组件"
    wrapClassName="upload-modal"
    :okButtonProps="{ disabled: isUploadingRef }"
    :cancelButtonProps="{ disabled: isUploadingRef }"
  >
    <template #centerdFooter>
      <a-button @click="handleStartUpload" color="success" :loading="isUploadingRef">
        {{ isUploadingRef ? '上传中' : '开始上传' }}
      </a-button>
    </template>
    <Upload :accept="getStringAccept" :multiple="multiple" :before-upload="beforeUpload">
      <a-button type="primary"> 选择文件 </a-button>
      <span class="px-2">{{ getHelpText }}</span>
    </Upload>
    <BasicTable @register="registerTable" :dataSource="fileListRef" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, toRef, unref } from 'vue';
  import { Upload } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  // hooks
  import { useUploadType } from './useUpload';
  import { useMessage } from '/@/hooks/web/useMessage';
  //   types
  import { FileItem, UploadResultStatus } from './types';
  import { basicProps } from './props';
  import { createTableColumns, createActionColumn } from './data';
  // utils
  import { checkFileType, checkImgType, getBase64WithFile } from './utils';
  import { buildUUID } from '/@/utils/uuid';
  import { createImgPreview } from '/@/components/Preview/index';
  import { uploadApi } from '/@/api/demo/upload';

  export default defineComponent({
    components: { BasicModal, Upload, BasicTable },
    props: basicProps,
    setup(props, { emit }) {
      const [register, { closeModal }] = useModalInner();
      const { getAccept, getStringAccept, getHelpText } = useUploadType({
        acceptRef: toRef(props, 'accept'),
        helpTextRef: toRef(props, 'helpText'),
        maxNumberRef: toRef(props, 'maxNumber'),
        maxSizeRef: toRef(props, 'maxSize'),
      });

      const fileListRef = ref<FileItem[]>([]);
      const state = reactive<{ fileList: FileItem[] }>({ fileList: [] });
      const { createMessage } = useMessage();
      // 上传前校验
      function beforeUpload(file: File) {
        const { size, name } = file;
        const { maxSize } = props;
        const accept = unref(getAccept);

        // 设置最大值，则判断
        if (maxSize && file.size / 1024 / 1024 >= maxSize) {
          createMessage.error(`只能上传不超过${maxSize}MB的文件!`);
          return false;
        }

        // 设置类型,则判断
        if (accept.length > 0 && !checkFileType(file, accept)) {
          createMessage.error!(`只能上传${accept.join(',')}格式文件`);
          return false;
        }
        // 生成图片缩略图
        if (checkImgType(file)) {
          // beforeUpload，如果异步会调用自带上传方法
          // file.thumbUrl = await getBase64(file);
          getBase64WithFile(file).then(({ result: thumbUrl }) => {
            fileListRef.value = [
              ...unref(fileListRef),
              {
                uuid: buildUUID(),
                file,
                thumbUrl,
                size,
                name,
                percent: 0,
                type: name.split('.').pop(),
              },
            ];
          });
        } else {
          fileListRef.value = [
            ...unref(fileListRef),
            {
              uuid: buildUUID(),

              file,
              size,
              name,
              percent: 0,
              type: name.split('.').pop(),
            },
          ];
        }
        return false;
      }
      // 删除
      function handleRemove(record: FileItem) {
        const index = fileListRef.value.findIndex((item) => item.uuid === record.uuid);
        index !== -1 && fileListRef.value.splice(index, 1);
      }
      // 预览
      function handlePreview(record: FileItem) {
        const { thumbUrl = '' } = record;
        createImgPreview({
          imageList: [thumbUrl],
        });
      }
      const [registerTable] = useTable({
        columns: createTableColumns(),
        actionColumn: createActionColumn(handleRemove, handlePreview),
        pagination: false,
      });
      //   是否正在上传
      const isUploadingRef = ref(false);
      async function uploadApiByItem(item: FileItem) {
        try {
          item.status = UploadResultStatus.UPLOADING;

          const { data } = await uploadApi(
            {
              file: item.file,
            },
            function onUploadProgress(progressEvent: ProgressEvent) {
              const complete = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
              item.percent = complete;
            }
          );
          item.status = UploadResultStatus.SUCCESS;
          item.responseData = data;
          return {
            success: true,
            error: null,
          };
        } catch (e) {
          console.log(e);
          item.status = UploadResultStatus.ERROR;
          return {
            success: false,
            error: e,
          };
        }
      }
      // 点击开始上传
      async function handleStartUpload() {
        try {
          isUploadingRef.value = true;
          const data = await Promise.all(
            unref(fileListRef).map((item) => {
              return uploadApiByItem(item);
            })
          );
          isUploadingRef.value = false;
          // 生产环境:抛出错误
          const errorList = data.filter((item) => !item.success);
          if (errorList.length > 0) {
            throw errorList;
          }
        } catch (e) {
          isUploadingRef.value = false;
          throw e;
        }
      }
      //   点击保存
      function handleOk() {
        // TODO： 没起作用：okButtonProps={{ disabled: state.isUploading }}
        if (isUploadingRef.value) {
          createMessage.warning('请等待文件上传后，保存');
          return;
        }
        const fileList: string[] = [];

        for (const item of fileListRef.value) {
          const { status, responseData } = item;
          if (status === UploadResultStatus.SUCCESS && responseData) {
            fileList.push(responseData.url);
          }
        }

        // 存在一个上传成功的即可保存

        if (fileList.length <= 0) {
          createMessage.warning('没有上传成功的文件，无法保存');
          return;
        }
        console.log(fileList);
        emit('change', fileList);
        fileListRef.value = [];
        closeModal();
      }
      // 点击关闭：则所有操作不保存，包括上传的
      function handleCloseFunc() {
        if (!isUploadingRef.value) {
          fileListRef.value = [];
          return true;
        } else {
          createMessage.warning('请等待文件上传结束后操作');
          return false;
        }
      }
      return {
        register,
        closeModal,
        getHelpText,
        getStringAccept,
        beforeUpload,
        registerTable,
        fileListRef,
        state,
        isUploadingRef,
        handleStartUpload,
        handleOk,
        handleCloseFunc,
      };
    },
  });
</script>
<style lang="less">
  //   /deep/ .ant-upload-list {
  //     display: none;
  //   }
  .upload-modal {
    .ant-upload-list {
      display: none;
    }

    .ant-table-wrapper .ant-spin-nested-loading {
      padding: 0;
    }
  }
</style>
