<template>
  <Drawer v-bind="getBindValues" :class="prefixCls" @close="onClose">
    <template #title v-if="!$slots.title">
      <DrawerHeader
        :title="getMergeProps.title"
        :isDetail="isDetail"
        :showDetailBack="showDetailBack"
        @close="onClose"
      >
        <template #titleToolbar>
          <slot name="titleToolbar"></slot>
        </template>
      </DrawerHeader>
    </template>
    <template v-else #title>
      <slot name="title"></slot>
    </template>

    <ScrollContainer
      :style="getScrollContentStyle"
      v-loading="getLoading"
      :loading-tip="loadingText || t('common.loadingText')"
    >
      <slot></slot>
    </ScrollContainer>
    <DrawerFooter v-bind="getProps" @close="onClose" @ok="handleOk" :height="getFooterHeight">
      <template #[item]="data" v-for="item in Object.keys($slots)">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </DrawerFooter>
  </Drawer>
</template>
<script lang="ts" setup>
  import type { DrawerInstance, DrawerProps } from './typing';
  import { ref, computed, watch, unref, nextTick, getCurrentInstance } from 'vue';
  import type { CSSProperties, Ref } from 'vue';
  import { Drawer } from 'ant-design-vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { isFunction, isNumber } from '@/utils/is';
  import { deepMerge } from '@/utils';
  import DrawerFooter from './components/DrawerFooter.vue';
  import DrawerHeader from './components/DrawerHeader.vue';
  import { ScrollContainer } from '@/components/Container';
  import { basicProps } from './props';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useAttrs } from '@vben/hooks';

  defineOptions({ inheritAttrs: false });

  const props = defineProps(basicProps);

  const emit = defineEmits(['open-change', 'ok', 'close', 'register']);

  const openRef = ref(false);
  const attrs = useAttrs();
  const propsRef = ref({}) as Ref<Partial<DrawerProps>>;

  const { t } = useI18n();
  const { prefixVar, prefixCls } = useDesign('basic-drawer');

  const drawerInstance: DrawerInstance = {
    setDrawerProps,
    emitOpen: undefined,
  };

  const instance = getCurrentInstance();

  instance && emit('register', drawerInstance, instance.uid);

  const getMergeProps = computed(() => {
    return deepMerge(props, unref(propsRef));
  });

  const getProps = computed(() => {
    const opt: Partial<DrawerProps> = {
      placement: 'right',
      ...unref(attrs),
      ...unref(getMergeProps),
      open: unref(openRef),
    };
    opt.title = undefined;
    const { isDetail, width, wrapClassName, getContainer } = opt;
    if (isDetail) {
      if (!width) {
        opt.width = '100%';
      }
      const detailCls = `${prefixCls}__detail`;
      opt.rootClassName = wrapClassName ? `${wrapClassName} ${detailCls}` : detailCls;

      if (!getContainer) {
        opt.getContainer = `.${prefixVar}-layout-content`;
      }
    }
    return opt;
  });

  const getBindValues = computed(() => {
    return {
      ...attrs,
      ...unref(getProps),
    };
  });

  // Custom implementation of the bottom button,
  const getFooterHeight = computed(() => {
    const { footerHeight, showFooter } = unref(getProps);
    if (showFooter && footerHeight) {
      return isNumber(footerHeight) ? `${footerHeight}px` : `${footerHeight.replace('px', '')}px`;
    }
    return `0px`;
  });

  const getScrollContentStyle = computed((): CSSProperties => {
    const footerHeight = unref(getFooterHeight);
    return {
      position: 'relative',
      height: `calc(100% - ${footerHeight})`,
    };
  });

  const getLoading = computed(() => {
    return !!unref(getProps)?.loading;
  });

  watch(
    () => props.open,
    (newVal, oldVal) => {
      if (newVal !== oldVal) openRef.value = newVal;
    },
    { deep: true },
  );

  watch(
    () => openRef.value,
    (open) => {
      nextTick(() => {
        emit('open-change', open);
        if (instance && drawerInstance.emitOpen) {
          drawerInstance.emitOpen(open, instance.uid);
        }
      });
    },
  );

  // Cancel event
  async function onClose(e) {
    const { closeFunc } = unref(getProps);
    emit('close', e);
    if (closeFunc && isFunction(closeFunc)) {
      const res = await closeFunc();
      openRef.value = !res;
      return;
    }
    openRef.value = false;
  }

  function setDrawerProps(props: Partial<DrawerProps>) {
    // Keep the last setDrawerProps
    propsRef.value = deepMerge(unref(propsRef), props);

    if (Reflect.has(props, 'open')) {
      openRef.value = !!props.open;
    }
  }

  function handleOk() {
    emit('ok');
  }
</script>
<style lang="less">
  @header-height: 60px;
  @detail-header-height: 40px;
  @prefix-cls: ~'@{namespace}-basic-drawer';
  @prefix-cls-detail: ~'@{namespace}-basic-drawer__detail';

  .@{prefix-cls} {
    .ant-drawer-wrapper-body {
      overflow: hidden;
    }

    .ant-drawer-close {
      &:hover {
        color: @error-color;
      }
    }

    .ant-drawer-body {
      height: calc(100% - @header-height);
      padding: 0;
      background-color: @component-background;

      .scrollbar__wrap {
        margin-bottom: 0 !important;
        padding: 16px !important;
      }

      > .scrollbar > .scrollbar__bar.is-horizontal {
        display: none;
      }
    }
  }

  .@{prefix-cls-detail} {
    position: absolute;

    .ant-drawer-header {
      box-sizing: border-box;
      width: 100%;
      height: @detail-header-height;
      padding: 0;
      border-top: 1px solid @border-color-base;
    }

    .ant-drawer-title {
      height: 100%;
    }

    .ant-drawer-close {
      height: @detail-header-height;
      line-height: @detail-header-height;
    }

    .scrollbar__wrap {
      padding: 0 !important;
    }

    .ant-drawer-body {
      height: calc(100% - @detail-header-height);
    }
  }
</style>
