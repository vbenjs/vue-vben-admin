<script lang="ts" setup>
import type { DrawerPlacement, DrawerState } from '@vben/common-ui';

import type { ExplicitDrawerData } from './typed-data-contract';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { Button, Card } from 'antdv-next';

import DocButton from '../doc-button.vue';
import AutoHeightDemo from './auto-height-demo.vue';
import BaseDemo from './base-demo.vue';
import DynamicDemo from './dynamic-demo.vue';
import FormDrawerDemo from './form-drawer-demo.vue';
import inContentDemo from './in-content-demo.vue';
import SharedDataDemo from './shared-data-demo.vue';
import TypedDataAutoDemo from './typed-data-auto-demo.vue';
import { useFactoryDrawer } from './typed-data-contract';
import TypedDataExplicitDemo from './typed-data-explicit-demo.vue';
import TypedDataFactoryDemo from './typed-data-factory-demo.vue';

defineOptions({ name: 'DrawerExample' });
const [BaseDrawer, baseDrawerApi] = useVbenDrawer({
  // 连接抽离的组件
  connectedComponent: BaseDemo,
  // placement: 'left',
});

const [InContentDrawer, inContentDrawerApi] = useVbenDrawer({
  // 连接抽离的组件
  connectedComponent: inContentDemo,
  // placement: 'left',
});

const [AutoHeightDrawer, autoHeightDrawerApi] = useVbenDrawer({
  connectedComponent: AutoHeightDemo,
});

const [DynamicDrawer, dynamicDrawerApi] = useVbenDrawer({
  connectedComponent: DynamicDemo,
});

const [SharedDataDrawer, sharedDrawerApi] = useVbenDrawer({
  connectedComponent: SharedDataDemo,
});

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: FormDrawerDemo,
});

const [TypedDataAutoDrawer, typedDataAutoDrawerApi] = useVbenDrawer({
  connectedComponent: TypedDataAutoDemo,
});

const [TypedDataExplicitDrawer, typedDataExplicitDrawerApi] =
  useVbenDrawer<ExplicitDrawerData>({
    connectedComponent: TypedDataExplicitDemo,
  });

const [TypedDataFactoryDrawer, typedDataFactoryDrawerApi] = useFactoryDrawer({
  connectedComponent: TypedDataFactoryDemo,
});

function openBaseDrawer(placement: DrawerPlacement = 'right') {
  baseDrawerApi.setState({ placement }).open();
}

function openBlurDrawer() {
  baseDrawerApi.setState({ overlayBlur: 5 }).open();
}

function openInContentDrawer(placement: DrawerPlacement = 'right') {
  const state: Partial<DrawerState> = { class: '', placement };
  if (placement === 'top') {
    // 页面顶部区域的层级只有200，所以设置一个低于200的值，抽屉从顶部滑出来的时候才比较合适
    state.zIndex = 199;
  }
  inContentDrawerApi.setState(state).open();
}

function openMaxContentDrawer() {
  // 这里只是用来演示方便。实际上自己使用的时候可以直接将这些配置写在Drawer的属性里
  inContentDrawerApi.setState({ class: 'w-full', placement: 'right' }).open();
}

function openAutoHeightDrawer() {
  autoHeightDrawerApi.open();
}

function openDynamicDrawer() {
  dynamicDrawerApi.open();
}

function handleUpdateTitle() {
  dynamicDrawerApi.setState({ title: '外部动态标题' }).open();
}

function openSharedDrawer() {
  sharedDrawerApi
    .setData({
      content: '外部传递的数据 content',
      payload: '外部传递的数据 payload',
    })
    .open();
}

function openFormDrawer() {
  formDrawerApi
    .setData({
      // 表单值
      values: { field1: 'abc', field2: '123' },
    })
    .open();
}

function openTypedDataAutoDrawer() {
  typedDataAutoDrawerApi
    .setData({
      message: '外部无需声明泛型，由 connected component 自动推导。',
      method: '自动推导',
    })
    .open();
}

function openTypedDataExplicitDrawer() {
  typedDataExplicitDrawerApi
    .setData({
      message: '父子组件显式引用同一个数据类型。',
      method: '显式泛型',
    })
    .open();
}

function openTypedDataFactoryDrawer() {
  typedDataFactoryDrawerApi
    .setData({
      message: '父子组件复用预绑定的 typed composable。',
      method: '契约工厂',
    })
    .open();
}
</script>

<template>
  <Page
    auto-content-height
    description="抽屉组件通常用于在当前页面上显示一个覆盖层，用以展示重要信息或提供用户交互界面。"
    title="抽屉组件示例"
  >
    <template #extra>
      <DocButton path="/components/common-ui/vben-drawer" />
    </template>
    <BaseDrawer />
    <InContentDrawer />
    <AutoHeightDrawer />
    <DynamicDrawer />
    <SharedDataDrawer />
    <FormDrawer />
    <TypedDataAutoDrawer />
    <TypedDataExplicitDrawer />
    <TypedDataFactoryDrawer />

    <Card class="mb-4" title="基本使用">
      <p class="mb-3">一个基础的抽屉示例</p>
      <Button class="mb-2" type="primary" @click="openBaseDrawer('right')">
        右侧打开
      </Button>
      <Button
        class="mb-2 ml-2"
        type="primary"
        @click="openBaseDrawer('bottom')"
      >
        底部打开
      </Button>
      <Button class="mb-2 ml-2" type="primary" @click="openBaseDrawer('left')">
        左侧打开
      </Button>
      <Button class="mb-2 ml-2" type="primary" @click="openBaseDrawer('top')">
        顶部打开
      </Button>
      <Button class="mb-2 ml-2" type="primary" @click="openBlurDrawer">
        遮罩层模糊效果
      </Button>
    </Card>

    <Card class="mb-4" title="在内容区域打开">
      <p class="mb-3">指定抽屉在内容区域打开，不会覆盖顶部和左侧菜单等区域</p>
      <Button class="mb-2" type="primary" @click="openInContentDrawer('right')">
        右侧打开
      </Button>
      <Button
        class="mb-2 ml-2"
        type="primary"
        @click="openInContentDrawer('bottom')"
      >
        底部打开
      </Button>
      <Button
        class="mb-2 ml-2"
        type="primary"
        @click="openInContentDrawer('left')"
      >
        左侧打开
      </Button>
      <Button
        class="mb-2 ml-2"
        type="primary"
        @click="openInContentDrawer('top')"
      >
        顶部打开
      </Button>
      <Button class="mb-2 ml-2" type="primary" @click="openMaxContentDrawer">
        内容区域全屏打开
      </Button>
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

    <Card class="mb-4" title="表单抽屉示例">
      <p class="mb-3">打开抽屉并设置表单schema以及数据</p>
      <Button type="primary" @click="openFormDrawer">
        打开抽屉并设置表单schema以及数据
      </Button>
    </Card>

    <Card class="mb-4" title="共享数据：自动推导">
      <p class="mb-3">
        子组件 expose API，父组件从 connected component 推导类型
      </p>
      <Button type="primary" @click="openTypedDataAutoDrawer">
        打开自动推导示例
      </Button>
    </Card>

    <Card class="mb-4" title="共享数据：显式泛型">
      <p class="mb-3">无法自动推导时，父子组件显式引用同一个数据类型</p>
      <Button type="primary" @click="openTypedDataExplicitDrawer">
        打开显式泛型示例
      </Button>
    </Card>

    <Card class="mb-4" title="共享数据：契约工厂">
      <p class="mb-3">
        通过 createVbenDrawer 预绑定类型并复用 typed composable
      </p>
      <Button type="primary" @click="openTypedDataFactoryDrawer">
        打开契约工厂示例
      </Button>
    </Card>
  </Page>
</template>
