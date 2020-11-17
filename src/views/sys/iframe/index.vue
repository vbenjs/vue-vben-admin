<template>
  <div class="iframe-page" :style="getWrapStyle">
    <Spin :spinning="loading" size="large" :style="getWrapStyle">
      <iframe :src="frameSrc" class="iframe-page__main" ref="frameRef" />
    </Spin>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, unref, onMounted, nextTick, computed } from 'vue';
  import { Spin } from 'ant-design-vue';

  import { getViewportOffset } from '/@/utils/domUtils';
  import { useWindowSizeFn } from '/@/hooks/event/useWindowSizeFn';

  export default defineComponent({
    name: 'IFrame',
    components: { Spin },
    props: {
      frameSrc: {
        type: String as PropType<string>,
      },
    },
    setup() {
      const loadingRef = ref(false);
      const topRef = ref(50);
      const heightRef = ref(window.innerHeight);
      const frameRef = ref<HTMLElement | null>(null);

      function calcHeight() {
        const iframe = unref(frameRef);
        if (!iframe) {
          return;
        }
        let { top } = getViewportOffset(iframe);
        top += 20;
        topRef.value = top;
        heightRef.value = window.innerHeight - top;
        const clientHeight = document.documentElement.clientHeight - top;
        iframe.style.height = `${clientHeight}px`;
      }

      useWindowSizeFn(calcHeight, 150, { immediate: true });

      function hideLoading() {
        loadingRef.value = false;
        calcHeight();
      }

      function init() {
        nextTick(() => {
          const iframe = unref(frameRef);
          if (!iframe) {
            return;
          }
          if ((iframe as any).attachEvent) {
            (iframe as any).attachEvent('onload', () => {
              hideLoading();
            });
          } else {
            iframe.onload = () => {
              hideLoading();
            };
          }
        });
      }
      onMounted(() => {
        loadingRef.value = true;
        init();
      });
      return {
        getWrapStyle: computed(() => {
          return {
            height: `${unref(heightRef)}px`,
          };
        }),
        loading: loadingRef,
        frameRef,
      };
    },
  });
</script>
<style lang="less" scoped>
  .iframe-page {
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
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #fff;
      border: 0;
      box-sizing: border-box;
    }
  }
</style>
