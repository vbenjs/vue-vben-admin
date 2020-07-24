<script lang="tsx">
  import Modal from './Modal.vue';
  import { Button } from 'ant-design-vue';
  import { Icon } from '@/components/icon/index';
  import ModalWrapper from './ModalWrapper.vue';
  import { BaseTitle } from '@/components/base/index';
  import { defineComponent, computed, ref, watch, unref } from 'compatible-vue';

  import { ModalProps, ModalInstance } from './types';
  import { basicProps } from './props';

  import { getSlot } from '@/utils/helper/tsxHelper';
  import { isFunction } from '../../../utils/is';
  // import { triggerWindowResize } from '@/utils/event/triggerWindowResizeEvent';
  export default defineComponent({
    name: 'BasicModal',
    props: basicProps,
    setup(props: Readonly<ModalProps>, { slots, listeners, emit }) {
      const visibleRef = ref(false);
      const propsRef = ref<Partial<ModalProps> | null>(null);

      const modalWrapperRef = ref<any>(null);

      // modal   底部和顶部高度
      const extHeightRef = ref(0);

      // 弹窗未展开的高度
      const formerHeightRef = ref(0);

      const fullScreenRef = ref(false);
      // 自定义title组件：获得title
      const getMergeProps = computed(() => {
        return {
          ...props,
          ...unref(propsRef),
        };
      });
      // modal组件不需要title
      const getProps = computed(() => {
        const opt = {
          ...props,
          ...(unref(propsRef) || {}),
          visible: unref(visibleRef),
          title: undefined,
        };
        const { wrapClassName = '' } = opt;
        const className = unref(fullScreenRef)
          ? `${wrapClassName} fullscreen-modal`
          : wrapClassName;
        return {
          ...opt,
          wrapClassName: className,
        };
      });
      watch(
        () => props.visible,
        (visible) => {
          visibleRef.value = visible;
        },
        {
          immediate: true,
        }
      );
      watch(
        () => unref(visibleRef),
        (v) => {
          emit('visibleChange', v);
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
        if (!title) {
          return null;
        }
        return (
          <BaseTitle helpMessage={helpMessage} slot="title">
            {slots.getSlot ? getSlot(slots, 'title') : title}
          </BaseTitle>
        );
      }
      /**
       * @description: 渲染主体
       */
      function renderContent() {
        const { useWrapper, loading, wrapperProps } = unref(getProps);
        return useWrapper ? (
          <ModalWrapper
            fullScreen={unref(fullScreenRef)}
            ref={modalWrapperRef}
            loading={loading}
            props={wrapperProps}
            visible={unref(visibleRef)}
            onGetExtHeight={(height: number) => {
              extHeightRef.value = height;
            }}
            onHeightChange={(height) => {
              emit('heightChange', height);
            }}
          >
            {getSlot(slots, 'default')}
          </ModalWrapper>
        ) : (
          getSlot(slots, 'default')
        );
      }
      // 取消事件
      async function handleCancel(e: Event) {
        e.stopPropagation();
        if (props.closeFunc && isFunction(props.closeFunc)) {
          await props.closeFunc();
          visibleRef.value = false;
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
          <template slot="footer">
            {getSlot(slots, 'insert-footer')}

            {showCancelBtn && (
              <Button {...{ ...cancelButtonProps }} onClick={handleCancel}>
                {cancelText}
              </Button>
            )}
            {getSlot(slots, 'centerd-footer')}

            {showOkBtn && (
              <Button
                type={okType}
                {...{ ...okButtonProps }}
                loading={confirmLoading}
                onClick={() => {
                  emit('ok');
                }}
              >
                {okText}
              </Button>
            )}

            {getSlot(slots, 'append-footer')}
          </template>
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
          <template slot="closeIcon">
            <div class="custom-close-icon">
              <Icon
                type={unref(fullScreenRef) ? 'fullscreen-exit' : 'fullscreen'}
                onClick={handleFullScreen}
              />
              <Icon type="close" onClick={handleCancel} />
            </div>
          </template>
        );
      }

      function handleFullScreen(e: Event) {
        e.stopPropagation();
        fullScreenRef.value = !unref(fullScreenRef);
        const modalWrapper = unref(modalWrapperRef);
        if (modalWrapper) {
          const modalWrapSpinEl = (modalWrapper.$el as HTMLElement).querySelector(
            '.modal-wrap-spin'
          );
          if (modalWrapSpinEl) {
            if (!unref(formerHeightRef) && unref(fullScreenRef)) {
              formerHeightRef.value = (modalWrapSpinEl as HTMLElement).offsetHeight;
              console.log(formerHeightRef);
            }
            if (unref(fullScreenRef)) {
              (modalWrapSpinEl as HTMLElement).style.height = `${
                window.innerHeight - unref(extHeightRef) - 26 // 32 padding
              }px`;
            } else {
              (modalWrapSpinEl as HTMLElement).style.height = `${unref(formerHeightRef)}px`;
            }
          }
        }
        // triggerWindowResize();
      }
      /**
       * @description: 设置表格参数
       */
      function setModalProps(props: Partial<ModalProps>): void {
        // 保留上一次的setModalProps
        propsRef.value = { ...unref(propsRef), ...props };
        if (Reflect.has(props, 'visible')) {
          visibleRef.value = !!props.visible;
        }
      }

      const modalInstance: ModalInstance = {
        setModalProps,
      };
      emit('register', modalInstance);
      return () => (
        <Modal props={unref(getProps)} {...{ on: listeners }} onCancel={handleCancel}>
          {renderTitle()}
          {renderContent()}
          {renderFooter()}
          {renderClose()}
        </Modal>
      );
    },
  });
</script>
