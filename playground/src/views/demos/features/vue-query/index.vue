<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { Card } from 'ant-design-vue';

import InfiniteQueries from './infinite-queries.vue';
import PaginatedQueries from './paginated-queries.vue';
import QueryRetries from './query-retries.vue';
</script>

<template>
  <Page title="Vue Query示例">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card title="分页查询">
        <PaginatedQueries />
      </Card>
      <Card title="无限滚动">
        <InfiniteQueries class="h-[300px] overflow-auto" />
      </Card>
      <Card title="错误重试">
        <QueryRetries />
      </Card>
    </div>
  </Page>
</template>
