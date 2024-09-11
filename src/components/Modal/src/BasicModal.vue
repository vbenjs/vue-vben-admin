<template>
  <Modal v-bind="getBindValue" @cancel="handleCancel">
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
      <ModalFooter v-bind="getBindValue" @ok="handleOk" @cancel="handleCancel">
        <template #[item]="data" v-for="item in Object.keys($slots)">
          <slot :name="item" v-bind="data || {}"></slot>
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
      :open="openRef"
      :modalFooterHeight="footer !== undefined && !footer ? 0 : undefined"
      v-bind="omit(getProps.wrapperProps, 'open', 'height', 'modalFooterHeight')"
      @ext-height="handleExtHeight"
      @height-change="handleHeightChange"
    >
      <slot></slot>
    </ModalWrapper>

    <template #[item]="data" v-for="item in Object.keys(omit($slots, 'default'))">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </Modal>
</template>
<script lang="ts" setup>
  import type { ModalProps, ModalMethods } from './typing';
  import {
    computed,
    ref,
    watch,
    unref,
    watchEffect,
    toRef,
    getCurrentInstance,
    nextTick,
    useAttrs,
  } from 'vue';
  import Modal from './components/Modal';
  import ModalWrapper from './components/ModalWrapper.vue';
  import ModalClose from './components/ModalClose.vue';
  import ModalFooter from './components/ModalFooter.vue';
  import ModalHeader from './components/ModalHeader.vue';
  import { isFunction } from '@/utils/is';
  import { deepMerge } from '@/utils';
  import { basicProps } from './props';
  import { useFullScreen } from './hooks/useModalFullScreen';
  import { omit } from 'lodash-es';
  import { useDesign } from '@/hooks/web/useDesign';

  defineOptions({ name: 'BasicModal', inheritAttrs: false });

  const props = defineProps(basicProps);

  const emit = defineEmits([
    'open-change',
    'height-change',
    'cancel',
    'ok',
    'register',
    'update:open',
    'fullscreen',
  ]);

  const attrs = useAttrs();
  const openRef = ref(false);
  const propsRef = ref<Partial<ModalProps> | null>(null);
  const modalWrapperRef = ref<any>(null);
  const { prefixCls } = useDesign('basic-modal');

  // modal   Bottom and top height
  const extHeightRef = ref(0);
  const modalMethods: ModalMethods = {
    setModalProps,
    emitOpen: undefined,
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
  const getMergeProps = computed((): Recordable => {
    return {
      ...props,
      ...(unref(propsRef) as any),
    };
  });

  const {
    handleFullScreen: handleFullScreenInner,
    getWrapClassName,
    fullScreenRef,
  } = useFullScreen({
    modalWrapperRef,
    extHeightRef,
    wrapClassName: toRef(getMergeProps.value, 'wrapClassName'),
  });

  // modal component does not need title and origin buttons
  const getProps = computed((): Recordable => {
    const opt = {
      ...unref(getMergeProps),
      open: unref(openRef),
      okButtonProps: undefined,
      cancelButtonProps: undefined,
      title: undefined,
    };
    return {
      ...opt,
      wrapClassName: unref(getWrapClassName),
    };
  });

  const getBindValue = computed((): Recordable => {
    const attr = {
      ...attrs,
      ...unref(getMergeProps),
      open: unref(openRef),
    };
    if (attr?.['wrapClassName'] === unref(getWrapClassName)) {
      attr['wrapClassName'] = `${attr?.['wrapClassName'] || ''} ` + prefixCls;
    } else {
      attr['wrapClassName'] = `${unref(getWrapClassName) || ''}` + prefixCls;
    }
    if (unref(fullScreenRef)) {
      return omit(attr, ['height', 'title']);
    }
    return omit(attr, 'title');
  });

  const getWrapperHeight = computed(() => {
    if (unref(fullScreenRef)) return undefined;
    return unref(getProps).height;
  });

  watchEffect(() => {
    openRef.value = !!props.open;
    fullScreenRef.value = !!props.defaultFullscreen;
  });

  watch(
    () => unref(openRef),
    (v) => {
      emit('open-change', v);
      emit('update:open', v);
      if (instance && modalMethods.emitOpen) {
        modalMethods.emitOpen(v, instance.uid);
      }
      nextTick(() => {
        if (props.scrollTop && v && unref(modalWrapperRef)) {
          (unref(modalWrapperRef) as any).scrollTop();
        }
      });
    },
    {
      immediate: false,
    },
  );

  // 取消事件
  async function handleCancel(e: Event) {
    e?.stopPropagation();
    // 过滤自定义关闭按钮的空白区域
    if ((e.target as HTMLElement)?.classList?.contains(prefixCls + '-close--custom')) return;
    if (props.closeFunc && isFunction(props.closeFunc)) {
      const isClose: boolean = await props.closeFunc();
      openRef.value = !isClose;
      return;
    }

    openRef.value = false;
    emit('cancel', e);
  }

  /**
   * @description: 设置modal参数
   */
  function setModalProps(props: Partial<ModalProps>): void {
    // Keep the last setModalProps
    propsRef.value = deepMerge(unref(propsRef) || ({} as any), props);
    if (Reflect.has(props, 'open')) {
      openRef.value = !!props.open;
    }
    if (Reflect.has(props, 'defaultFullscreen')) {
      fullScreenRef.value = !!props.defaultFullscreen;
    }
  }

  function handleOk(e: Event) {
    emit('ok', e);
  }

  function handleHeightChange(height: string) {
    emit('height-change', height);
  }

  function handleExtHeight(height: number) {
    extHeightRef.value = height;
  }

  function handleTitleDbClick(e) {
    if (!props.canFullscreen) return;
    e.stopPropagation();
    handleFullScreen(e);
  }

  // 事件传递
  function handleFullScreen(e) {
    handleFullScreenInner(e);
    emit('fullscreen');
  }
</script>
