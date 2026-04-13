<script lang="ts" setup>
import type { CollapsibleParamSchema } from '@vben-core/shadcn-ui';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { VbenCollapsibleParams } from '@vben-core/shadcn-ui';

import { Button, Card, message, RadioGroup } from 'ant-design-vue';

import { useVbenForm, z } from '#/adapter/form';

import DocButton from '../doc-button.vue';

const layouts = [
  { label: 'Vertical', value: 'vertical' },
  { label: 'Horizontal', value: 'horizontal' },
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

const paramsSchema: CollapsibleParamSchema[] = [
  {
    key: 'micro_batch_size',
    description: `批次大小，代表模型训练过程中，模型更新模型参数的数据步长，可理解为模型每看多少数据即更新一次模型参数，
    一般建议的批次大小为16/32，表示模型每看16或32条数据即更新一次参数`,
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
    option: {
      step: 1e-4,
      type: 'exponential',
    },
  },
  {
    key: 'eval_steps',
    description:
      '验证步数，训练阶段针模型的验证间隔步长，用于阶段性评估模型训练准确率、训练损失',
    option: {
      min: 1,
      max: 2_147_483_647,
    },
  },
  {
    key: 'num_train_epochs',
    description:
      '循环次数，代表模型训练过程中模型学习数据集的次数，可理解为看几遍数据，一般建议的范围是1-3遍即可，可依据需求进行调整',
    option: {
      min: 1,
      max: 200,
    },
  },
  {
    key: 'max_length',
    description: `序列长度，单个训练数据样本的最大长度，超出配置长度将丢弃`,
    option: {
      min: 500,
      max: 131_072,
    },
  },
  {
    key: 'warmup_ratio',
    description: '学习率预热比例，学习率预热阶段占总训练步数的比例',
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
    option: {
      min: 1,
      max: 2_147_483_647,
    },
  },
];

const paramsValidator = z.object({
  micro_batch_size: getNumberValidator('micro_batch_size', [8, 1024]),
  learning_rate: getNumberValidator('learning_rate'),
  eval_steps: getNumberValidator('eval_steps', [1, 2_147_483_647]),
  num_train_epochs: getNumberValidator('num_train_epochs', [1, 200]),
  max_length: getNumberValidator('max_length', [1, 131_072]),
  warmup_ratio: getNumberValidator('warmup_ratio', [0, 1]),
  save_steps: getNumberValidator('save_steps', [1, 2_147_483_647]),
});

const [BaseForm, baseFormApi] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 在label后显示一个冒号
    colon: true,
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  fieldMappingTime: [['rangePicker', ['startTime', 'endTime'], 'YYYY-MM-DD']],
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'vertical',
  schema: [
    {
      component: VbenCollapsibleParams,
      componentProps: {
        params: paramsSchema,
        // maxHeight: 200, //限制最大高度，展开后可滚动
      },
      modelPropName: 'value',
      fieldName: 'params',
      label: '参数配置',
      formItemClass: 'col-span-2 items-baseline',
      rules: paramsValidator,
    },
    {
      component: 'RichEditor',
      fieldName: 'richEditor',
      label: '富文本',
      formItemClass: 'col-span-3 items-baseline',
      collapsible: true,
      defaultCollapsed: false, // 默认false
    },
  ],
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
});

function onSubmit(values: Record<string, any>) {
  message.info({
    content: `form values: ${JSON.stringify(values)}`,
  });
}

function handleSetFormValue() {
  baseFormApi.setFieldValue('params', {
    micro_batch_size: 8,
    learning_rate: 1e-5,
    eval_steps: 50,
    num_train_epochs: 3,
    max_length: 32_768,
    warmup_ratio: 0.05,
    save_steps: 50,
  });
}

function onLayoutChange(layout: string) {
  baseFormApi.setState({
    layout,
  });
}
</script>

<template>
  <Page
    auto-content-height
    content-class="flex flex-col gap-4"
    title="可折叠表单项"
  >
    <template #description>
      <div class="text-muted-foreground">
        <p>可折叠表单项、以及可折叠参数配置组件示例</p>
      </div>
    </template>
    <template #extra>
      <DocButton class="mb-2" path="/components/common-ui/vben-form" />
    </template>
    <Card title="基础示例">
      <template #extra>
        <div class="inline-flex items-center gap-4!">
          <RadioGroup
            :options="layouts"
            option-type="button"
            v-model:value="layout"
            @update:value="onLayoutChange"
          >
            设置表单值
          </RadioGroup>
          <Button type="primary" @click="handleSetFormValue">设置表单值</Button>
        </div>
      </template>
      <div class="w-full overflow-hidden">
        <BaseForm />
      </div>
    </Card>
  </Page>
</template>
