<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import { queryOptions, useQuery, useQueryClient } from '@tanstack/vue-query';

import { useVbenForm } from '#/adapter/form';
import { getMenuList } from '#/api';

const count = 4;
// 缓存时间
const staleTime = 1000 * 60 * 5;

// 公共查询配置：useQuery 与 fetchQuery 共用
const menuQueryOptions = queryOptions({
  // 获取接口数据的函数
  queryFn: getMenuList,
  queryKey: ['demo', 'api', 'options'],
  staleTime,
});

const queryClient = useQueryClient();

const { dataUpdatedAt } = useQuery(menuQueryOptions);

async function fetchOptions() {
  // 并发调用时 fetchQuery 会合并相同 queryKey 的请求，只发一次；
  // 失败时显式记录日志并回退为空列表，避免未处理的 rejection
  try {
    return await queryClient.fetchQuery(menuQueryOptions);
  } catch (error) {
    console.error('Failed to fetch menu options:', error);
    return [];
  }
}

const schema = [];

for (let i = 0; i < count; i++) {
  schema.push({
    component: 'ApiSelect',
    componentProps: {
      api: fetchOptions,
      class: 'w-full',
      filterOption: (input: string, option: Recordable<any>) => {
        return option.label.toLowerCase().includes(input.toLowerCase());
      },
      labelField: 'name',
      showSearch: true,
      valueField: 'id',
    },
    fieldName: `field${i}`,
    label: `Select ${i}`,
  });
}

const [Form] = useVbenForm({
  schema,
  showDefaultActions: false,
});
</script>
<template>
  <div>
    <div class="mb-2 flex gap-2">
      <div>以下{{ count }}个组件共用一个数据源。</div>
      <div>缓存更新时间：{{ new Date(dataUpdatedAt).toLocaleString() }}</div>
    </div>
    <Form />
  </div>
</template>
