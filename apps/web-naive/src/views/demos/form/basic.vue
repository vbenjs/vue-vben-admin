<script lang="ts" setup>
import type { CollapsibleParamSchema } from '@vben-core/shadcn-ui';

import { ref } from 'vue';

import { Page, useVbenModal, z } from '@vben/common-ui';

import { VbenCollapsibleParams } from '@vben-core/shadcn-ui';

import {
  NButton,
  NCard,
  NRadioButton,
  NRadioGroup,
  useMessage,
} from 'naive-ui';

import { useVbenForm } from '#/adapter/form';
import { getAllMenusApi } from '#/api';

import modalDemo from './modal.vue';

const message = useMessage();

const layouts = [
  { label: 'Vertical', value: 'vertical' },
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Inline', value: 'inline' },
];
const layout = ref(layouts[0].value);

function getNumberValidator(key: string, limit?: [number, number]) {
  let validator = z.number({
    required_error: `${key} 值不能为空`,
    invalid_type_error: `${key} 值只能为数字`,
  });

  if (limit) {
    validator = validator
      .min(limit[0], { message: `${key} 值不在区间范围内` })
      .max(limit[1], { message: `${key} 值不在区间范围内` });
  }

  return validator.default(null);
}

const paramsSchema = [
  {
    key: 'micro_batch_size',
    description: `批次大小，代表模型训练过程中，模型更新模型参数的数据步长，可理解为模型每看多少数据即更新一次模型参数，
    一般建议的批次大小为16/32，表示模型每看16或32条数据即更新一次参数`,
    // defaultValue: 8,
    option: {
      min: 8,
      max: 1024,
      step: 8,
    },
  },
  {
    key: 'learning_rate',
    description:
      '学习率，代表每次更新数据的增量参数权重，学习率数值越大参数变化越大，对模型影响越大',
    // defaultValue: 1e-5,
    option: {
      step: 1e-4,
      type: 'exponential',
    },
  },
  {
    key: 'eval_steps',
    description:
      '验证步数，训练阶段针模型的验证间隔步长，用于阶段性评估模型训练准确率、训练损失',
    // defaultValue: 50,
    option: {
      min: 1,
      max: 2_147_483_647,
    },
  },
  {
    key: 'num_train_epochs',
    description:
      '循环次数，代表模型训练过程中模型学习数据集的次数，可理解为看几遍数据，一般建议的范围是1-3遍即可，可依据需求进行调整',
    // defaultValue: 3,
    option: {
      min: 1,
      max: 200,
    },
  },
  {
    key: 'max_length',
    description: `序列长度，单个训练数据样本的最大长度，超出配置长度将丢弃`,
    // defaultValue: 32_768,
    option: {
      min: 500,
      max: 131_072,
    },
  },
  {
    key: 'warmup_ratio',
    description: '学习率预热比例，学习率预热阶段占总训练步数的比例',
    // defaultValue: 0.05,
    option: {
      min: 0,
      max: 1,
      precision: 2,
      step: 0.01,
    },
  },
  {
    key: 'save_steps',
    description: 'Checkpoint保存间隔',
    // defaultValue: 50,
    option: {
      min: 1,
      max: 2_147_483_647,
    },
  },
] as CollapsibleParamSchema[];

const paramsValidator = z.object({
  micro_batch_size: getNumberValidator('micro_batch_size', [8, 1024]),
  learning_rate: getNumberValidator('learning_rate'),
  eval_steps: getNumberValidator('eval_steps', [1, 2_147_483_647]),
  num_train_epochs: getNumberValidator('num_train_epochs', [1, 200]),
  max_length: getNumberValidator('max_length', [1, 131_072]),
  warmup_ratio: getNumberValidator('warmup_ratio', [0, 1]),
  save_steps: getNumberValidator('save_steps', [1, 2_147_483_647]),
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'vertical',
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  handleSubmit: (values) => {
    message.success(`表单数据：${JSON.stringify(values)}`);
  },
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'ApiSelect',
      // 对应组件的参数
      componentProps: {
        // 菜单接口转options格式
        afterFetch: (data: { name: string; path: string }[]) => {
          return data.map((item: any) => ({
            label: item.name,
            value: item.path,
          }));
        },
        // 菜单接口
        api: getAllMenusApi,
      },
      // 字段名
      fieldName: 'api',
      // 界面显示的label
      label: 'ApiSelect',
      rules: 'required',
    },
    {
      component: 'ApiTreeSelect',
      // 对应组件的参数
      componentProps: {
        // 菜单接口
        api: getAllMenusApi,
        childrenField: 'children',
        // 菜单接口转options格式
        labelField: 'name',
        valueField: 'path',
      },
      // 字段名
      fieldName: 'apiTree',
      // 界面显示的label
      label: 'ApiTreeSelect',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'string',
      label: 'String',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      fieldName: 'number',
      label: 'Number',
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      fieldName: 'radio',
      label: 'Radio',
      componentProps: {
        options: [
          { value: 'A', label: 'A' },
          { value: 'B', label: 'B' },
          { value: 'C', label: 'C' },
          { value: 'D', label: 'D' },
          { value: 'E', label: 'E' },
        ],
      },
      rules: 'selectRequired',
    },
    {
      component: 'RadioGroup',
      fieldName: 'radioButton',
      label: 'RadioButton',
      componentProps: {
        isButton: true,
        class: 'flex flex-wrap', // 如果选项过多，可以添加class来自动折叠
        options: [
          { value: 'A', label: '选项A' },
          { value: 'B', label: '选项B' },
          { value: 'C', label: '选项C' },
          { value: 'D', label: '选项D' },
          { value: 'E', label: '选项E' },
        ],
      },
      rules: 'selectRequired',
    },
    {
      component: 'CheckboxGroup',
      fieldName: 'checkbox',
      label: 'Checkbox',
      componentProps: {
        options: [
          { value: 'A', label: '选项A' },
          { value: 'B', label: '选项B' },
          { value: 'C', label: '选项C' },
        ],
      },
      rules: 'selectRequired',
    },
    {
      component: 'DatePicker',
      fieldName: 'date',
      label: 'Date',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'textArea',
      label: 'TextArea',
      componentProps: {
        type: 'textarea',
      },
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'collapsibleTextArea',
      label: 'vertical时可折叠',
      componentProps: {
        type: 'textarea',
      },
      collapsible: true,
    },
    {
      component: VbenCollapsibleParams,
      componentProps: {
        params: paramsSchema,
      },
      modelPropName: 'value',
      fieldName: 'params',
      label: '参数配置',
      formItemClass: 'col-span-2',
      rules: paramsValidator,
    },
  ],
});

function setFormValues() {
  formApi.setValues({
    string: 'string',
    number: 123,
    radio: 'B',
    radioButton: 'C',
    checkbox: ['A', 'C'],
    date: Date.now(),
    params: {
      micro_batch_size: 8,
      learning_rate: 1e-5,
      eval_steps: 50,
      num_train_epochs: 3,
      max_length: 32_768,
      warmup_ratio: 0.05,
      save_steps: 50,
    },
  });
}

const [Modal, modalApi] = useVbenModal({
  connectedComponent: modalDemo,
});

function onLayoutChange(layout: string) {
  formApi.setState({
    layout,
  });
}
</script>
<template>
  <Page
    description="表单适配器重新包装了CheckboxGroup和RadioGroup，可以通过options属性传递选项数据（选项数据将作为子组件的属性）"
    title="表单演示"
  >
    <NCard title="基础表单" header-extra-class="gap-4">
      <template #header-extra>
        <NRadioGroup v-model:value="layout" @update:value="onLayoutChange">
          <NRadioButton
            v-for="layoutItem in layouts"
            :key="layoutItem.value"
            :value="layoutItem.value"
            :label="layoutItem.label"
          />
        </NRadioGroup>
        <NButton type="primary" @click="setFormValues">设置表单值</NButton>
        <NButton type="primary" @click="modalApi.open()" class="ml-2">
          打开弹窗
        </NButton>
      </template>
      <Form />
    </NCard>
    <Modal />
  </Page>
</template>
