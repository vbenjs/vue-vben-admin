import type { ModalProps, ModalMethods } from './types';

import { defineComponent, computed, ref, watch, unref, watchEffect } from 'vue';

import Modal from './Modal';
import Button from '/@/components/Button/index.vue';
import ModalWrapper from './ModalWrapper';
import { BasicTitle } from '/@/components/Basic';
import { FullscreenExitOutlined, FullscreenOutlined, CloseOutlined } from '@ant-design/icons-vue';

import { getSlot, extendSlots } from '/@/utils/helper/tsxHelper';
import { isFunction } from '/@/utils/is';
import { deepMerge } from '/@/utils';
import { buildUUID } from '/@/utils/uuid';

import { basicProps } from './props';
// import { triggerWindowResize } from '@/utils/event/triggerWindowResizeEvent';
export default defineComponent({
  name: 'BasicModal',
  props: basicProps,
  emits: ['visible-change', 'height-change', 'cancel', 'ok', 'register'],
  setup(props, { slots, emit, attrs }) {
    const visibleRef = ref(false);
    const propsRef = ref<Partial<ModalProps> | null>(null);
    const modalWrapperRef = ref<any>(null);
    // modal   Bottom and top height
    const extHeightRef = ref(0);
    // Unexpanded height of the popup
    const formerHeightRef = ref(0);
    const fullScreenRef = ref(false);

    // Custom title component: get title
    const getMergeProps = computed(() => {
      return {
        ...props,
        ...(unref(propsRef) as any),
      };
    });

    // modal component does not need title
    const getProps = computed((): any => {
      const opt = {
        ...props,
        ...((unref(propsRef) || {}) as any),
        visible: unref(visibleRef),
        title: undefined,
      };
      const { wrapClassName = '' } = opt;
      const className = unref(fullScreenRef) ? `${wrapClassName} fullscreen-modal` : wrapClassName;
      return {
        ...opt,
        wrapClassName: className,
      };
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

    function renderContent() {
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
          {...wrapperProps}
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

    // 取消事件
    async function handleCancel(e: Event) {
      e && e.stopPropagation();
      if (props.closeFunc && isFunction(props.closeFunc)) {
        const isClose: boolean = await props.closeFunc();
        visibleRef.value = !isClose;
        return;
      }
      visibleRef.value = false;
      emit('cancel');
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
      if (!canFullscreen) {
        return null;
      }
      return (
        <div class="custom-close-icon">
          {unref(fullScreenRef) ? (
            <FullscreenExitOutlined role="full" onClick={handleFullScreen} />
          ) : (
            <FullscreenOutlined role="close" onClick={handleFullScreen} />
          )}
          <CloseOutlined onClick={handleCancel} />
        </div>
      );
    }

    function handleFullScreen(e: Event) {
      e && e.stopPropagation();
      fullScreenRef.value = !unref(fullScreenRef);

      const modalWrapper = unref(modalWrapperRef);
      if (!modalWrapper) return;

      const wrapperEl = modalWrapper.$el as HTMLElement;
      if (!wrapperEl) return;

      const modalWrapSpinEl = wrapperEl.querySelector('.ant-spin-nested-loading') as HTMLElement;
      if (!modalWrapSpinEl) return;

      if (!unref(formerHeightRef) && unref(fullScreenRef)) {
        formerHeightRef.value = modalWrapSpinEl.offsetHeight;
      }

      if (unref(fullScreenRef)) {
        modalWrapSpinEl.style.height = `${window.innerHeight - unref(extHeightRef)}px`;
      } else {
        modalWrapSpinEl.style.height = `${unref(formerHeightRef)}px`;
      }
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

    const modalMethods: ModalMethods = {
      setModalProps,
    };

    const uuid = buildUUID();
    emit('register', modalMethods, uuid);

    return () => (
      <Modal
        onCancel={handleCancel}
        getContainer={() => document.querySelector('.default-layout__main')}
        {...{ ...attrs, ...props, ...unref(getProps) }}
      >
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
