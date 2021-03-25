<template>
  <Modal @cancel="handleCancel" v-bind="getBindValue">
    <template #closeIcon v-if="!$slots.closeIcon">
      <ModalClose
        :canFullscreen="getProps.canFullscreen"
        :fullScreen="fullScreenRef"
        @cancel="handleCancel"
        @fullscreen="handleFullScreen"
      />
    </template>

    <template #title v-if="!$slots.title">
      <ModalHeader
        :helpMessage="getProps.helpMessage"
        :title="getMergeProps.title"
        @dblclick="handleTitleDbClick"
      />
    </template>

    <template #footer v-if="!$slots.footer">
      <ModalFooter v-bind="getProps" @ok="handleOk" @cancel="handleCancel">
        <template #[item]="data" v-for="item in Object.keys($slots)">
          <slot :name="item" v-bind="data"></slot>
        </template>
      </ModalFooter>
    </template>

    <ModalWrapper
      :useWrapper="getProps.useWrapper"
      :footerOffset="wrapperFooterOffset"
      :fullScreen="fullScreenRef"
      ref="modalWrapperRef"
      :loading="getProps.loading"
      :loading-tip="getProps.loadingTip"
      :minHeight="getProps.minHeight"
      :height="getWrapperHeight"
      :visible="visibleRef"
      :modalFooterHeight="footer !== undefined && !footer ? 0 : undefined"
      v-bind="omit(getProps.wrapperProps, 'visible', 'height')"
      @ext-height="handleExtHeight"
      @height-change="handleHeightChange"
    >
      <slot></slot>
    </ModalWrapper>

    <template #[item]="data" v-for="item in Object.keys(omit($slots, 'default'))">
      <slot :name="item" v-bind="data"></slot>
    </template>
  </Modal>
</template>
<script lang="ts">
  import type { ModalProps, ModalMethods } from './types';

  import {
    defineComponent,
    computed,
    ref,
    watch,
    unref,
    watchEffect,
    toRef,
    getCurrentInstance,
    nextTick,
  } from 'vue';

  import Modal from './components/Modal';
  import ModalWrapper from './components/ModalWrapper.vue';
  import ModalClose from './components/ModalClose.vue';
  import ModalFooter from './components/ModalFooter.vue';
  import ModalHeader from './components/ModalHeader.vue';

  import { isFunction } from '/@/utils/is';
  import { deepMerge } from '/@/utils';

  import { basicProps } from './props';
  import { useFullScreen } from './hooks/useModalFullScreen';

  import { omit } from 'lodash-es';
  export default defineComponent({
    name: 'BasicModal',
    components: { Modal, ModalWrapper, ModalClose, ModalFooter, ModalHeader },
    inheritAttrs: false,
    props: basicProps,
    emits: ['visible-change', 'height-change', 'cancel', 'ok', 'register'],
    setup(props, { emit, attrs }) {
      const visibleRef = ref(false);
      const propsRef = ref<Partial<ModalProps> | null>(null);
      const modalWrapperRef = ref<ComponentRef>(null);

      // modal   Bottom and top height
      const extHeightRef = ref(0);
      const modalMethods: ModalMethods = {
        setModalProps,
        emitVisible: undefined,
        redoModalHeight: () => {
          nextTick(() => {
            if (unref(modalWrapperRef)) {
              (unref(modalWrapperRef) as any).setModalHeight();
            }
          });
        },
      };

      const instance = getCurrentInstance();
      if (instance) {
        emit('register', modalMethods, instance.uid);
      }

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

      const getBindValue = computed(
        (): Recordable => {
          const attr = { ...attrs, ...unref(getProps) };
          if (unref(fullScreenRef)) {
            return omit(attr, 'height');
          }
          return attr;
        }
      );

      const getWrapperHeight = computed(() => {
        if (unref(fullScreenRef)) return undefined;
        return unref(getProps).height;
      });

      watchEffect(() => {
        visibleRef.value = !!props.visible;
        fullScreenRef.value = !!props.defaultFullscreen;
      });

      watch(
        () => unref(visibleRef),
        (v) => {
          emit('visible-change', v);
          instance && modalMethods.emitVisible?.(v, instance.uid);
          nextTick(() => {
            if (props.scrollTop && v && unref(modalWrapperRef)) {
              (unref(modalWrapperRef) as any).scrollTop();
            }
          });
        },
        {
          immediate: false,
        }
      );

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

      function handleOk() {
        emit('ok');
      }

      function handleHeightChange(height: string) {
        emit('height-change', height);
      }

      function handleExtHeight(height: number) {
        extHeightRef.value = height;
      }

      function handleTitleDbClick(e: ChangeEvent) {
        if (!props.canFullscreen) return;
        e.stopPropagation();
        handleFullScreen(e);
      }

      return {
        handleCancel,
        getBindValue,
        getProps,
        handleFullScreen,
        fullScreenRef,
        getMergeProps,
        handleOk,
        visibleRef,
        omit,
        modalWrapperRef,
        handleExtHeight,
        handleHeightChange,
        handleTitleDbClick,
        getWrapperHeight,
      };
    },
  });
</script>
