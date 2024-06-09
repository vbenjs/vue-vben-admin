<script setup lang="ts">
import { useNamespace } from '@vben-core/toolkit';

defineOptions({
  name: 'ChromeTabBackground',
});

const { b, e } = useNamespace('chrome-tab-background');
</script>

<template>
  <div :class="b()">
    <div :class="e('divider')"></div>
    <div :class="e('content')"></div>
    <svg :class="e('before')" height="10" width="10">
      <path d="M 0 10 A 10 10 0 0 0 10 0 L 10 10 Z" />
    </svg>
    <svg :class="e('after')" height="10" width="10">
      <path d="M 0 0 A 10 10 0 0 0 10 10 L 0 10 Z" />
    </svg>
  </div>
</template>
