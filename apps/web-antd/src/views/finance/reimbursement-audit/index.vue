<script setup lang="ts">
import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Tabs } from 'ant-design-vue';

import ApprovalList from '#/views/sys/approval-process/ApprovalList.vue';

const activeBusinessTab = ref<'expense' | 'loan' | 'refund'>('expense');
const activeStatusTab = ref<'approved' | 'done' | 'my-todo'>('my-todo');

const businessTitleMap: Record<'expense' | 'loan' | 'refund', string> = {
  expense: '报账审核',
  loan: '借款审核',
  refund: '退款审核',
};

const pageDescription = computed(
  () => `统一审批工作台，当前查看：${businessTitleMap[activeBusinessTab.value]}`,
);
</script>

<template>
  <Page title="报账审核台" :description="pageDescription">
    <Tabs v-model:activeKey="activeBusinessTab" class="px-4 pt-4">
      <Tabs.TabPane key="expense" tab="报账审核" />
      <Tabs.TabPane key="loan" tab="借款审核" />
      <Tabs.TabPane key="refund" tab="退款审核" />
    </Tabs>

    <Tabs v-model:activeKey="activeStatusTab" class="px-4 pb-4">
      <Tabs.TabPane key="my-todo" tab="待办" />
      <Tabs.TabPane key="done" tab="已办" />
      <Tabs.TabPane key="approved" tab="办结" />
    </Tabs>

    <div class="px-4 pb-4">
      <ApprovalList
        :title="businessTitleMap[activeBusinessTab]"
        description="统一审核台，支持按业务分类与办理状态切换。"
        :query-type="activeStatusTab"
        :business-category="activeBusinessTab"
        embedded
      />
    </div>
  </Page>
</template>
