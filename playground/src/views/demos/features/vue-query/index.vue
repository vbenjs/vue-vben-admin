<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { Card } from 'ant-design-vue';

import Retry from './retry.vue';
</script>

<template>
  <Page title="Vue Query示例">
    <Card title="错误重试">
      <Retry />
    </Card>
  </Page>
</template>
