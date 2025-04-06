<script lang="ts" setup>
import { computed } from 'vue';

import { AuthPageLayout } from '@vben/layouts';
import { preferences } from '@vben/preferences';

import { $t } from '#/locales';

const appName = computed(() => preferences.app.name);
const logo = computed(() => preferences.logo.source);
const clickLogo = () => {};
</script>

<template>
  <AuthPageLayout
    :app-name="appName"
    :logo="logo"
    :page-description="$t('authentication.pageDesc')"
    :page-title="$t('authentication.pageTitle')"
    :click-logo="clickLogo"
    form-width="w-[40%]"
    :toolbar="false"
    :copyright="false"
  >
    <template #slogan>
      <div class="auth-layout-bg">ss</div>
    </template>
    <!-- 自定义工具栏 -->
    <!-- <template #toolbar></template> -->
  </AuthPageLayout>
</template>

<style lang="scss">
$namespace: 'vben';

.#{$namespace}-auth-layout {
  &-panel-wrapper {
    @apply w-4/5 justify-start rounded-3xl;

    background-image: url('/login-bg.jpg');
    background-position: center;
    background-size: cover;
  }

  &-panel {
    @apply w-[22%];
  }
}

.auth-layout-bg {
  @apply absolute h-full w-full;

  background-image: url('/login-bg.jpg');
  background-position: center;
  background-size: cover;
}
</style>
