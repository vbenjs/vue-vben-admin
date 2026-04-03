<script lang="ts" setup>
// @ts-nocheck
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Form,
  Input,
  message,
  Select,
  Switch,
  Table,
} from 'ant-design-vue';

import { sysGenApi } from '#/api/core/sys-manage';

const route = useRoute();
const router = useRouter();
const tableId = route.params.id as string;

const loading = ref(false);
const submitLoading = ref(false);

const basicInfo = reactive({
  tableId: '',
  tableName: '',
  tableComment: '',
  className: '',
  functionAuthor: '',
  genType: '0',
});

const columnsData = ref<any[]>([]);

onMounted(async () => {
  if (tableId) {
    loading.value = true;
    try {
      const res = await sysGenApi.getDetail(tableId);
      Object.assign(basicInfo, res.info);
      columnsData.value = res.rows || [];
    } finally {
      loading.value = false;
    }
  }
});

const tsTypeOptions = [
  { label: 'String', value: 'string' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Date', value: 'Date' },
];

const htmlTypeOptions = [
  { label: '文本框', value: 'input' },
  { label: '数字框', value: 'inputNumber' },
  { label: '文本域', value: 'textarea' },
  { label: '下拉框', value: 'select' },
  { label: '单选框', value: 'radio' },
  { label: '开关', value: 'switch' },
  { label: '日期', value: 'datetime' },
  { label: '图片上传', value: 'image' },
];

const queryTypeOptions = [
  { label: '=', value: 'EQ' },
  { label: '!=', value: 'NE' },
  { label: '>', value: 'GT' },
  { label: '>=', value: 'GTE' },
  { label: '<', value: 'LT' },
  { label: '<=', value: 'LTE' },
  { label: 'LIKE', value: 'LIKE' },
  { label: 'BETWEEN', value: 'BETWEEN' },
];

const tableColumns = [
  { title: '排序', dataIndex: 'sort', width: 60, fixed: 'left' },
  { title: '字段列名', dataIndex: 'columnName', width: 120, fixed: 'left' },
  { title: '物理类型', dataIndex: 'columnType', width: 100 },
  { title: '字段描述', dataIndex: 'columnComment', width: 150 },
  { title: 'TS类型', dataIndex: 'tsType', width: 120 },
  { title: 'TS属性', dataIndex: 'tsField', width: 150 },
  { title: '必填', dataIndex: 'isRequired', width: 80 },
  { title: '插入', dataIndex: 'isInsert', width: 80 },
  { title: '编辑', dataIndex: 'isEdit', width: 80 },
  { title: '列表', dataIndex: 'isList', width: 80 },
  { title: '查询', dataIndex: 'isQuery', width: 80 },
  { title: '查询方式', dataIndex: 'queryType', width: 120 },
  { title: '显示类型', dataIndex: 'htmlType', width: 150 },
];

async function handleSave() {
  submitLoading.value = true;
  try {
    const payload = {
      info: { ...basicInfo },
      rows: columnsData.value,
    };
    await sysGenApi.updateConfig(payload);
    message.success('保存成功');
    router.push('/sys/gen');
  } finally {
    submitLoading.value = false;
  }
}

function handleGoBack() {
  router.push('/sys/gen');
}
</script>

<template>
  <Page @back="handleGoBack" :loading="loading">
    <div class="flex flex-col gap-4 p-4">
      <Card title="基本信息" size="small">
        <Form layout="inline" :model="basicInfo">
          <Form.Item label="表名称">
            <Input v-model:value="basicInfo.tableName" disabled />
          </Form.Item>
          <Form.Item label="表描述">
            <Input v-model:value="basicInfo.tableComment" />
          </Form.Item>
          <Form.Item label="实体类名">
            <Input v-model:value="basicInfo.className" />
          </Form.Item>
          <Form.Item label="作者">
            <Input v-model:value="basicInfo.functionAuthor" />
          </Form.Item>
        </Form>
      </Card>

      <Card title="字段配置" size="small" class="flex-1">
        <Table
          :columns="tableColumns"
          :data-source="columnsData"
          row-key="columnId"
          :pagination="false"
          size="small"
          scroll="{ x: 1500, y: 500 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'columnComment'">
              <Input v-model:value="record.columnComment" size="small" />
            </template>
            <template v-else-if="column.dataIndex === 'tsType'">
              <Select
                v-model:value="record.tsType"
                :options="tsTypeOptions"
                size="small"
                class="w-full"
              />
            </template>
            <template v-else-if="column.dataIndex === 'tsField'">
              <Input v-model:value="record.tsField" size="small" />
            </template>
            <template v-else-if="column.dataIndex === 'htmlType'">
              <Select
                v-model:value="record.htmlType"
                :options="htmlTypeOptions"
                size="small"
                class="w-full"
              />
            </template>
            <template v-else-if="column.dataIndex === 'queryType'">
              <Select
                v-model:value="record.queryType"
                :options="queryTypeOptions"
                size="small"
                class="w-full"
              />
            </template>

            <!-- Checkboxes / Switches -->
            <template
              v-else-if="
                [
                  'isRequired',
                  'isInsert',
                  'isEdit',
                  'isList',
                  'isQuery',
                ].includes(column.dataIndex as string)
              "
            >
              <Switch
                :checked="record[column.dataIndex as string] === '1'"
                @change="
                  (val: boolean) =>
                    (record[column.dataIndex as string] = val ? '1' : '0')
                "
                size="small"
              />
            </template>
          </template>
        </Table>
      </Card>

      <div class="mt-4 flex justify-center gap-4">
        <Button @click="handleGoBack">返回</Button>
        <Button type="primary" :loading="submitLoading" @click="handleSave">
          保存配置
        </Button>
      </div>
    </div>
  </Page>
</template>
