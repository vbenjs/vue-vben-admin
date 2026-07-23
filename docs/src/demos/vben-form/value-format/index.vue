<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from 'vue';

import { Button, Card, message, Space, Tag } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';

interface ValueFormatFormValues {
  firstName?: string;
  lastName?: string;
  tags?: string[];
}

function encodeValueFormatValues(values: Readonly<ValueFormatFormValues>) {
  return {
    fullName: [values.firstName, values.lastName].filter(Boolean).join(' '),
    tags: (values.tags ?? []).join(','),
  };
}

type ValueFormatSubmitValues = ReturnType<typeof encodeValueFormatValues>;

function decodeValueFormatValues(
  values: Readonly<ValueFormatSubmitValues>,
): ValueFormatFormValues {
  const [firstName = '', ...lastNameParts] = values.fullName
    .trim()
    .split(/\s+/);
  return {
    firstName,
    lastName: lastNameParts.join(' '),
    tags: values.tags ? values.tags.split(',') : [],
  };
}

const transformedValues = ref<Partial<ValueFormatSubmitValues>>({});
const liveValues = ref<Partial<ValueFormatFormValues>>({});

const [Form, formApi] = useVbenForm({
  codec: {
    decode: decodeValueFormatValues,
    encode: encodeValueFormatValues,
  },
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit,
  handleValuesChange,
  schema: [
    {
      component: 'Input',
      fieldName: 'firstName',
      help: '与姓氏一起编码为 fullName',
      label: '名字',
    },
    {
      component: 'Input',
      fieldName: 'lastName',
      help: '与名字一起编码为 fullName',
      label: '姓氏',
    },
    {
      component: 'Select',
      componentProps: {
        mode: 'multiple',
        options: [
          { label: '管理员', value: 'admin' },
          { label: '审核员', value: 'reviewer' },
          { label: '访客', value: 'guest' },
        ],
        placeholder: '请选择标签',
      },
      fieldName: 'tags',
      help: '数组编码为逗号分隔字符串',
      label: '标签',
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

const liveValuesPreview = computed(() => formatJsonPreview(liveValues.value));

const transformedValuesPreview = computed(() => {
  return formatJsonPreview(transformedValues.value);
});

function formatJsonPreview(value: unknown) {
  return JSON.stringify(value, null, 2);
}

async function handleInspectValues() {
  await syncPreviewValues();
  message.success('已刷新 getValues 输出');
}

async function handleSetSubmitValues() {
  await formApi.setSubmitValues({
    fullName: 'Ada Lovelace',
    tags: 'admin,reviewer',
  });
  await syncPreviewValues();
  message.success('已通过 codec.decode 回填提交值');
}

function handleSubmit(values: ValueFormatSubmitValues) {
  transformedValues.value = values;
  message.success({
    content: `getValues output: ${JSON.stringify(values)}`,
  });
}

function handleValuesChange(
  values: Readonly<ValueFormatFormValues>,
  _fieldsChanged: string[],
  getFormattedValues: () => ValueFormatSubmitValues,
) {
  liveValues.value = { ...values };
  transformedValues.value = getFormattedValues();
}

async function syncPreviewValues(values?: Readonly<ValueFormatFormValues>) {
  liveValues.value = { ...(values ?? formApi.form?.values ?? {}) };
  transformedValues.value = await formApi.getValues();
}

onMounted(async () => {
  await nextTick();
  await syncPreviewValues();
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap gap-2">
      <Tag color="processing">encode：生成完整提交值</Tag>
      <Tag color="success">decode：恢复完整表单值</Tag>
      <Tag color="warning">多字段转换原子执行</Tag>
    </div>

    <Card title="Codec 示例">
      <template #extra>
        <Space wrap>
          <Button @click="handleSetSubmitValues">从提交值回填</Button>
          <Button type="primary" @click="handleInspectValues">
            查看 getValues 输出
          </Button>
        </Space>
      </template>
      <Form />
    </Card>

    <div class="grid gap-4 lg:grid-cols-2">
      <Card title="原始 form.values（组件值）">
        <pre class="bg-muted overflow-auto rounded-md p-4 text-sm">{{
          liveValuesPreview
        }}</pre>
      </Card>
      <Card title="getValues / submit 输出（codec.encode 后）">
        <pre class="bg-muted overflow-auto rounded-md p-4 text-sm">{{
          transformedValuesPreview
        }}</pre>
      </Card>
    </div>
  </div>
</template>
