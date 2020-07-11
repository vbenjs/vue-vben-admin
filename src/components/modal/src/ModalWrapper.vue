<script lang="tsx">
  import {
    defineComponent,
    computed,
    ref,
    watchEffect,
    unref,
    // watch,
    PropOptions,
  } from '@/setup/vue';
  import { Spin } from 'ant-design-vue';
  import { ScrollContainer, TypeEnum } from '@/components/container/index';

  import { useWindowSizeFn } from '@/hooks/event/useWindowSize';
  import { useTimeout } from '@/hooks/core/useTimeout';

  import { ModalWrapperProps } from './types';

  import { getSlot } from '@/utils/helper/tsxHelper';
  export default defineComponent({
    name: 'ModalWrapper',
    props: {
      loading: {
        type: Boolean,
        default: false,
      } as PropOptions<boolean>,
      modalHeaderHeight: {
        type: Number,
        default: 50,
      } as PropOptions<number>,
      modalFooterHeight: {
        type: Number,
        default: 70,
      } as PropOptions<number>,
      minHeight: {
        type: Number,
        default: 200,
      } as PropOptions<number>,
      visible: {
        type: Boolean,
        default: false,
      } as PropOptions<boolean>,
    },
    setup(props: ModalWrapperProps, { root, slots, emit }) {
      const wrapperRef = ref<HTMLElement | null>(null);
      const spinRef = ref<Spin | null>(null);
      // const maxHeightRef = ref(window.innerHeight);

      const realHeightRef = ref(0);

      const wrapStyle = computed(() => {
        return {
          minHeight: `${props.minHeight}px`,
          // maxHeight: `${maxHeightRef.value}px`,
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
        const wrapperRefDom = wrapperRef.value;
        if (!wrapperRefDom) {
          return;
        }
        const bodyDom = wrapperRefDom.parentElement;
        if (!bodyDom) {
          return;
        }
        bodyDom.style.padding = '0';
        await root.$nextTick();

        try {
          const modalDom = bodyDom.parentElement && bodyDom.parentElement.parentElement;
          if (!modalDom) {
            return;
          }
          const modalRect = getComputedStyle(modalDom).top;
          const modalTop = Number.parseInt(modalRect);

          let maxHeight =
            window.innerHeight - modalTop * 2 - props.modalFooterHeight - props.modalHeaderHeight;

          // 距离顶部过进会出现滚动条
          if (modalTop < 40) {
            maxHeight -= 26;
          }
          await root.$nextTick();
          if (!unref(spinRef)) {
            useTimeout(() => {
              // 重试3次
              if (tryCount < 3) {
                setModalHeight();
              }
              tryCount++;
            }, 10);
            return;
          }
          tryCount = 0;
          const realHeight = (unref(spinRef)!.$el.querySelector(
            '.ant-spin-container'
          ) as HTMLElement).scrollHeight;

          //  16为 p-2和m-2  加起来为4,基础4, 4*4=16
          // 32 padding
          realHeightRef.value = realHeight > maxHeight ? maxHeight : realHeight + 16 + 32;
          emit('heightChange', unref(realHeightRef));
        } catch (error) {
          console.log(error);
        }
      }

      watchEffect(() => {
        setModalHeight();
      });

      useWindowSizeFn(setModalHeight);

      return () => (
        <div ref={wrapperRef} style={unref(wrapStyle)}>
          <ScrollContainer type={TypeEnum.DEFAULT}>
            <Spin
              ref={spinRef}
              spinning={props.loading}
              style={{ height: `${unref(realHeightRef)}px` }}
              class="p-4"
            >
              {getSlot(slots, 'default')}
            </Spin>
          </ScrollContainer>
        </div>
      );
    },
  });
</script>
