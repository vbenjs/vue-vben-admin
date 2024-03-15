<template>
  <div class="full-height">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { useProviderDict } from './hooks/useProviderDict';

  useProviderDict();
</script>
