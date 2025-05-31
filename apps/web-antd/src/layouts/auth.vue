<script lang="ts" setup>
// import { computed } from 'vue';

import { AuthPageLayout } from '@vben/layouts';
// import { preferences } from '@vben/preferences';

import { $t } from '#/locales';

import sloganImg from '/static/slogan.jpg';
// const appName = computed(() => preferences.app.name);
// const logo = computed(() => preferences.logo.source);
</script>

<template>
  <AuthPageLayout
    :copyright="true"
    :toolbar="false"
    app-name=""
    logo=""
    :slogan-image="sloganImg"
    :page-description="$t('authentication.pageDesc')"
    :page-title="$t('authentication.pageTitle')"
  >
    <!-- 自定义工具栏 -->
    <!-- <template #toolbar></template> -->
  </AuthPageLayout>
</template>
