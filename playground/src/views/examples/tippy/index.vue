<script lang="ts" setup>
import { computed, reactive } from 'vue';

import { Page, Tippy } from '@vben/common-ui';

import { Button, Card, Flex } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

const props = reactive({
  animation: 'shift-away',
  arrow: true,
  content: '这是一个提示',
  delay: 200,
  duration: 200,
  followCursor: '',
  hideOnClick: '',
  maxWidth: 'none',
  placement: 'top',
  theme: 'dark',
});

const tippyProps = computed(() => {
  return {
    ...props,
    followCursor: ['', 'true'].includes(props.followCursor)
      ? !!props.followCursor
      : props.followCursor,
    hideOnClick: ['', 'true'].includes(props.hideOnClick)
      ? !!props.hideOnClick
      : props.hideOnClick,
  };
});

const [Form] = useVbenForm({
  handleValuesChange(values) {
    Object.assign(props, { ...values });
  },
  schema: [
    {
      component: 'Select',
      componentProps: {
        class: 'w-full',
        options: [
          { label: 'shift-away', value: 'shift-away' },
          { label: 'scale', value: 'scale' },
          { label: 'scale-extreme', value: 'scale-extreme' },
          { label: 'scale-subtle', value: 'scale-subtle' },
          { label: 'perspective', value: 'perspective' },
          { label: 'fade', value: 'fade' },
        ],
      },
      defaultValue: props.animation,
      fieldName: 'animation',
      label: '动画',
    },
    {
      component: 'InputNumber',
      defaultValue: props.duration,
      fieldName: 'duration',
      label: '动画时长',
    },
    {
      component: 'Input',
      defaultValue: props.content,
      fieldName: 'content',
      label: '内容',
    },
    {
      component: 'Switch',
      defaultValue: props.arrow,
      fieldName: 'arrow',
      label: '箭头',
    },
    {
      component: 'Select',
      componentProps: {
        class: 'w-full',
        options: [
          { label: '不跟随', value: '' },
          { label: '完全跟随', value: 'true' },
          { label: '仅横向', value: 'horizontal' },
          { label: '仅纵向', value: 'vertical' },
          { label: '仅初始', value: 'initial' },
        ],
      },
      defaultValue: props.followCursor,
      fieldName: 'followCursor',
      label: '跟随指针',
    },
    {
      component: 'Select',
      componentProps: {
        class: 'w-full',
        options: [
          { label: '否', value: '' },
          { label: '是', value: 'true' },
          { label: '仅内部点击', value: 'toggle' },
        ],
      },
      defaultValue: props.hideOnClick,
      fieldName: 'hideOnClick',
      label: '点击后隐藏',
    },
    {
      component: 'InputNumber',
      defaultValue: 100,
      fieldName: 'delay',
      label: '延时',
    },

    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: 'auto', value: 'auto' },
          { label: 'dark', value: 'dark' },
          { label: 'light', value: 'light' },
        ],
      },
      defaultValue: props.theme,
      fieldName: 'theme',
      label: '主题',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: 'none、200px',
      },
      defaultValue: props.maxWidth,
      fieldName: 'maxWidth',
      label: '最大宽度',
    },
    {
      component: 'Select',
      componentProps: {
        class: 'w-full',
        options: [
          { label: '顶部', value: 'top' },
          { label: '顶左', value: 'top-start' },
          { label: '顶右', value: 'top-end' },
          { label: '底部', value: 'bottom' },
          { label: '底左', value: 'bottom-start' },
          { label: '底右', value: 'bottom-end' },
          { label: '左侧', value: 'left' },
          { label: '左上', value: 'left-start' },
          { label: '左下', value: 'left-end' },
          { label: '右侧', value: 'right' },
          { label: '右上', value: 'right-start' },
          { label: '右下', value: 'right-end' },
        ],
      },
      defaultValue: 'top',
      fieldName: 'placement',
      label: '位置',
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
});

function goDoc() {
  window.open('https://atomiks.github.io/tippyjs/v6/all-props/');
}
</script>
<template>
  <Page title="Tippy">
    <template #description>
      <div class="flex items-center">
        <p>
          Tippy
          是一个轻量级的提示工具库，它可以用来创建各种交互式提示，如工具提示、引导提示等。
        </p>
        <Button type="link" size="small" @click="goDoc">查看文档</Button>
      </div>
    </template>
    <Card title="指令形式使用">
      <p class="mb-4">
        指令形式使用比较简洁，直接在需要展示tooltip的组件上用v-tippy传递配置，适用于固定内容的工具提示。
      </p>
      <Flex warp="warp" gap="20">
        <Button v-tippy="'这是一个提示，使用了默认的配置'">默认配置</Button>

        <Button
          v-tippy="{ theme: 'light', content: '这是一个提示，总是light主题' }"
        >
          指定主题
        </Button>
        <Button
          v-tippy="{
            theme: 'light',
            content: '这个提示将在点燃组件100毫秒后激活',
            delay: 100,
          }"
        >
          指定延时
        </Button>
        <Button
          v-tippy="{
            content: '本提示的动画为`scale`',
            animation: 'scale',
          }"
        >
          指定动画
        </Button>
      </Flex>
    </Card>
    <Card title="组件形式使用" class="mt-4">
      <div class="flex w-full justify-center">
        <Tippy v-bind="tippyProps">
          <Button>鼠标移到这个组件上来体验效果</Button>
        </Tippy>
      </div>

      <Form class="mt-4" />
      <template #actions>
        <p
          class="text-secondary-foreground hover:text-secondary-foreground cursor-default"
        >
          更多配置请
          <Button type="link" size="small" @click="goDoc">查看文档</Button>
          ，这里只列出了一些常用的配置
        </p>
      </template>
    </Card>
  </Page>
</template>
