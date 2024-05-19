<script setup lang="ts">
import {
  AuthenticationColorToggle,
  AuthenticationLayoutToggle,
  LanguageToggle,
  ThemeToggle,
} from '@vben/common-ui';

defineOptions({
  name: 'AuthenticationToolbar',
});
</script>
<template>
  <div
    class="flex-center bg-background absolute right-2 top-4 rounded-3xl px-3 py-1 dark:bg-[var(--color-authentication-to)]"
  >
    <div class="hidden md:flex">
      <AuthenticationColorToggle />
      <AuthenticationLayoutToggle />
    </div>
    <LanguageToggle />
    <ThemeToggle />
  </div>
</template>
