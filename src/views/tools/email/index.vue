<template>
  <div class="email-tabs">
    <Tabs
      tab-position="top"
      :tabBarStyle="{
        marginLeft: '1rem',
      }"
      activeKey="2"
    >
      <template v-for="item in tabList" :key="item.key">
        <TabPane :tab="item.name">
          <component :is="item.component" />
        </TabPane>
      </template>
    </Tabs>
  </div>
</template>

<script lang="ts" setup name="邮件工具">
  import { Tabs } from 'ant-design-vue';
  import { defineAsyncComponent } from 'vue';

  const tabList = [
    // {
    //   key: '1',
    //   name: '邮箱配置',
    //   component: defineAsyncComponent(() => import('./BaseConfig.vue')),
    // },
    {
      key: '2',
      name: '发送邮件',
      component: defineAsyncComponent(() => import('./SendEmail.vue')),
    },
  ];

  const TabPane = Tabs.TabPane;
</script>

<style lang="less" scoped>
  .email-tabs {
    margin: 12px;
    background-color: @component-background;

    .base-title {
      padding-left: 0;
    }
  }
</style>
