<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, message, Space, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';

import DocButton from '../doc-button.vue';

const transformedValues = ref<Record<string, any>>({});
const liveValues = ref<Record<string, any>>({});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit,
  schema: [
    {
      component: 'RangePicker',
      fieldName: 'reportRange',
      help: '通过 setValue 拆分为 startTime / endTime，并移除原字段',
      label: '统计时间范围',
      valueFormat(value, setValue) {
        setValue('startTime', value?.[0]?.valueOf());
        setValue('endTime', value?.[1]?.valueOf());
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'deadline',
      help: '直接 return 时间戳，保留原字段名',
      label: '截止时间',
      valueFormat(value) {
        return value?.valueOf();
      },
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入关键字',
      },
      fieldName: 'keyword',
      label: '关键字',
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

const liveValuesPreview = computed(() => formatJsonPreview(liveValues.value));

const transformedValuesPreview = computed(() => {
  return formatJsonPreview(transformedValues.value);
});

function formatJsonPreview(value: Record<string, any>) {
  return JSON.stringify(
    value,
    (_key, currentValue) => {
      return dayjs.isDayjs(currentValue)
        ? currentValue.format('YYYY-MM-DD HH:mm:ss')
        : currentValue;
    },
    2,
  );
}

async function handleInspectValues() {
  await syncPreviewValues();
  message.success('已刷新 getValues 输出');
}

function handleSetExampleValue() {
  formApi.setValues({
    deadline: dayjs('2026-04-12 18:30:00'),
    keyword: 'invoice',
    reportRange: [dayjs('2026-04-01 00:00:00'), dayjs('2026-04-12 23:59:59')],
  });
}

function handleSubmit(values: Record<string, any>) {
  transformedValues.value = values;
  message.success({
    content: `getValues output: ${JSON.stringify(values)}`,
  });
}

async function syncPreviewValues(values?: Record<string, any>) {
  liveValues.value = values ?? formApi.form?.values ?? {};
  transformedValues.value = await formApi.getValues();
}

onMounted(async () => {
  await nextTick();
  watch(
    () => formApi.form?.values,
    async (values) => {
      await syncPreviewValues(values);
    },
    {
      deep: true,
      immediate: true,
    },
  );
});
</script>

<template>
  <Page
    content-class="flex flex-col gap-4"
    description="演示 schema.valueFormat 如何把组件值转换为提交/查询所需的 payload。"
    title="表单 valueFormat"
  >
    <template #description>
      <div class="text-muted-foreground space-y-2">
        <p>
          <code>form.values</code> 保持组件原始值，<code>getValues()</code> /
          提交时会按 <code>schema.valueFormat</code> 输出转换后的 payload。
        </p>
        <div class="flex flex-wrap gap-2">
          <Tag color="processing">return 值：回写当前字段</Tag>
          <Tag color="success">setValue：拆分写入其他字段</Tag>
          <Tag color="warning">return undefined：保持原字段删除</Tag>
        </div>
      </div>
    </template>
    <template #extra>
      <DocButton path="/components/common-ui/vben-form" />
    </template>

    <Card title="valueFormat 示例">
      <template #extra>
        <Space wrap>
          <Button @click="handleSetExampleValue">填充示例数据</Button>
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
      <Card title="getValues / submit 输出（valueFormat 后）">
        <pre class="bg-muted overflow-auto rounded-md p-4 text-sm">{{
          transformedValuesPreview
        }}</pre>
      </Card>
    </div>
  </Page>
</template>
