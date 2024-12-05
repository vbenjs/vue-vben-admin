<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  ref,
  type StyleValue,
  useTemplateRef,
} from 'vue';

import { preferences } from '@vben-core/preferences';
import {
  CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT,
  CSS_VARIABLE_LAYOUT_CONTENT_WIDTH,
  CSS_VARIABLE_LAYOUT_FOOTER_HEIGHT,
  CSS_VARIABLE_LAYOUT_HEADER_HEIGHT,
} from '@vben-core/shared/constants';
import { cn } from '@vben-core/shared/utils';

import { useElementSize } from '@vueuse/core';

interface Props {
  title?: string;
  description?: string;
  contentClass?: string;
  /**
   * 根据content可见高度自适应
   */
  autoContentHeight?: boolean;
  /** 头部固定 */
  fixedHeader?: boolean;
  headerClass?: string;
  footerClass?: string;
}

defineOptions({
  name: 'Page',
});

const {
  contentClass = '',
  description = '',
  autoContentHeight = false,
  title = '',
  fixedHeader = false,
} = defineProps<Props>();

const shouldAutoHeight = ref(false);

const headerRef = useTemplateRef<HTMLDivElement>('headerRef');
const footerRef = useTemplateRef<HTMLDivElement>('footerRef');
const { height: headerHeight } = useElementSize(
  headerRef,
  {
    height: 0,
    width: 0,
  },
  { box: 'border-box' },
);
const { height: footerHeight } = useElementSize(
  footerRef,
  {
    height: 0,
    width: 0,
  },
  { box: 'border-box' },
);

const headerStyle = computed<StyleValue>(() => {
  return fixedHeader
    ? {
        position: 'fixed',
        zIndex: 200,
        width: `var(${CSS_VARIABLE_LAYOUT_CONTENT_WIDTH})`,
        top:
          preferences.header.mode === 'fixed'
            ? `var(${CSS_VARIABLE_LAYOUT_HEADER_HEIGHT})`
            : 0,
      }
    : undefined;
});

const footerStyle = computed<StyleValue>(() => {
  return {
    bottom:
      preferences.footer.enable && preferences.footer.fixed
        ? `var(${CSS_VARIABLE_LAYOUT_FOOTER_HEIGHT})`
        : 0,
    width: `var(${CSS_VARIABLE_LAYOUT_CONTENT_WIDTH})`,
  };
});

const contentStyle = computed(() => {
  const style: StyleValue = {};
  if (headerHeight.value > 0 && fixedHeader) {
    style.marginTop = `${headerHeight.value}px`;
  }
  if (footerHeight.value > 0) {
    style.marginBottom = `${footerHeight.value}px`;
  }
  if (autoContentHeight) {
    style.height = shouldAutoHeight.value
      ? `calc(var(${CSS_VARIABLE_LAYOUT_CONTENT_HEIGHT}) - ${headerHeight.value}px - ${footerHeight.value}px)`
      : '0';
  }
  return style;
});

async function calcContentHeight() {
  if (!autoContentHeight) {
    return;
  }
  await nextTick();
  headerHeight.value = headerRef.value?.offsetHeight || 0;
  footerHeight.value = footerRef.value?.offsetHeight || 0;
  setTimeout(() => {
    shouldAutoHeight.value = true;
  }, 30);
}

onMounted(() => {
  calcContentHeight();
});
</script>

<template>
  <div class="relative">
    <div
      v-if="
        description ||
        $slots.description ||
        title ||
        $slots.title ||
        $slots.extra
      "
      ref="headerRef"
      :class="
        cn(
          'bg-card relative flex gap-2 px-6 py-4',
          headerClass,
          fixedHeader
            ? 'border-border border-b transition-all duration-200'
            : '',
        )
      "
      :style="headerStyle"
    >
      <div class="flex-auto">
        <slot name="title">
          <div v-if="title" class="mb-2 flex text-lg font-semibold">
            {{ title }}
          </div>
        </slot>

        <slot name="description">
          <p v-if="description" class="text-muted-foreground">
            {{ description }}
          </p>
        </slot>
      </div>

      <div v-if="$slots.extra" class="mb-2 self-end">
        <slot name="extra"></slot>
      </div>
    </div>

    <div :class="contentClass" :style="contentStyle" class="h-full p-4">
      <slot></slot>
    </div>

    <div
      v-if="$slots.footer"
      ref="footerRef"
      :class="
        cn(
          footerClass,
          'bg-card align-center border-border fixed right-0 flex border-t px-6 py-4 transition-all duration-200',
        )
      "
      :style="footerStyle"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>
