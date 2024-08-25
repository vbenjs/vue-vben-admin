<script lang="ts" setup>
import { Page, useVbenDrawer } from '@vben/common-ui';

import { Button, Card } from 'ant-design-vue';

import AutoHeightDemo from './auto-height-demo.vue';
import BaseDemo from './base-demo.vue';
import DynamicDemo from './dynamic-demo.vue';
import SharedDataDemo from './shared-data-demo.vue';

const [BaseDrawer, baseDrawerApi] = useVbenDrawer({
  // 链接抽离的组件
  connectedComponent: BaseDemo,
});

const [AutoHeightDrawer, autoHeightDrawerApi] = useVbenDrawer({
  // 链接抽离的组件
  connectedComponent: AutoHeightDemo,
});

const [DynamicDrawer, dynamicDrawerApi] = useVbenDrawer({
  connectedComponent: DynamicDemo,
});

const [SharedDataDrawer, sharedDrawerApi] = useVbenDrawer({
  connectedComponent: SharedDataDemo,
});

function openBaseDrawer() {
  baseDrawerApi.open();
}

function openAutoHeightDrawer() {
  autoHeightDrawerApi.open();
}

function openDynamicDrawer() {
  dynamicDrawerApi.open();
}

function handleUpdateTitle() {
  dynamicDrawerApi.setState({ title: '外部动态标题' });
  dynamicDrawerApi.open();
}

function openSharedDrawer() {
  sharedDrawerApi.setData({
    content: '外部传递的数据 content',
    payload: '外部传递的数据 payload',
  });
  sharedDrawerApi.open();
}
</script>

<template>
  <Page
    description="抽屉组件通常用于在当前页面上显示一个覆盖层，用以展示重要信息或提供用户交互界面。"
    title="抽屉组件示例"
  >
    <BaseDrawer />
    <AutoHeightDrawer />
    <DynamicDrawer />
    <SharedDataDrawer />

    <Card class="mb-4" title="基本使用">
      <p class="mb-3">一个基础的抽屉示例</p>
      <Button type="primary" @click="openBaseDrawer">打开抽屉</Button>
    </Card>

    <Card class="mb-4" title="内容高度自适应滚动">
      <p class="mb-3">可根据内容自动计算滚动高度</p>
      <Button type="primary" @click="openAutoHeightDrawer">打开抽屉</Button>
    </Card>

    <Card class="mb-4" title="动态配置示例">
      <p class="mb-3">通过 setState 动态调整抽屉数据</p>
      <Button type="primary" @click="openDynamicDrawer">打开抽屉</Button>
      <Button class="ml-2" type="primary" @click="handleUpdateTitle">
        从外部修改标题并打开
      </Button>
    </Card>

    <Card class="mb-4" title="内外数据共享示例">
      <p class="mb-3">通过共享 sharedData 来进行数据交互</p>
      <Button type="primary" @click="openSharedDrawer">
        打开抽屉并传递数据
      </Button>
    </Card>
  </Page>
</template>
