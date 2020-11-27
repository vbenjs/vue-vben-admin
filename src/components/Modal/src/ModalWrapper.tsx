import type { ModalWrapperProps } from './types';
import type { CSSProperties } from 'vue';

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

import { useWindowSizeFn } from '/@/hooks/event/useWindowSizeFn';

import { getSlot } from '/@/utils/helper/tsxHelper';
import { useElResize } from '/@/hooks/event/useElResize';
import { propTypes } from '/@/utils/propTypes';
import { createModalContext } from './useModalContext';

export default defineComponent({
  name: 'ModalWrapper',
  props: {
    loading: propTypes.bool,
    modalHeaderHeight: propTypes.number.def(50),
    modalFooterHeight: propTypes.number.def(54),
    minHeight: propTypes.number.def(200),
    footerOffset: propTypes.number.def(0),
    visible: propTypes.bool,
    fullScreen: propTypes.bool,
  },
  emits: ['heightChange', 'getExtHeight'],
  setup(props: ModalWrapperProps, { slots, emit }) {
    const wrapperRef = ref<ElRef>(null);
    const spinRef = ref<ComponentRef>(null);
    const realHeightRef = ref(0);

    let stopElResizeFn: Fn = () => {};

    useWindowSizeFn(setModalHeight);

    createModalContext({
      redoModalHeight: setModalHeight,
    });

    const wrapStyle = computed(
      (): CSSProperties => {
        return {
          minHeight: `${props.minHeight}px`,
          height: `${unref(realHeightRef)}px`,
          overflow: 'auto',
        };
      }
    );

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

    onUnmounted(() => {
      stopElResizeFn && stopElResizeFn();
    });

    async function setModalHeight() {
      // 解决在弹窗关闭的时候监听还存在,导致再次打开弹窗没有高度
      // 加上这个,就必须在使用的时候传递父级的visible
      if (!props.visible) return;
      const wrapperRefDom = unref(wrapperRef);
      if (!wrapperRefDom) return;
      const bodyDom = wrapperRefDom.parentElement;
      if (!bodyDom) return;
      bodyDom.style.padding = '0';
      await nextTick();

      try {
        const modalDom = bodyDom.parentElement && bodyDom.parentElement.parentElement;
        if (!modalDom) return;

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

        if (!spinEl) return;

        const spinContainerEl = spinEl.$el.querySelector('.ant-spin-container') as HTMLElement;
        if (!spinContainerEl) return;

        const realHeight = spinContainerEl.scrollHeight;

        if (props.fullScreen) {
          realHeightRef.value =
            window.innerHeight - props.modalFooterHeight - props.modalHeaderHeight;
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
      stopElResizeFn = stop;
      start();
    }

    return () => {
      return (
        <div ref={wrapperRef} style={unref(wrapStyle)}>
          <Spin ref={spinRef} spinning={props.loading}>
            {() => getSlot(slots)}
          </Spin>
        </div>
      );
    };
  },
});
