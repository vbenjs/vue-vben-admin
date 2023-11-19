<template>
  <PageWrapper title="时间组件示例">
    <CollapseContainer title="基础示例">
      <Time :value="state.time1" />
      <br />
      <Time :value="state.time2" />
    </CollapseContainer>

    <CollapseContainer title="定时更新" class="my-4">
      <Time :value="now" :step="1" />
      <br />
      <Time :value="now" :step="5" />
    </CollapseContainer>

    <CollapseContainer title="定时更新">
      <Time :value="now" mode="date" />
      <br />
      <Time :value="now" mode="datetime" />
      <br />
      <Time :value="now" />
    </CollapseContainer>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { PageWrapper } from '@/components/Page';
  import { Time } from '@/components/Time';
  import { CollapseContainer } from '@/components/Container';

  const now = new Date().getTime();
  const state = reactive({
    time1: now - 60 * 3 * 1000,
    time2: now - 86400 * 3 * 1000,
  });
</script>
