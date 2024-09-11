<template>
  <PageWrapper title="Ripple示例">
    <div
      class="flex item-center justify-center w-75 h-75 border-2 bg-blue-500 text-white text-24px"
      v-ripple
    >
      content
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import RippleDirective from '@/directives/ripple';
  import { PageWrapper } from '@/components/Page';

  const vRipple = RippleDirective;
</script>
