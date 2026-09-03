<script setup lang="ts">
import type { StyleValue } from 'vue';

import type { PageProps } from './types';

import { computed } from 'vue';

import { cn } from '@vben-core/shared/utils';

defineOptions({
  name: 'Page',
});

const {
  autoContentHeight = false,
  heightOffset = 0,
  footerFixed = false,
} = defineProps<PageProps>();

const contentStyle = computed<StyleValue>(() => {
  if (!autoContentHeight) {
    return {};
  }

  return {
    '--page-content-height-offset': `${heightOffset}px`,
    // In auto-content-height mode the content region manages its own scrolling.
    // Size containment prevents the inner content's min-content height from
    // feeding back into the outer flex layout, which would clamp the content
    // region taller than the available space and push the layout footer below
    // the viewport (see https://github.com/vbenjs/vue-vben-admin/issues/5677).
    contain: 'size',
    marginBlockEnd: 'var(--page-content-height-offset)',
  };
});
</script>

<template>
  <div
    :class="
      cn(
        'relative flex h-full min-h-0 flex-col',
        autoContentHeight && 'overflow-hidden',
      )
    "
  >
    <div
      v-if="
        description ||
        $slots.description ||
        title ||
        $slots.title ||
        $slots.extra
      "
      :class="
        cn(
          'relative flex shrink-0 items-end border-b border-border bg-card px-6 py-4',
          headerClass,
        )
      "
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

      <div v-if="$slots.extra">
        <slot name="extra"></slot>
      </div>
    </div>

    <div
      data-layout-region="page-content"
      :class="
        cn(
          autoContentHeight ? 'min-h-0 flex-1 overflow-y-auto' : 'flex-1',
          'p-4',
          contentClass,
        )
      "
      :style="contentStyle"
    >
      <slot></slot>
    </div>
    <div
      v-if="$slots.footer"
      :class="
        cn(
          'align-center flex bg-card px-6 py-4',
          footerFixed ? 'mt-auto shrink-0' : 'shrink-0',
          footerClass,
        )
      "
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>
