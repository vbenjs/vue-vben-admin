<script setup lang="ts">
import type { VbenFormSchema } from '#/adapter/form';

import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, message, Space } from 'antdv-next';

import { useVbenForm, z } from '#/adapter/form';

interface ContactFormValues {
  enabled: boolean;
  name: string;
  phone?: string;
  role: 'member' | 'owner' | 'viewer';
}

interface ArrayFormValues extends Record<string, unknown> {
  contacts: ContactFormValues[];
  description?: string;
  planName: string;
}

function encodeArrayFormValues(values: Readonly<ArrayFormValues>) {
  return {
    ...values,
    contacts: values.contacts.map(({ phone, ...contact }) => {
      const trimmedPhone = phone?.trim();
      return {
        ...contact,
        name: contact.name.trim(),
        ...(trimmedPhone ? { phone: trimmedPhone } : {}),
      };
    }),
  };
}

type ArraySubmitValues = ReturnType<typeof encodeArrayFormValues>;

function decodeArrayFormValues(
  values: Readonly<ArraySubmitValues>,
): ArrayFormValues {
  return {
    ...values,
    contacts: values.contacts.map((contact) => ({
      ...contact,
      phone: contact.phone ?? '',
    })),
  };
}

const submitValues = ref<Partial<ArraySubmitValues>>({});
const formattedSubmitValues = computed(() =>
  JSON.stringify(submitValues.value, null, 2),
);
const outputClass = [
  'bg-muted',
  'text-muted-foreground',
  'max-h-[420px]',
  'overflow-auto',
  'rounded-md',
  'p-3',
  'text-xs',
];

const schema: VbenFormSchema<ArrayFormValues>[] = [
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入方案名称',
    },
    defaultValue: '值班联络人配置',
    fieldName: 'planName',
    label: '方案名称',
    rules: z.string().min(1, '请输入方案名称'),
  },
  {
    component: 'Textarea',
    dependencies: {
      componentProps: (values) => {
        const planName = values.planName;
        return {
          disabled: !planName,
          placeholder: planName ? `${planName} 的补充说明` : '请先填写方案名称',
          rows: 2,
        };
      },
      required: (values) => {
        return String(values.planName ?? '').includes('值班');
      },
      rules: (values) => {
        return String(values.planName ?? '').includes('值班')
          ? z.string().min(2, '请输入至少 2 个字')
          : z.string().optional();
      },
      triggerFields: ['planName'],
    },
    fieldName: 'description',
    formItemClass: 'col-span-1 md:col-span-2',
    label: '方案说明',
  },
  {
    arrayProps: {
      addButtonText: '添加联系人',
      createRow: () => ({
        enabled: true,
        name: '',
        phone: '',
        role: 'member',
      }),
      max: 5,
      min: 1,
    },
    children: [
      {
        component: 'Input',
        componentProps: (ctx) => ({
          placeholder: `第 ${(ctx.rowIndex ?? 0) + 1} 行姓名`,
        }),
        defaultValue: '',
        fieldName: 'name',
        label: '姓名',
        rules: z.string().trim().min(1, '请输入姓名'),
      },
      {
        component: 'Select',
        componentProps: {
          options: [
            { label: '负责人', value: 'owner' },
            { label: '成员', value: 'member' },
            { label: '观察员', value: 'viewer' },
          ],
        },
        defaultValue: 'member',
        fieldName: 'role',
        label: '角色',
        rules: 'selectRequired',
      },
      {
        component: 'Input',
        dependencies: {
          componentProps: (_values, _form, _api, ctx) => ({
            disabled: ctx?.row?.role === 'viewer',
            placeholder:
              ctx?.row?.role === 'viewer' ? '观察员无需电话' : '请输入电话',
          }),
          triggerFields: ['role'],
        },
        fieldName: 'phone',
        label: '电话',
        rules: z.string().optional(),
      },
      {
        component: 'Switch',
        componentProps: {
          checkedChildren: '启用',
          unCheckedChildren: '停用',
        },
        defaultValue: true,
        fieldName: 'enabled',
        label: '状态',
      },
    ],
    defaultValue: [
      {
        enabled: true,
        name: '张三',
        phone: ' 10086 ',
        role: 'owner',
      },
    ],
    fieldName: 'contacts',
    formItemClass: 'col-span-1 md:col-span-2',
    label: '联系人',
    rules: z.array(z.any()).min(1, '请至少添加一个联系人'),
    type: 'array',
  },
];

const [Form, formApi] = useVbenForm({
  codec: {
    decode: decodeArrayFormValues,
    encode: encodeArrayFormValues,
  },
  commonConfig: {
    labelWidth: 90,
  },
  handleSubmit: (values) => {
    submitValues.value = values;
    message.success('已通过校验');
  },
  schema,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 gap-x-4 md:grid-cols-2',
});

async function handleSubmit() {
  await formApi.validateAndSubmit();
}

async function handleGetValues() {
  submitValues.value = await formApi.getValues();
}

function handlePatchChildRule() {
  formApi.updateSchema([
    {
      fieldName: 'contacts.phone',
      rules: z.string().min(5, '电话至少 5 位'),
    },
  ]);
  message.success('已动态更新子字段规则');
}
</script>

<template>
  <Page title="Form Array Demo">
    <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Card title="数组字段">
        <Form />
        <Space class="mt-4 flex flex-wrap">
          <Button type="primary" @click="handleSubmit">提交</Button>
          <Button @click="handleGetValues">获取值</Button>
          <Button @click="handlePatchChildRule">更新电话规则</Button>
        </Space>
      </Card>

      <Card title="输出">
        <pre :class="outputClass" v-text="formattedSubmitValues"></pre>
      </Card>
    </div>
  </Page>
</template>
