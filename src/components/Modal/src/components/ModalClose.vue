<template>
  <div :class="getClass">
    <template v-if="canFullscreen">
      <FullscreenExitOutlined role="full" @click="handleFullScreen" v-if="fullScreen" />

      <FullscreenOutlined role="close" @click="handleFullScreen" v-else />
    </template>
    <CloseOutlined @click="handleCancel" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { FullscreenExitOutlined, FullscreenOutlined, CloseOutlined } from '@ant-design/icons-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'ModalClose',
    components: { FullscreenExitOutlined, FullscreenOutlined, CloseOutlined },
    props: {
      canFullscreen: propTypes.bool.def(true),
      fullScreen: propTypes.bool,
    },
    emits: ['cancel', 'fullscreen'],
    setup(props, { emit }) {
      const { prefixCls } = useDesign('basic-modal-close');

      const getClass = computed(() => {
        return [
          prefixCls,
          `${prefixCls}--custom`,
          {
            [`${prefixCls}--can-full`]: props.canFullscreen,
          },
        ];
      });

      function handleCancel() {
        emit('cancel');
      }
      function handleFullScreen(e: Event) {
        e?.stopPropagation();
        e?.preventDefault();
        emit('fullscreen');
      }

      return {
        getClass,
        prefixCls,
        handleCancel,
        handleFullScreen,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-modal-close';
  .@{prefix-cls} {
    display: flex;
    height: 95%;
    align-items: center;

    > span {
      margin-left: 48px;
      font-size: 16px;
    }

    &--can-full {
      > span {
        margin-left: 12px;
      }
    }

    &:not(&--can-full) {
      > span:nth-child(1) {
        &:hover {
          font-weight: 700;
        }
      }
    }

    & span:nth-child(1) {
      display: inline-block;
      padding: 10px;

      &:hover {
        color: @primary-color;
      }
    }

    & span:nth-child(2) {
      &:hover {
        color: @error-color;
      }
    }
  }
</style>
