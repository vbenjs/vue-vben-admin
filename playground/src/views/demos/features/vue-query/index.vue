<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { Card } from 'ant-design-vue';

import PaginatedQueries from './paginated-queries.vue';
import QueryRetries from './query-retries.vue';
</script>

<template>
  <Page title="Vue Query示例">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card title="错误重试">
        <QueryRetries />
      </Card>
      <Card title="分页查询">
        <PaginatedQueries />
      </Card>
      <Card title="无限滚动" />
    </div>
  </Page>
</template>
