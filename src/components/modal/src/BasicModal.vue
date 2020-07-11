<script lang="tsx">
  import Modal from './Modal.vue';
  import { Button } from 'ant-design-vue';
  import ModalWrapper from './ModalWrapper.vue';
  import { BaseTitle } from '@/components/base/index';
  import { defineComponent, computed, ref, watch, unref } from 'compatible-vue';

  import { ModalProps, ModalInstance } from './types';
  import { basicProps } from './props';

  import { getSlot } from '@/utils/helper/tsxHelper';

  export default defineComponent({
    name: 'BasicModal',
    props: basicProps,
    setup(props: Readonly<ModalProps>, { slots, listeners, emit }) {
      const visibleRef = ref(false);
      const propsRef = ref<Partial<ModalProps> | null>(null);
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
        return opt;
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
            loading={loading}
            props={wrapperProps}
            visible={unref(visibleRef)}
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
      function handleCancel() {
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
      // TODO 待扩展全屏
      /**
       * @description: 关闭按钮
       */
      // function renderClose() {
      //   return (
      //     <template slot="closeIcon">
      //       <Button>1</Button>
      //       <Button>2</Button>
      //     </template>
      //   );
      // }
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
        // injectModal: (val) => {
        //   emit('getInject', val);
        // },
      };
      emit('register', modalInstance);
      return () => (
        <Modal props={unref(getProps)} {...{ on: listeners }} onCancel={handleCancel}>
          {renderTitle()}
          {renderContent()}
          {renderFooter()}
          {
            // renderClose()
          }
        </Modal>
      );
    },
  });
</script>
