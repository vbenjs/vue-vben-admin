<script lang="tsx">
  import { defineComponent, PropOptions, ref, unref, onMounted, nextTick } from 'compatible-vue';
  import { Spin } from 'ant-design-vue';

  import { menuStore } from '@/store/modules/menu';

  import { useDesign } from '@/hooks/core/useDesign';

  import { getViewportOffset } from '@/utils/domUtils';
  import { useWindowSizeFn } from '@/hooks/event/useWindowSize';
  export default defineComponent({
    name: 'IFrame',
    props: {
      frameSrc: {
        type: String,
      } as PropOptions<string>,
    },
    setup(props) {
      const { prefixCls } = useDesign('iframe-page');

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
      return () => {
        const { frameSrc } = props;
        return (
          <Spin
            class={prefixCls}
            style={{ height: `${unref(heightRef)}px` }}
            spinning={unref(loadingRef)}
            size="large"
          >
            {
              // 菜单拖拽的时候，展示，解决拖动事件到iframe卡住
            }
            <div v-show={menuStore.getDragStartState} class={`${prefixCls}__mask`} />
            <iframe src={frameSrc} class={`${prefixCls}__main`} ref={frameRef} />
          </Spin>
        );
      };
    },
  });
</script>
<style lang="less">
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-iframe-page';

  .@{prefix-cls} {
    position: relative;

    .ant-spin-container {
      width: 100%;
      height: 100%;
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
