<template>
  <div class="mx-2">
    <Tabs>
      <TabPane key="started" tab="报名中">
        <MeetingList :params="startedParams" />
      </TabPane>
      <TabPane key="future" tab="筹备中">
        <MeetingList :params="futureParams" />
      </TabPane>
      <TabPane key="end" tab="已结束">
        <MeetingList :params="endParams" />
      </TabPane>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
  import MeetingList from './components/meeting-list.vue';
  import { Tabs, TabPane } from 'ant-design-vue';

  const startedParams = {
    filter: {
      register_started: true,
    },
  };

  const endParams = {
    filter: {
      register_end: true,
    },
  };

  const futureParams = {
    filter: {
      register_future: true,
    },
  };
</script>

<style></style>
