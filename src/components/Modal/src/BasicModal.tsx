import type { ModalProps, ModalMethods } from './types';

import { defineComponent, computed, ref, watch, unref, watchEffect, toRef } from 'vue';

import Modal from './Modal';
import { Button } from '/@/components/Button';
import ModalWrapper from './ModalWrapper';
import { BasicTitle } from '/@/components/Basic';
import { FullscreenExitOutlined, FullscreenOutlined, CloseOutlined } from '@ant-design/icons-vue';

import { getSlot, extendSlots } from '/@/utils/helper/tsxHelper';
import { isFunction } from '/@/utils/is';
import { deepMerge } from '/@/utils';
import { tryTsxEmit } from '/@/utils/helper/vueHelper';

import { basicProps } from './props';
import { useFullScreen } from './useFullScreen';
export default defineComponent({
  name: 'BasicModal',
  props: basicProps,
  emits: ['visible-change', 'height-change', 'cancel', 'ok', 'register'],
  setup(props, { slots, emit, attrs }) {
    const visibleRef = ref(false);
    const propsRef = ref<Partial<ModalProps> | null>(null);
    const modalWrapperRef = ref<ComponentRef>(null);
    // modal   Bottom and top height
    const extHeightRef = ref(0);
    // Unexpanded height of the popup

    // Custom title component: get title
    const getMergeProps = computed(
      (): ModalProps => {
        return {
          ...props,
          ...(unref(propsRef) as any),
        };
      }
    );

    const { handleFullScreen, getWrapClassName, fullScreenRef } = useFullScreen({
      modalWrapperRef,
      extHeightRef,
      wrapClassName: toRef(getMergeProps.value, 'wrapClassName'),
    });

    // modal component does not need title
    const getProps = computed(
      (): ModalProps => {
        const opt = {
          ...unref(getMergeProps),
          visible: unref(visibleRef),
          title: undefined,
        };

        return {
          ...opt,
          wrapClassName: unref(getWrapClassName),
        };
      }
    );

    const getModalBindValue = computed((): any => {
      return { ...attrs, ...unref(getProps) };
    });

    watchEffect(() => {
      visibleRef.value = !!props.visible;
    });

    watch(
      () => unref(visibleRef),
      (v) => {
        emit('visible-change', v);
      },
      {
        immediate: false,
      }
    );

    /**
     * @description: 渲染标题
     */
    function renderTitle() {
      const { helpMessage } = unref(getProps);
      const { title } = unref(getMergeProps);
      return (
        <BasicTitle helpMessage={helpMessage}>
          {() => (slots.title ? getSlot(slots, 'title') : title)}
        </BasicTitle>
      );
    }

    // 取消事件
    async function handleCancel(e: Event) {
      e?.stopPropagation();

      if (props.closeFunc && isFunction(props.closeFunc)) {
        const isClose: boolean = await props.closeFunc();
        visibleRef.value = !isClose;
        return;
      }

      visibleRef.value = false;
      emit('cancel');
    }

    /**
     * @description: 设置modal参数
     */
    function setModalProps(props: Partial<ModalProps>): void {
      // Keep the last setModalProps
      propsRef.value = deepMerge(unref(propsRef) || {}, props);
      if (!Reflect.has(props, 'visible')) return;
      visibleRef.value = !!props.visible;
    }

    function renderContent() {
      type OmitWrapperType = Omit<
        ModalProps,
        'fullScreen' | 'modalFooterHeight' | 'visible' | 'loading'
      >;
      const { useWrapper, loading, wrapperProps } = unref(getProps);
      if (!useWrapper) return getSlot(slots);

      const showFooter = props.footer !== undefined && !props.footer ? 0 : undefined;
      return (
        <ModalWrapper
          footerOffset={props.wrapperFooterOffset}
          fullScreen={unref(fullScreenRef)}
          ref={modalWrapperRef}
          loading={loading}
          visible={unref(visibleRef)}
          modalFooterHeight={showFooter}
          {...((wrapperProps as unknown) as OmitWrapperType)}
          onGetExtHeight={(height: number) => {
            extHeightRef.value = height;
          }}
          onHeightChange={(height: string) => {
            emit('height-change', height);
          }}
        >
          {() => getSlot(slots)}
        </ModalWrapper>
      );
    }

    // 底部按钮自定义实现,
    function renderFooter() {
      const {
        showCancelBtn,
        cancelButtonProps,
        cancelText,
        showOkBtn,
        okType,
        okText,
        okButtonProps,
        confirmLoading,
      } = unref(getProps);

      return (
        <>
          {getSlot(slots, 'insertFooter')}
          {showCancelBtn && (
            <Button {...cancelButtonProps} onClick={handleCancel}>
              {() => cancelText}
            </Button>
          )}
          {getSlot(slots, 'centerdFooter')}
          {showOkBtn && (
            <Button
              type={okType as any}
              loading={confirmLoading}
              onClick={() => {
                emit('ok');
              }}
              {...okButtonProps}
            >
              {() => okText}
            </Button>
          )}
          {getSlot(slots, 'appendFooter')}
        </>
      );
    }

    /**
     * @description: 关闭按钮
     */
    function renderClose() {
      const { canFullscreen } = unref(getProps);

      const fullScreen = unref(fullScreenRef) ? (
        <FullscreenExitOutlined role="full" onClick={handleFullScreen} />
      ) : (
        <FullscreenOutlined role="close" onClick={handleFullScreen} />
      );

      const cls = [
        'custom-close-icon',
        {
          'can-full': canFullscreen,
        },
      ];

      return (
        <div class={cls}>
          {canFullscreen && fullScreen}
          <CloseOutlined onClick={handleCancel} />
        </div>
      );
    }

    const modalMethods: ModalMethods = {
      setModalProps,
    };

    tryTsxEmit((instance) => {
      emit('register', modalMethods, instance.uid);
    });
    return () => (
      <Modal onCancel={handleCancel} {...unref(getModalBindValue)}>
        {{
          footer: () => renderFooter(),
          closeIcon: () => renderClose(),
          title: () => renderTitle(),
          ...extendSlots(slots, ['default']),
          default: () => renderContent(),
        }}
      </Modal>
    );
  },
});
