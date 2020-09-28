import type { PropType } from 'vue';
import type { ModalWrapperProps } from './types';

import {
  defineComponent,
  computed,
  ref,
  watchEffect,
  unref,
  watch,
  onMounted,
  nextTick,
  onUnmounted,
} from 'vue';
import { Spin } from 'ant-design-vue';
import { ScrollContainer } from '/@/components/Container/index';

import { useWindowSizeFn } from '/@/hooks/event/useWindowSize';
import { useTimeout } from '/@/hooks/core/useTimeout';

import { getSlot } from '/@/utils/helper/tsxHelper';
import { useElResize } from '/@/hooks/event/useElResize';
export default defineComponent({
  name: 'ModalWrapper',
  emits: ['heightChange', 'getExtHeight'],
  props: {
    loading: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    modalHeaderHeight: {
      type: Number as PropType<number>,
      default: 50,
    },
    modalFooterHeight: {
      type: Number as PropType<number>,
      default: 70,
    },
    minHeight: {
      type: Number as PropType<number>,
      default: 200,
    },
    footerOffset: {
      type: Number as PropType<number>,
      default: 0,
    },
    visible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    fullScreen: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  setup(props: ModalWrapperProps, { slots, emit }) {
    const wrapperRef = ref<HTMLElement | null>(null);
    const spinRef = ref<any>(null);
    const realHeightRef = ref(0);

    const wrapStyle = computed(() => {
      return {
        minHeight: `${props.minHeight}px`,
        overflow: 'hidden',
      };
    });

    // 重试次数
    let tryCount = 0;
    async function setModalHeight() {
      // 解决在弹窗关闭的时候监听还存在,导致再次打开弹窗没有高度
      // 加上这个,就必须在使用的时候传递父级的visible
      if (!props.visible) {
        return;
      }
      const wrapperRefDom = unref(wrapperRef);
      if (!wrapperRefDom) {
        return;
      }
      const bodyDom = wrapperRefDom.parentElement;
      if (!bodyDom) {
        return;
      }
      bodyDom.style.padding = '0';
      await nextTick();

      try {
        const modalDom = bodyDom.parentElement && bodyDom.parentElement.parentElement;
        if (!modalDom) {
          return;
        }
        const modalRect = getComputedStyle(modalDom).top;
        const modalTop = Number.parseInt(modalRect);
        let maxHeight =
          window.innerHeight -
          modalTop * 2 +
          (props.footerOffset! || 0) -
          props.modalFooterHeight -
          props.modalHeaderHeight;

        // 距离顶部过进会出现滚动条
        if (modalTop < 40) {
          maxHeight -= 26;
        }
        await nextTick();
        const spinEl = unref(spinRef);
        if (!spinEl) {
          useTimeout(() => {
            // retry
            if (tryCount < 3) {
              setModalHeight();
            }
            tryCount++;
          }, 10);
          return;
        }
        tryCount = 0;

        const realHeight = (spinEl.$el.querySelector('.ant-spin-container') as HTMLElement)
          .scrollHeight;

        //  16为 p-2和m-2  加起来为4,基础4, 4*4=16
        // 32 padding
        if (props.fullScreen) {
          realHeightRef.value =
            window.innerHeight - props.modalFooterHeight - props.modalHeaderHeight - 26;
        } else {
          realHeightRef.value = realHeight > maxHeight ? maxHeight : realHeight + 16 + 30;
        }
        emit('heightChange', unref(realHeightRef));
        nextTick(() => {
          const el = spinEl.$el;
          if (el) {
            el.style.height = `${unref(realHeightRef)}px`;
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
    function listenElResize() {
      const wrapper = unref(wrapperRef);
      if (!wrapper) return;
      const container = wrapper.querySelector('.ant-spin-container');
      if (!container) return;
      const [start, stop] = useElResize(container, () => {
        setModalHeight();
      });
      start();
      onUnmounted(() => {
        stop();
      });
    }
    nextTick(() => {});
    watchEffect(() => {
      setModalHeight();
    });
    watch(
      () => props.fullScreen,
      (v) => {
        !v && setModalHeight();
      }
    );

    onMounted(() => {
      const { modalHeaderHeight, modalFooterHeight } = props;
      emit('getExtHeight', modalHeaderHeight + modalFooterHeight);
      listenElResize();
    });

    useWindowSizeFn(setModalHeight);

    return () => {
      const height = unref(realHeightRef);
      return (
        <div ref={wrapperRef} style={unref(wrapStyle)}>
          <ScrollContainer>
            {() => (
              <Spin ref={spinRef} spinning={props.loading} style={{ height: `${height}px` }}>
                {() => getSlot(slots)}
              </Spin>
            )}
          </ScrollContainer>
        </div>
      );
    };
  },
});
