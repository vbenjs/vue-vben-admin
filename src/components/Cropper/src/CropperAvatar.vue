<template>
  <div :class="getClass" :style="getStyle">
    <div :class="`${prefixCls}-image-wrapper`" :style="getImageWrapperStyle" @click="openModal">
      <img :src="sourceValue" v-if="sourceValue" alt="avatar" />
    </div>
    <a-button :class="`${prefixCls}-upload-btn`" @click="openModal">
      {{ t('component.cropper.selectImage') }}
    </a-button>
    <CopperModal @register="register" @uploadSuccess="handleUploadSuccess" :uploadApi="uploadApi" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed, CSSProperties, unref, ref } from 'vue';
  import CopperModal from './CopperModal.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  const props = {
    width: { type: [String, Number], default: '200px' },
    uploadApi: { type: Function as PropType<({ file: Blob, name: string }) => Promise<void>> },
  };

  export default defineComponent({
    name: 'CropperAvatar',
    components: { CopperModal },
    props,
    setup(props) {
      const sourceValue = ref('');
      const { prefixCls } = useDesign('cropper-avatar');
      const [register, { openModal }] = useModal();
      const { createMessage } = useMessage();
      const { t } = useI18n();

      const getClass = computed(() => [prefixCls]);

      const getWidth = computed(() => `${props.width}`.replace(/px/, '') + 'px');

      const getStyle = computed((): CSSProperties => ({ width: unref(getWidth) }));

      const getImageWrapperStyle = computed(
        (): CSSProperties => ({ width: unref(getWidth), height: unref(getWidth) })
      );

      function handleUploadSuccess({ source }) {
        sourceValue.value = source;
        createMessage.success(t('component.cropper.uploadSuccess'));
      }

      return {
        t,
        prefixCls,
        register,
        openModal,
        sourceValue,
        getClass,
        getImageWrapperStyle,
        getStyle,
        handleUploadSuccess,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-cropper-avatar';

  .@{prefix-cls} {
    display: inline-block;
    text-align: center;

    &-image-wrapper {
      overflow: hidden;
      cursor: pointer;
      background: @component-background;
      border: 1px solid @border-color-base;
      border-radius: 50%;

      img {
        width: 100%;
      }
    }

    &-upload-btn {
      margin: 10px auto;
    }
  }
</style>
