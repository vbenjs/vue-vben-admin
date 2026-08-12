<script lang="ts" setup>
import type { RadioGroupProps } from 'antdv-next';

import type { FormLayout } from '@vben/common-ui';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, message, RadioGroup, Space } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';

import DocButton from '../doc-button.vue';

type LabelWidthMode = '8rem' | '100' | '150' | 'auto';

const layouts: RadioGroupProps['options'] = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' },
];

const labelWidthModes: RadioGroupProps['options'] = [
  { label: 'auto', value: 'auto' },
  { label: '100px', value: '100' },
  { label: '150px', value: '150' },
  { label: '8rem', value: '8rem' },
];

const layout = ref<FormLayout>('horizontal');
const labelWidthMode = ref<LabelWidthMode>('auto');

function resolveLabelWidth(mode: LabelWidthMode): number | string {
  switch (mode) {
    case '8rem': {
      return '8rem';
    }
    case '100': {
      return 100;
    }
    case '150': {
      return 150;
    }
    default: {
      return 'auto';
    }
  }
}

const [BaseForm, formApi] = useVbenForm({
  commonConfig: {
    colon: true,
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 'auto',
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: [
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      defaultValue: true,
      fieldName: 'showExtra',
      help: '关闭后超长标签会卸载，auto 宽度会按剩余 label 重算',
      label: '显示超长字段',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '短标签',
      },
      fieldName: 'name',
      label: '姓名',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '中等长度标签',
      },
      fieldName: 'email',
      label: '电子邮箱',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '较长标签，用于撑开 auto 宽度',
      },
      fieldName: 'organization',
      label: '所属组织 / 部门名称',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '启用', value: 'enabled' },
          { label: '禁用', value: 'disabled' },
        ],
        placeholder: '请选择',
      },
      fieldName: 'status',
      label: '状态',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '使用 labelClass: w-32，不受 labelWidth 控制',
      },
      fieldName: 'fixedClass',
      label: '固定 class',
      labelClass: 'w-32',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '切换上方开关后，auto 宽度会重新计算',
      },
      dependencies: {
        if(values) {
          return !!values.showExtra;
        },
        triggerFields: ['showExtra'],
      },
      fieldName: 'extraLongLabel',
      label: '这是一个会动态显示的超长标签字段',
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: '备注',
        rows: 3,
      },
      fieldName: 'remark',
      formItemClass: 'items-start',
      label: '备注',
    },
  ],
  wrapperClass: 'grid-cols-1',
});

function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}

function syncFormState() {
  formApi.setState({
    commonConfig: {
      labelWidth: resolveLabelWidth(labelWidthMode.value),
    },
    layout: layout.value,
  });
}
</script>

<template>
  <Page
    content-class="flex flex-col gap-4"
    description="设置 labelWidth: 'auto' 后，水平布局会按当前可见 label 的最大宽度自动对齐。"
    title="Label 自动宽度"
  >
    <template #description>
      <div class="text-muted-foreground">
        <p>
          设置
          <code>labelWidth: 'auto'</code>
          后，水平布局会按当前可见 label 的最大宽度自动对齐；垂直布局或
          <code>labelClass</code>
          含
          <code>w-*</code>
          时不生效。
        </p>
      </div>
    </template>
    <template #extra>
      <DocButton class="mb-2" path="/components/common-ui/vben-form" />
    </template>

    <Card title="labelWidth: auto">
      <template #extra>
        <Space wrap>
          <RadioGroup
            v-model:value="layout"
            :options="layouts"
            option-type="button"
            @change="syncFormState"
          />
          <RadioGroup
            v-model:value="labelWidthMode"
            :options="labelWidthModes"
            option-type="button"
            @change="syncFormState"
          />
        </Space>
      </template>
      <div class="max-w-2xl">
        <BaseForm />
      </div>
    </Card>
  </Page>
</template>
