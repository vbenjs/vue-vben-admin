<script lang="ts" setup>
import { onBeforeMount } from 'vue';

import { VbenLoading } from '@vben/common-ui';

import { authInNewTab } from '#/shared/utils';

onBeforeMount(() => {
  authInNewTab();
});
</script>

<template>
  <VbenLoading spinning text="Shopify verifying..." />
</template>
