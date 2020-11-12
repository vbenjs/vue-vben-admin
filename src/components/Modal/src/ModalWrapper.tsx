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

import { useWindowSizeFn } from '/@/hooks/event/useWindowSizeFn';

import { getSlot } from '/@/utils/helper/tsxHelper';
import { useElResize } from '/@/hooks/event/useElResize';
import { provideModal } from './provideModal';

export default defineComponent({
  name: 'ModalWrapper',
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
  emits: ['heightChange', 'getExtHeight'],
  setup(props: ModalWrapperProps, { slots, emit }) {
    const wrapperRef = ref<HTMLElement | null>(null);
    const spinRef = ref<any>(null);
    const realHeightRef = ref(0);
    // 重试次数
    // let tryCount = 0;
    let stopElResizeFn: Fn = () => {};

    provideModal(setModalHeight);

    const wrapStyle = computed(() => {
      return {
        minHeight: `${props.minHeight}px`,
        height: `${unref(realHeightRef)}px`,
        overflow: 'auto',
      };
    });

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

    useWindowSizeFn(setModalHeight);

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

        const spinContainerEl = spinEl.$el.querySelector('.ant-spin-container') as HTMLElement;
        if (!spinContainerEl) return;

        const realHeight = spinContainerEl.scrollHeight;

        if (props.fullScreen) {
          realHeightRef.value =
            window.innerHeight - props.modalFooterHeight - props.modalHeaderHeight - 6;
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
