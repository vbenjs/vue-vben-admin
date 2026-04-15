<script lang="ts" setup>
import type { RadioGroupProps } from 'ant-design-vue';

import type { FormLayout } from '@vben/common-ui';

import type { CollapsibleParamSchema } from '@vben-core/shadcn-ui';

import { h, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { VbenCollapsibleParams } from '@vben-core/shadcn-ui';

import { Button, Card, message, RadioGroup } from 'ant-design-vue';

import { useVbenForm, z } from '#/adapter/form';

import DocButton from '../doc-button.vue';

const layouts: RadioGroupProps['options'] = [
  { label: 'Vertical', value: 'vertical' },
  { label: 'Horizontal', value: 'horizontal' },
];

const layout = ref<FormLayout>('vertical');

function getNumberValidator(key: string, limit?: [number?, number?]) {
  let validator = z.number({
    required_error: `${key} 值不能为空`,
    invalid_type_error: `${key} 值只能为数字`,
  });

  if (limit) {
    if (limit[0] !== undefined) {
      validator = validator.min(limit[0], {
        message: `${key} 值不能小于${limit[0]}`,
      });
    }
    if (limit[1] !== undefined) {
      validator = validator.max(limit[1], {
        message: `${key} 值不能大于${limit[1]}`,
      });
    }
  }

  return validator.optional();
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
      min: 0,
      max: 1,
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

const paramsValidator = z
  .object({
    micro_batch_size: getNumberValidator('micro_batch_size', [8, 1024]),
    learning_rate: getNumberValidator('learning_rate'),
    eval_steps: getNumberValidator('eval_steps', [1, 2_147_483_647]),
    num_train_epochs: getNumberValidator('num_train_epochs', [1, 200]),
    max_length: getNumberValidator('max_length', [500, 131_072]),
    warmup_ratio: getNumberValidator('warmup_ratio', [0, 1]),
    save_steps: getNumberValidator('save_steps', [1, 2_147_483_647]),
  })
  .required();

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    colon: true,
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: onSubmit,
  layout: 'vertical',
  schema: [
    {
      component: 'Switch',
      fieldName: 'qat',
      componentProps: {
        checkedChildren: '开',
        unCheckedChildren: '关',
        class: 'w-auto',
      },
      label: 'QAT',
      formItemClass: 'col-span-2',
      defaultValue: false,
    },
    {
      // component:'CollapsibleParams',
      component: h(VbenCollapsibleParams),
      componentProps: {
        params: paramsSchema,
        // maxHeight: 200, //限制最大高度，展开后可滚动
        // defaultOpen: true, // 默认false折叠
        // visibleCount: 0 // 默认3，最小可见为1，小于1取1
      },
      modelPropName: 'value',
      fieldName: 'params',
      label: '参数配置',
      formItemClass: 'col-span-8 items-baseline col-start-1',
      dependencies: {
        triggerFields: ['qat'],
        componentProps(values) {
          return {
            params: values.qat
              ? [
                  {
                    key: 'calib_steps',
                    description: `校准步数；校准的数据集大小 = 校准步数 * 训练的batch_size`,
                    option: {
                      min: 1,
                    },
                  },
                  ...paramsSchema,
                ]
              : paramsSchema,
          };
        },
        trigger(values, __, controller) {
          // 访问 form 内 VbenCollapsibleParams 的实例
          const paramsRef =
            controller.getFieldComponentRef<typeof VbenCollapsibleParams>(
              'params',
            );
          if (values.qat) {
            paramsRef?.updateValues?.({
              calib_steps: 10,
              micro_batch_size: 32,
              learning_rate: 4e-5,
              eval_steps: 80,
              num_train_epochs: 3,
              max_length: 32_768,
              warmup_ratio: 0.1,
              save_steps: 80,
            });
          } else {
            paramsRef?.updateValues?.({
              calib_steps: null,
            });
          }
        },
        rules(values) {
          if (values.qat) {
            return paramsValidator.extend({
              calib_steps: getNumberValidator('calib_steps', [1]),
            });
          }
          return paramsValidator;
        },
      },
      rules: paramsValidator,
      defaultValue: {
        micro_batch_size: 8,
        learning_rate: 1e-5,
        eval_steps: 50,
        num_train_epochs: 3,
        max_length: 32_768,
        warmup_ratio: 0.05,
        save_steps: 50,
      },
    },
    {
      component: 'RichEditor',
      fieldName: 'richEditor',
      label: '富文本',
      formItemClass: 'col-span-12 items-baseline',
      collapsible: true,
      defaultCollapsed: false, // 默认false
    },
  ],
  wrapperClass: 'grid-cols-12',
});

function onSubmit(values: Record<string, any>) {
  message.info({
    content: `form values: ${JSON.stringify(values)}`,
  });
}

function onLayoutChange() {
  baseFormApi.setState({
    layout: layout.value,
  });
}

function handleSetFormValue() {
  baseFormApi.setFieldValue('params', {
    micro_batch_size: 1024,
    learning_rate: 1e-5,
    eval_steps: 150,
    num_train_epochs: 13,
    max_length: 131_072,
    warmup_ratio: 0.05,
    save_steps: 150,
  });
}

function handleResetFormValue() {
  baseFormApi.resetForm(undefined, { force: true });
}

async function handleSubmitFormValue() {
  const { valid } = await baseFormApi.validate();

  if (valid) {
    baseFormApi.submitForm();
  }
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
            @change="onLayoutChange"
          />
          <Button type="primary" @click="handleSetFormValue">
            设置表单值
          </Button>
          <Button type="primary" @click="handleSubmitFormValue">
            提交表单
          </Button>
          <Button type="primary" @click="handleResetFormValue">
            重置表单
          </Button>
        </div>
      </template>
      <div class="w-full overflow-hidden">
        <BaseForm />
      </div>
    </Card>
  </Page>
</template>
