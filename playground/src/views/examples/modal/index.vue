<script lang="ts" setup>
import { Page, useVbenModal } from '@vben/common-ui';

import { Button, Card, Flex } from 'ant-design-vue';

import DocButton from '../doc-button.vue';
import AutoHeightDemo from './auto-height-demo.vue';
import BaseDemo from './base-demo.vue';
import BlurDemo from './blur-demo.vue';
import DragDemo from './drag-demo.vue';
import DynamicDemo from './dynamic-demo.vue';
import FormModalDemo from './form-modal-demo.vue';
import InContentModalDemo from './in-content-demo.vue';
import NestedDemo from './nested-demo.vue';
import SharedDataDemo from './shared-data-demo.vue';

defineOptions({ name: 'ModalExample' });

const [BaseModal, baseModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: BaseDemo,
});

const [InContentModal, inContentModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: InContentModalDemo,
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

const [NestedModal, nestedModalApi] = useVbenModal({
  connectedComponent: NestedDemo,
});

const [BlurModal, blurModalApi] = useVbenModal({
  connectedComponent: BlurDemo,
});

function openBaseModal() {
  baseModalApi.open();
}

function openInContentModal() {
  inContentModalApi.open();
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
  sharedModalApi
    .setData({
      content: '外部传递的数据 content',
      payload: '外部传递的数据 payload',
    })
    .open();
}

function openNestedModal() {
  nestedModalApi.open();
}

function openBlurModal() {
  blurModalApi.open();
}

function handleUpdateTitle() {
  dynamicModalApi.setState({ title: '外部动态标题' }).open();
}

function openFormModal() {
  formModalApi
    .setData({
      // 表单值
      values: { field1: 'abc', field2: '123' },
    })
    .open();
}
</script>

<template>
  <Page
    auto-content-height
    description="弹窗组件常用于在不离开当前页面的情况下，显示额外的信息、表单或操作提示，更多api请查看组件文档。"
    title="弹窗组件示例"
  >
    <template #extra>
      <DocButton path="/components/common-ui/vben-modal" />
    </template>
    <BaseModal />
    <InContentModal />
    <AutoHeightModal />
    <DragModal />
    <DynamicModal />
    <SharedDataModal />
    <FormModal />
    <NestedModal />
    <BlurModal />
    <Flex wrap="wrap" class="w-full" gap="10">
      <Card class="w-[300px]" title="基本使用">
        <p>一个基础的弹窗示例</p>
        <template #actions>
          <Button type="primary" @click="openBaseModal">打开弹窗</Button>
        </template>
      </Card>

      <Card class="w-[300px]" title="指定容器">
        <p>在内容区域打开弹窗的示例</p>
        <template #actions>
          <Button type="primary" @click="openInContentModal">打开弹窗</Button>
        </template>
      </Card>

      <Card class="w-[300px]" title="内容高度自适应">
        <p>可根据内容并自动调整高度</p>
        <template #actions>
          <Button type="primary" @click="openAutoHeightModal">
            打开弹窗
          </Button>
        </template>
      </Card>

      <Card class="w-[300px]" title="可拖拽示例">
        <p>配置 draggable 可开启拖拽功能</p>
        <template #actions>
          <Button type="primary" @click="openDragModal"> 打开弹窗 </Button>
        </template>
      </Card>

      <Card class="w-[300px]" title="动态配置示例">
        <p>通过 setState 动态调整弹窗数据</p>
        <template #extra>
          <Button type="link" @click="openDynamicModal">打开弹窗</Button>
        </template>
        <template #actions>
          <Button type="primary" @click="handleUpdateTitle">
            外部修改标题并打开
          </Button>
        </template>
      </Card>

      <Card class="w-[300px]" title="内外数据共享示例">
        <p>通过共享 sharedData 来进行数据交互</p>
        <template #actions>
          <Button type="primary" @click="openSharedModal">
            打开弹窗并传递数据
          </Button>
        </template>
      </Card>

      <Card class="w-[300px]" title="表单弹窗示例">
        <p>弹窗与表单结合</p>
        <template #actions>
          <Button type="primary" @click="openFormModal"> 打开表单弹窗 </Button>
        </template>
      </Card>

      <Card class="w-[300px]" title="嵌套弹窗示例">
        <p>在已经打开的弹窗中再次打开弹窗</p>
        <template #actions>
          <Button type="primary" @click="openNestedModal">打开嵌套弹窗</Button>
        </template>
      </Card>

      <Card class="w-[300px]" title="遮罩模糊示例">
        <p>遮罩层应用类似毛玻璃的模糊效果</p>
        <template #actions>
          <Button type="primary" @click="openBlurModal">打开弹窗</Button>
        </template>
      </Card>
    </Flex>
  </Page>
</template>
