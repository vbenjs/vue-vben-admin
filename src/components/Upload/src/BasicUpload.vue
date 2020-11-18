<template>
  <div>
    <a-button-group>
      <a-button type="primary" @click="openUploadModal" preIcon="ant-design:cloud-upload-outlined">
        上传
      </a-button>
      <Tooltip placement="bottom" v-if="showPreview">
        <template #title>
          已上传
          <template v-if="fileListRef.length">{{ fileListRef.length }}</template>
        </template>
        <a-button @click="openPreviewModal">
          <Icon icon="ant-design:eye-outlined" />
          <template v-if="fileListRef.length && showPreviewNumber">
            {{ fileListRef.length }}
          </template>
        </a-button>
      </Tooltip>
    </a-button-group>

    <UploadModal v-bind="bindValue" @register="registerUploadModal" @change="handleChange" />

    <UploadPreviewModal
      :value="fileListRef"
      @register="registerPreviewModal"
      @list-change="handlePreviewChange"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, watch, unref, computed } from 'vue';

  import UploadModal from './UploadModal.vue';
  import UploadPreviewModal from './UploadPreviewModal.vue';
  import Icon from '/@/components/Icon';
  import { Tooltip } from 'ant-design-vue';

  import { useModal } from '/@/components/Modal';

  import { uploadContainerProps } from './props';
  import { omit } from 'lodash-es';

  export default defineComponent({
    name: 'BasicUpload',
    components: { UploadModal, UploadPreviewModal, Icon, Tooltip },
    props: uploadContainerProps,
    setup(props, { emit, attrs }) {
      // 上传modal
      const [registerUploadModal, { openModal: openUploadModal }] = useModal();

      //   预览modal
      const [registerPreviewModal, { openModal: openPreviewModal }] = useModal();

      const fileListRef = ref<string[]>([]);

      const showPreview = computed(() => {
        const { emptyHidePreview } = props;
        if (!emptyHidePreview) return true;
        return emptyHidePreview ? fileListRef.value.length > 0 : true;
      });

      const bindValue = computed(() => {
        const value = { ...attrs, ...props };
        return omit(value, 'onChange');
      });

      watch(
        () => props.value,
        (value = []) => {
          fileListRef.value = value;
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
        showPreview,
        bindValue,
      };
    },
  });
</script>
