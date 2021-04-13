<template>
  <div :class="getClass">
    <PageHeader
      :ghost="ghost"
      :title="title"
      v-bind="$attrs"
      ref="headerRef"
      v-if="content || $slots.headerContent || title || getHeaderSlots.length"
    >
      <template #default>
        <template v-if="content">
          {{ content }}
        </template>
        <slot name="headerContent" v-else></slot>
      </template>
      <template #[item]="data" v-for="item in getHeaderSlots">
        <slot :name="item" v-bind="data"></slot>
      </template>
    </PageHeader>
    <div class="overflow-hidden" :class="getContentClass" :style="getContentStyle">
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
<script lang="ts">
  import type { CSSProperties, PropType } from 'vue';

  import { defineComponent, computed, watch, nextTick, ref, unref } from 'vue';
  import PageFooter from './PageFooter.vue';
  import { usePageContext } from '/@/hooks/component/usePageContext';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { propTypes } from '/@/utils/propTypes';
  import { omit } from 'lodash-es';
  import { PageHeader } from 'ant-design-vue';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  export default defineComponent({
    name: 'PageWrapper',
    components: { PageFooter, PageHeader },
    inheritAttrs: false,
    props: {
      title: propTypes.string,
      dense: propTypes.bool,
      ghost: propTypes.bool,
      content: propTypes.string,
      contentStyle: {
        type: Object as PropType<CSSProperties>,
      },
      contentBackground: propTypes.bool,
      contentFullHeight: propTypes.bool,
      contentClass: propTypes.string,
      fixedHeight: propTypes.bool,
    },
    setup(props, { slots }) {
      const headerRef = ref<ComponentRef>(null);
      const footerRef = ref<ComponentRef>(null);
      const footerHeight = ref(0);
      const { prefixCls, prefixVar } = useDesign('page-wrapper');
      const { contentHeight, setPageHeight, pageHeight } = usePageContext();

      const getClass = computed(() => {
        return [
          prefixCls,
          {
            [`${prefixCls}--dense`]: props.dense,
          },
        ];
      });

      const getShowFooter = computed(() => slots?.leftFooter || slots?.rightFooter);

      const getHeaderSlots = computed(() => {
        return Object.keys(omit(slots, 'default', 'leftFooter', 'rightFooter', 'headerContent'));
      });

      const getContentStyle = computed(
        (): CSSProperties => {
          const { contentFullHeight, contentStyle, fixedHeight } = props;
          if (!contentFullHeight) {
            return { ...contentStyle };
          }
          const height = `${unref(pageHeight)}px`;
          return {
            ...contentStyle,
            minHeight: height,
            ...(fixedHeight ? { height } : {}),
            paddingBottom: `${unref(footerHeight)}px`,
          };
        }
      );

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
        () => [contentHeight?.value, getShowFooter.value],
        () => {
          calcContentHeight();
        },
        {
          flush: 'post',
          immediate: true,
        }
      );

      onMountedOrActivated(() => {
        nextTick(() => {
          calcContentHeight();
        });
      });

      function calcContentHeight() {
        if (!props.contentFullHeight) {
          return;
        }
        //fix:in contentHeight mode: delay getting footer and header dom element to get the correct height
        const footer = unref(footerRef);
        const header = unref(headerRef);
        footerHeight.value = 0;
        const footerEl = footer?.$el;

        if (footerEl) {
          footerHeight.value += footerEl?.offsetHeight ?? 0;
        }
        let headerHeight = 0;
        const headerEl = header?.$el;
        if (headerEl) {
          headerHeight += headerEl?.offsetHeight ?? 0;
        }
        // fix:subtract content's marginTop and marginBottom value
        let subtractHeight = 0;
        let marginBottom = '0px';
        let marginTop = '0px';
        const classElments = document.querySelectorAll(`.${prefixVar}-page-wrapper-content`);
        if (classElments && classElments.length > 0) {
          const contentEl = classElments[0];
          const cssStyle = getComputedStyle(contentEl);
          marginBottom = cssStyle?.marginBottom;
          marginTop = cssStyle?.marginTop;
        }
        if (marginBottom) {
          const contentMarginBottom = Number(marginBottom.replace(/[^\d]/g, ''));
          subtractHeight += contentMarginBottom;
        }
        if (marginTop) {
          const contentMarginTop = Number(marginTop.replace(/[^\d]/g, ''));
          subtractHeight += contentMarginTop;
        }
        setPageHeight?.(unref(contentHeight) - unref(footerHeight) - headerHeight - subtractHeight);
      }

      return {
        getContentStyle,
        footerRef,
        headerRef,
        getClass,
        getHeaderSlots,
        prefixCls,
        getShowFooter,
        pageHeight,
        omit,
        getContentClass,
      };
    },
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
