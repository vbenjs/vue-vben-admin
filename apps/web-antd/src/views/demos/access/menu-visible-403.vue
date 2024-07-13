<script lang="ts" setup>
import { Fallback } from '@vben/universal-ui';

defineOptions({ name: 'AccessFrontendAccessTest2' });
</script>

<template>
  <Fallback
    description="当前页面用户不可见，会被重定向到403页面"
    status="comming-soon"
    title="页面访问测试"
  />
</template>
