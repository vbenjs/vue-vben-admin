<script lang="ts" setup>
import { Fallback } from '@vben/universal-ui';

defineOptions({ name: 'AccessUserVisible' });
</script>

<template>
  <Fallback
    description="当前页面仅 User 可见"
    status="comming-soon"
    title="页面访问测试"
  />
</template>
