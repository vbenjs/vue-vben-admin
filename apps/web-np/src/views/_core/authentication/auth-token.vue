<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

import { VbenLoading } from '@vben/common-ui';
import { resetAllStores } from '@vben/stores';

import { useAuthStore } from '#/store';

const authStore = useAuthStore();
const route = useRoute();

onBeforeMount(() => {
  const queryParams = route.query;

  resetAllStores();

  authStore.authLoginViaToken(queryParams.token as string);
});
</script>

<template>
  <VbenLoading spinning text="Verifying token..." />
</template>
