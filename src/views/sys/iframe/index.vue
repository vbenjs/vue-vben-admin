<template>
  <div :class="prefixCls" :style="getWrapStyle">
    <Spin :spinning="loading" size="large" :style="getWrapStyle">
      <iframe
        :src="frameSrc"
        :class="`${prefixCls}__main`"
        ref="frameRef"
        @load="hideLoading"
      ></iframe>
    </Spin>
  </div>
</template>
<script lang="ts" setup>
  import type { CSSProperties } from 'vue';
  import { ref, unref, computed, onMounted, onUnmounted } from 'vue';
  import { Spin } from 'ant-design-vue';
  import { useWindowSizeFn } from '@vben/hooks';
  import { propTypes } from '@/utils/propTypes';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useLayoutHeight } from '@/layouts/default/content/useContentViewHeight';

  const emit = defineEmits(['message']);
  defineProps({
    frameSrc: propTypes.string.def(''),
  });

  const loading = ref(true);
  const topRef = ref(50);
  const heightRef = ref(window.innerHeight);
  const frameRef = ref<HTMLFrameElement>();
  const { headerHeightRef } = useLayoutHeight();

  const { prefixCls } = useDesign('iframe-page');
  useWindowSizeFn(calcHeight, { wait: 150, immediate: true });

  const getWrapStyle = computed((): CSSProperties => {
    return {
      height: `${unref(heightRef)}px`,
    };
  });

  function calcHeight() {
    const iframe = unref(frameRef);
    if (!iframe) {
      return;
    }
    const top = headerHeightRef.value;
    topRef.value = top;
    heightRef.value = window.innerHeight - top;
    const clientHeight = document.documentElement.clientHeight - top;
    iframe.style.height = `${clientHeight}px`;
  }

  function hideLoading() {
    loading.value = false;
    calcHeight();
  }

  const messageHandler = (e: MessageEvent) => {
    emit('message', e.data);
  };

  const postMessage = (message: any, tragetOrigin: string, transfer?: Transferable[]) => {
    const iframe = unref(frameRef);
    if (!iframe) return;
    iframe.contentWindow?.postMessage(message, tragetOrigin, transfer);
  };

  const reload = () => {
    loading.value = true;
    const iframe = frameRef.value;
    if (!iframe) return;
    iframe.contentWindow?.location.reload();
    loading.value = false;
  };

  onMounted(() => {
    window.addEventListener('message', messageHandler);
  });

  onUnmounted(() => {
    window.removeEventListener('message', messageHandler);
  });

  defineExpose({ postMessage, reload });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-iframe-page';

  .@{prefix-cls} {
    .ant-spin-nested-loading {
      position: relative;
      height: 100%;

      .ant-spin-container {
        width: 100%;
        height: 100%;
        padding: 10px;
      }
    }

    &__mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    &__main {
      display: block;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border: 0;
      background-color: @component-background;
    }
  }
</style>
