<template>
  <div>
    <a-button-group>
      <a-button type="primary" @click="openUploadModal" preIcon="carbon:cloud-upload">
        {{ t('component.upload.upload') }}
      </a-button>
      <Tooltip placement="bottom" v-if="showPreview">
        <template #title>
          {{ t('component.upload.uploaded') }}
          <template v-if="fileListRef.length">
            {{ fileListRef.length }}
          </template>
        </template>
        <a-button @click="openPreviewModal">
          <Icon icon="bi:eye" />
          <template v-if="fileListRef.length && showPreviewNumber">
            {{ fileListRef.length }}
          </template>
        </a-button>
      </Tooltip>
    </a-button-group>

    <UploadModal
      v-bind="bindValue"
      :previewFileList="fileListRef"
      @register="registerUploadModal"
      @change="handleChange"
    />

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
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    name: 'BasicUpload',
    components: { UploadModal, UploadPreviewModal, Icon, Tooltip },
    props: uploadContainerProps,
    emits: ['change'],

    setup(props, { emit, attrs }) {
      const { t } = useI18n();
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
        t,
      };
    },
  });
</script>
