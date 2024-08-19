<script setup lang="ts">
import { computed } from 'vue';

import {
  AuthenticationColorToggle,
  AuthenticationLayoutToggle,
  LanguageToggle,
  ThemeToggle,
} from '../widgets';

interface Props {
  toolbarList?: ('color' | 'language' | 'layout' | 'theme')[];
}

defineOptions({
  name: 'AuthenticationToolbar',
});

const props = withDefaults(defineProps<Props>(), {
  toolbarList: () => ['color', 'language', 'layout', 'theme'],
});

const showColor = computed(() => props.toolbarList.includes('color'));
const showLayout = computed(() => props.toolbarList.includes('layout'));
const showLanguage = computed(() => props.toolbarList.includes('language'));
const showTheme = computed(() => props.toolbarList.includes('theme'));
</script>

<template>
  <div
    :class="{
      'bg-background dark:bg-accent rounded-3xl px-3 py-1':
        toolbarList.length > 1,
    }"
    class="flex-center absolute right-2 top-4"
  >
    <!-- Only show on medium and larger screens -->
    <div class="hidden md:flex">
      <AuthenticationColorToggle v-if="showColor" />
      <AuthenticationLayoutToggle v-if="showLayout" />
    </div>
    <!-- Always show Language and Theme toggles -->
    <LanguageToggle v-if="showLanguage" />
    <ThemeToggle v-if="showTheme" />
  </div>
</template>
