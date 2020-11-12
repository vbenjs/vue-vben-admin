<template>
  <div>
    <a-button-group>
      <a-button type="primary" @click="openUploadModal">上传</a-button>
      <a-button @click="openPreviewModal">
        <Icon icon="ant-design:eye-outlined" />
      </a-button>
    </a-button-group>
    <UploadModal v-bind="$props" @register="registerUploadModal" @change="handleChange" />
    <UploadPreviewModal
      :value="fileListRef"
      @register="registerPreviewModal"
      @change="handlePreviewChange"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, watch, unref } from 'vue';
  import { useModal } from '/@/components/Modal';
  import UploadModal from './UploadModal.vue';
  import { uploadContainerProps } from './props';
  import UploadPreviewModal from './UploadPreviewModal.vue';
  import Icon from '/@/components/Icon/index';
  export default defineComponent({
    components: { UploadModal, UploadPreviewModal, Icon },
    props: uploadContainerProps,
    setup(props, { emit }) {
      // 上传modal
      const [registerUploadModal, { openModal: openUploadModal }] = useModal();
      //   预览modal
      const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();

      const fileListRef = ref<string[]>([]);
      watch(
        () => props.value,
        (value) => {
          fileListRef.value = [...(value || [])];
        },
        { immediate: true }
      );
      // 上传modal保存操作
      function handleChange(urls: string[]) {
        fileListRef.value = [...unref(fileListRef), ...(urls || [])];
        emit('change', fileListRef.value);
      }
      // 预览modal保存操作
      function handlePreviewChange(urls: string[]) {
        fileListRef.value = [...(urls || [])];
        emit('change', fileListRef.value);
      }
      return {
        registerUploadModal,
        openUploadModal,
        handleChange,
        handlePreviewChange,
        registerPreviewModal,
        openPreviewModal,
        fileListRef,
      };
    },
  });
</script>
