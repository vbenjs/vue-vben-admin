<script setup lang="ts">
import { useNamespace } from '@vben-core/toolkit';

defineOptions({
  name: 'ChromeTabBackground',
});

const { b, e } = useNamespace('chrome-tab-background');
</script>

<template>
  <div :class="b()" class="absolute size-full">
    <div
      :class="e('divider')"
      class="absolute left-0 h-full before:absolute before:right-[100%] before:top-[15%] before:h-[60%] before:w-[1px] before:content-[''] after:absolute after:top-[15%] after:h-[60%] after:w-[1px] after:content-['']"
    ></div>
    <div :class="e('content')" class="h-full"></div>
    <svg
      :class="e('before')"
      class="absolute fill-transparent"
      height="10"
      width="10"
    >
      <path d="M 0 10 A 10 10 0 0 0 10 0 L 10 10 Z" />
    </svg>
    <svg
      :class="e('after')"
      class="absolute fill-transparent"
      height="10"
      width="10"
    >
      <path d="M 0 0 A 10 10 0 0 0 10 10 L 0 10 Z" />
    </svg>
  </div>
</template>
