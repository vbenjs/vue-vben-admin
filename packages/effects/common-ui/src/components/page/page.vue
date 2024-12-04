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
import { cn } from '@vben-core/shared/utils';

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

const headerHeight = ref(0);
const footerHeight = ref(0);
const shouldAutoHeight = ref(false);

const headerRef = useTemplateRef<HTMLDivElement>('headerRef');
const footerRef = useTemplateRef<HTMLDivElement>('footerRef');

const headerStyle = computed<StyleValue>(() => {
  return fixedHeader
    ? {
        position: 'sticky',
        zIndex: 200,
        top:
          preferences.header.mode === 'fixed' ? 'var(--vben-header-height)' : 0,
      }
    : undefined;
});

const contentStyle = computed(() => {
  if (autoContentHeight) {
    return {
      height: shouldAutoHeight.value
        ? `calc(var(--vben-content-height) - ${headerHeight.value}px - ${footerHeight.value}px)`
        : '0',
      // 'overflow-y': shouldAutoHeight.value?'auto':'unset',
    };
  }
  return {};
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
          'bg-card relative px-6 py-4',
          headerClass,
          fixedHeader
            ? 'border-border border-b transition-all duration-200'
            : '',
        )
      "
      :style="headerStyle"
    >
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

      <div v-if="$slots.extra" class="absolute bottom-4 right-4">
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
          'bg-card align-center absolute bottom-0 left-0 right-0 flex px-6 py-4',
        )
      "
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>
