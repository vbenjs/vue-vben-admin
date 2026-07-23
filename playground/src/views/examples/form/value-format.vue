<script lang="ts" setup>
import type { Dayjs } from 'dayjs';

import { computed, nextTick, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, message, Space, Tag } from 'antdv-next';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';

import DocButton from '../doc-button.vue';

interface ValueFormatFormValues {
  deadline?: Dayjs;
  keyword?: string;
  reportRange?: [Dayjs, Dayjs];
}

function encodeValueFormatValues(values: Readonly<ValueFormatFormValues>) {
  return {
    deadline: values.deadline?.valueOf(),
    endTime: values.reportRange?.[1].valueOf(),
    keyword: values.keyword,
    startTime: values.reportRange?.[0].valueOf(),
  };
}

type ValueFormatSubmitValues = ReturnType<typeof encodeValueFormatValues>;

function decodeValueFormatValues(
  values: Readonly<ValueFormatSubmitValues>,
): ValueFormatFormValues {
  let reportRange: [Dayjs, Dayjs] | undefined;
  if (values.startTime !== undefined && values.endTime !== undefined) {
    reportRange = [dayjs(values.startTime), dayjs(values.endTime)];
  }
  return {
    deadline:
      values.deadline === undefined ? undefined : dayjs(values.deadline),
    keyword: values.keyword,
    reportRange,
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
      component: 'RangePicker',
      fieldName: 'reportRange',
      help: '由表单 codec 拆分为 startTime / endTime',
      label: '统计时间范围',
    },
    {
      component: 'DatePicker',
      fieldName: 'deadline',
      help: '由表单 codec 编码为时间戳',
      label: '截止时间',
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

function formatJsonPreview(value: unknown) {
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
  const rawValues = values ?? (await formApi.getRawValues());
  liveValues.value = { ...rawValues };
  transformedValues.value = await formApi.getValues();
}

onMounted(async () => {
  await nextTick();
  await syncPreviewValues();
});
</script>

<template>
  <Page
    content-class="flex flex-col gap-4"
    description="演示表单级 codec 如何双向转换组件值和提交 payload。"
    title="表单 Codec"
  >
    <template #description>
      <div class="text-muted-foreground space-y-2">
        <p>
          <code>getRawValues()</code> 返回组件原始值，<code>getValues()</code> /
          提交时会按 <code>codec.encode</code> 输出 payload，回填时通过
          <code>codec.decode</code> 恢复组件值。
        </p>
        <div class="flex flex-wrap gap-2">
          <Tag color="processing">encode：生成完整提交值</Tag>
          <Tag color="success">decode：恢复完整表单值</Tag>
          <Tag color="warning">多字段转换原子执行</Tag>
        </div>
      </div>
    </template>
    <template #extra>
      <DocButton path="/components/common-ui/vben-form" />
    </template>

    <Card title="Codec 示例">
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
      <Card title="getRawValues() 输出（组件值）">
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
  </Page>
</template>
