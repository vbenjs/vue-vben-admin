<template>
  <div :class="getClass" :style="getStyle" ref="wrapperRef">
    <PageHeader
      :ghost="ghost"
      :title="title"
      v-bind="omit($attrs, 'class')"
      :style="getHeaderStyle"
      ref="headerRef"
      v-if="getShowHeader"
    >
      <template #default>
        <template v-if="content">
          {{ content }}
        </template>
        <slot name="headerContent" v-else></slot>
      </template>
      <template #[item]="data" v-for="item in getHeaderSlots">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </PageHeader>

    <div class="overflow-hidden" :class="getContentClass" :style="getContentStyle" ref="contentRef">
      <slot></slot>
    </div>

    <PageFooter v-if="getShowFooter" ref="footerRef">
      <template #left>
        <slot name="leftFooter"></slot>
      </template>
      <template #right>
        <slot name="rightFooter"></slot>
      </template>
    </PageFooter>
  </div>
</template>
<script lang="ts" setup>
  import { PageWrapperFixedHeightKey } from '@/enums/pageEnum';
  import { useContentHeight } from '@/hooks/web/useContentHeight';
  import { useDesign } from '@/hooks/web/useDesign';
  import { propTypes } from '@/utils/propTypes';
  import { PageHeader } from 'ant-design-vue';
  import { omit, debounce } from 'lodash-es';
  import { useElementSize } from '@vueuse/core';
  import {
    CSSProperties,
    PropType,
    computed,
    provide,
    ref,
    unref,
    useAttrs,
    useSlots,
    watch,
  } from 'vue';
  import PageFooter from './PageFooter.vue';

  defineOptions({
    name: 'PageWrapper',
    inheritAttrs: false,
  });

  const props = defineProps({
    title: propTypes.string,
    dense: propTypes.bool,
    ghost: propTypes.bool,
    headerSticky: propTypes.bool,
    headerStyle: Object as PropType<CSSProperties>,
    content: propTypes.string,
    contentStyle: {
      type: Object as PropType<CSSProperties>,
    },
    contentBackground: propTypes.bool,
    contentFullHeight: propTypes.bool.def(false),
    contentClass: propTypes.string,
    fixedHeight: propTypes.bool,
    upwardSpace: propTypes.oneOfType([propTypes.number, propTypes.string]).def(0),
  });

  const attrs = useAttrs();
  const slots = useSlots();

  const wrapperRef = ref(null);
  const headerRef = ref(null);
  const contentRef = ref(null);
  const footerRef = ref(null);

  const { height } = useElementSize(wrapperRef);

  const { prefixCls } = useDesign('page-wrapper');

  provide(
    PageWrapperFixedHeightKey,
    computed(() => props.fixedHeight),
  );

  const getIsContentFullHeight = computed(() => {
    return props.contentFullHeight;
  });

  const getUpwardSpace = computed(() => props.upwardSpace);
  const { redoHeight, setCompensation, contentHeight } = useContentHeight(
    getIsContentFullHeight,
    wrapperRef,
    [headerRef, footerRef],
    [contentRef],
    getUpwardSpace,
  );
  const debounceRedoHeight = debounce(redoHeight, 50);
  setCompensation({ useLayoutFooter: true, elements: [footerRef] });

  const getClass = computed(() => {
    return [
      prefixCls,
      {
        [`${prefixCls}--dense`]: props.dense,
      },
      attrs.class ?? {},
    ];
  });

  const getStyle = computed(() => {
    const { contentFullHeight, fixedHeight } = props;
    return {
      ...(contentFullHeight && fixedHeight ? { height: '100%' } : {}),
    };
  });

  const getHeaderStyle = computed((): CSSProperties => {
    const { headerSticky } = props;
    if (!headerSticky) {
      return {};
    }

    return {
      position: 'sticky',
      top: 0,
      zIndex: 99,
      ...props.headerStyle,
    };
  });

  const getShowHeader = computed(
    () => props.content || slots?.headerContent || props.title || getHeaderSlots.value.length,
  );

  const getShowFooter = computed(() => slots?.leftFooter || slots?.rightFooter);

  const getHeaderSlots = computed(() => {
    return Object.keys(omit(slots, 'default', 'leftFooter', 'rightFooter', 'headerContent'));
  });

  const getContentStyle = computed((): CSSProperties => {
    const { contentFullHeight, contentStyle, fixedHeight } = props;
    if (!contentFullHeight) {
      return { ...contentStyle };
    }

    const height = `${unref(contentHeight)}px`;
    return {
      ...contentStyle,
      minHeight: height,
      ...(fixedHeight ? { height } : {}),
    };
  });

  const getContentClass = computed(() => {
    const { contentBackground, contentClass } = props;
    return [
      `${prefixCls}-content`,
      contentClass,
      {
        [`${prefixCls}-content-bg`]: contentBackground,
      },
    ];
  });

  watch(
    () => [getShowFooter.value],
    () => {
      redoHeight();
    },
    {
      flush: 'post',
      immediate: true,
    },
  );

  watch(height, () => {
    const { contentFullHeight, fixedHeight } = props;
    contentFullHeight && fixedHeight && debounceRedoHeight();
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-page-wrapper';

  .@{prefix-cls} {
    position: relative;

    .@{prefix-cls}-content {
      margin: 16px;
    }

    .ant-page-header {
      &:empty {
        padding: 0;
      }
    }

    &-content-bg {
      background-color: @component-background;
    }

    &--dense {
      .@{prefix-cls}-content {
        margin: 0;
      }
    }
  }
</style>
