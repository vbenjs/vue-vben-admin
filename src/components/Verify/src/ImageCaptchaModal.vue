<template>
  <BasicModal
    centered
    v-bind="$attrs"
    :width="computedModalWidth"
    @open-change="handleVisibleChange"
    :wrapClassName="prefixCls"
    :footer="null"
    @register="registerModal"
  >
    <ImageCaptcha ref="dragRef" v-bind="$attrs" :type="type" />
    <div class="bottom">
      <Icon
        @click="refresh"
        class="icon"
        style="margin-right: 5px"
        size="22px"
        icon="ant-design:reload-outlined"
      />
      <Icon @click="closeModal" class="icon" size="22px" icon="ant-design:close-circle-outlined" />
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, ref, unref } from 'vue';
  import { propTypes } from '@/utils/propTypes';
  import { BasicModal, useModalInner } from '@/components/Modal';

  import { ImageCaptchaType } from '@/components/Verify';
  import ImageCaptcha from './ImageCaptcha.vue';
  import { Icon } from '@/components/Icon';
  import { useDesign } from '@/hooks/web/useDesign';

  const { prefixCls } = useDesign('smart-component-imageCaptchaModal');

  const props = defineProps({
    type: {
      type: String as PropType<ImageCaptchaType>,
      required: true,
    },
    // 图片宽度
    width: propTypes.number.def(320),
  });

  const dragRef = ref();

  const [registerModal, { closeModal }] = useModalInner();

  const computedModalWidth = computed(() => {
    return props.width + 28;
  });

  const handleVisibleChange = (visible: boolean) => {
    if (visible) {
      unref(dragRef)?.refresh();
    }
  };
  const refresh = () => {
    unref(dragRef)?.refresh();
  };
  defineExpose({
    refresh,
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-smart-component-imageCaptchaModal';
  .@{prefix-cls} {
    .ant-modal-header {
      display: none;
    }

    .ant-modal-close {
      display: none;
    }

    .scrollbar__wrap {
      margin-bottom: 0 !important;
    }

    .bottom {
      margin-top: 5px;
      text-align: right;

      .icon {
        cursor: pointer;
      }
    }
  }
</style>
