<script lang="ts" setup>
import { Page, useVbenModal } from '@vben/common-ui';

import { Button, Card } from 'ant-design-vue';

import DocButton from '../doc-button.vue';
import AutoHeightDemo from './auto-height-demo.vue';
import BaseDemo from './base-demo.vue';
import DragDemo from './drag-demo.vue';
import DynamicDemo from './dynamic-demo.vue';
import FormModalDemo from './form-model-demo.vue';
import SharedDataDemo from './shared-data-demo.vue';

const [BaseModal, baseModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: BaseDemo,
});

const [AutoHeightModal, autoHeightModalApi] = useVbenModal({
  connectedComponent: AutoHeightDemo,
});

const [DragModal, dragModalApi] = useVbenModal({
  connectedComponent: DragDemo,
});

const [DynamicModal, dynamicModalApi] = useVbenModal({
  connectedComponent: DynamicDemo,
});

const [SharedDataModal, sharedModalApi] = useVbenModal({
  connectedComponent: SharedDataDemo,
});

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: FormModalDemo,
});

function openBaseModal() {
  baseModalApi.open();
}

function openAutoHeightModal() {
  autoHeightModalApi.open();
}

function openDragModal() {
  dragModalApi.open();
}

function openDynamicModal() {
  dynamicModalApi.open();
}

function openSharedModal() {
  sharedModalApi.setData({
    content: '外部传递的数据 content',
    payload: '外部传递的数据 payload',
  });
  sharedModalApi.open();
}

function handleUpdateTitle() {
  dynamicModalApi.setState({ title: '外部动态标题' });
  dynamicModalApi.open();
}

function openFormModal() {
  formModalApi.setData({
    // 表单值
    values: { field1: 'abc' },
  });
  formModalApi.open();
}
</script>

<template>
  <Page
    description="弹窗组件常用于在不离开当前页面的情况下，显示额外的信息、表单或操作提示，更多api请查看组件文档。"
    title="弹窗组件示例"
  >
    <template #extra>
      <DocButton path="/components/common-ui/vben-modal" />
    </template>
    <BaseModal />
    <AutoHeightModal />
    <DragModal />
    <DynamicModal />
    <SharedDataModal />
    <FormModal />
    <Card class="mb-4" title="基本使用">
      <p class="mb-3">一个基础的弹窗示例</p>
      <Button type="primary" @click="openBaseModal">打开弹窗</Button>
    </Card>

    <Card class="mb-4" title="内容高度自适应">
      <p class="mb-3">可根据内容并自动调整高度</p>
      <Button type="primary" @click="openAutoHeightModal">打开弹窗</Button>
    </Card>

    <Card class="mb-4" title="可拖拽示例">
      <p class="mb-3">配置 draggable 可开启拖拽功能</p>
      <Button type="primary" @click="openDragModal">打开弹窗</Button>
    </Card>

    <Card class="mb-4" title="动态配置示例">
      <p class="mb-3">通过 setState 动态调整弹窗数据</p>
      <Button type="primary" @click="openDynamicModal">打开弹窗</Button>
      <Button class="ml-2" type="primary" @click="handleUpdateTitle">
        从外部修改标题并打开
      </Button>
    </Card>

    <Card class="mb-4" title="内外数据共享示例">
      <p class="mb-3">通过共享 sharedData 来进行数据交互</p>
      <Button type="primary" @click="openSharedModal">
        打开弹窗并传递数据
      </Button>
    </Card>

    <Card class="mb-4" title="表单弹窗示例">
      <p class="mb-3">弹窗与表单结合</p>
      <Button type="primary" @click="openFormModal"> 打开弹窗 </Button>
    </Card>
  </Page>
</template>
