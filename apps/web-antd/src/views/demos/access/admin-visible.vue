<script lang="ts" setup>
import { Fallback } from '@vben/universal-ui';

defineOptions({ name: 'AccessAdminVisible' });
</script>

<template>
  <Fallback
    description="当前页面仅 Admin 账号可见"
    status="comming-soon"
    title="页面访问测试"
  />
</template>
