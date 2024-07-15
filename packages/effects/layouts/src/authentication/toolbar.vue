<script setup lang="ts">
import {
  AuthenticationColorToggle,
  AuthenticationLayoutToggle,
  LanguageToggle,
  ThemeToggle,
} from '../widgets';

defineOptions({
  name: 'AuthenticationToolbar',
});
</script>

<template>
  <div
    class="flex-center bg-background dark:bg-accent absolute right-2 top-4 rounded-3xl px-3 py-1"
  >
    <!-- Only show on medium and larger screens -->
    <div class="hidden md:flex">
      <AuthenticationColorToggle />
      <AuthenticationLayoutToggle />
    </div>
    <!-- Always show Language and Theme toggles -->
    <LanguageToggle />
    <ThemeToggle />
  </div>
</template>
