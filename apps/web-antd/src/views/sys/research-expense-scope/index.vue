<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Table,
  Tag,
} from 'ant-design-vue';

import {
  researchExpenseScopeApi,
  researchIndicatorApi,
} from '#/api/core/sys-manage';

const userStore = useUserStore();
const loading = ref(false);
const batchLoading = ref(false);
const dataSource = ref<any[]>([]);
const indicatorOptions = ref<any[]>([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const selectedRowKeys = ref<Array<number | string>>([]);
const contextInfo = ref({
  fiscalYear: userStore.userInfo?.fiscalYear || '',
  tenantName: userStore.userInfo?.tenantName || '',
});
const searchParams = ref({
  fiscalYear: userStore.userInfo?.fiscalYear || '',
  indicatorId: undefined,
  scopeName: '',
  status: undefined,
});

const pageDescription = computed(() => {
  const parts = [];
  if (contextInfo.value.tenantName)
    parts.push(`当前账套：${contextInfo.value.tenantName}`);
  if (contextInfo.value.fiscalYear)
    parts.push(`默认年度：${contextInfo.value.fiscalYear}`);
  return parts.join(' · ') || '科研支出范围台账';
});

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  preserveSelectedRowKeys: true,
  onChange: (keys: Array<number | string>) => (selectedRowKeys.value = keys),
}));
const selectedCount = computed(() => selectedRowKeys.value.length);
const totalAmount = computed(() =>
  dataSource.value.reduce(
    (sum, item) => sum + Number(item.scopeAmount || 0),
    0,
  ),
);
const usedAmount = computed(() =>
  dataSource.value.reduce((sum, item) => sum + Number(item.usedAmount || 0), 0),
);
const availableAmount = computed(() =>
  dataSource.value.reduce(
    (sum, item) => sum + Number(item.availableAmount || 0),
    0,
  ),
);

const columns = [
  { title: '指标', dataIndex: 'indicatorId', key: 'indicatorId', width: 180 },
  { title: '范围名称', dataIndex: 'scopeName', key: 'scopeName', width: 220 },
  {
    title: '范围金额',
    dataIndex: 'scopeAmount',
    key: 'scopeAmount',
    width: 120,
  },
  { title: '已使用', dataIndex: 'usedAmount', key: 'usedAmount', width: 120 },
  {
    title: '可用余额',
    dataIndex: 'availableAmount',
    key: 'availableAmount',
    width: 120,
  },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
  { title: '操作', key: 'action', width: 160 },
];

const defaultForm = () => ({
  indicatorId: undefined,
  scopeName: '',
  scopeAmount: 0,
  usedAmount: 0,
  availableAmount: 0,
  status: '0',
  remark: '',
});
const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const formState = ref<any>(defaultForm());

const fetchIndicators = async () => {
  const res = await researchIndicatorApi
    .getList({
      page: 1,
      pageSize: 500,
      fiscalYear:
        searchParams.value.fiscalYear || userStore.userInfo?.fiscalYear || '',
    })
    .catch(() => ({ items: [] }));
  indicatorOptions.value = (res?.items || []).map((item: any) => ({
    label: item.indicatorName || item.projectName,
    value: item.id,
  }));
};
const getIndicatorName = (indicatorId: number | string) =>
  indicatorOptions.value.find(
    (item: any) => `${item.value}` === `${indicatorId}`,
  )?.label || '-';

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await researchExpenseScopeApi.getList({
      page,
      pageSize: pagination.value.pageSize,
      ...searchParams.value,
    });
    dataSource.value = res?.items || [];
    contextInfo.value = {
      fiscalYear:
        res?.context?.fiscalYear || userStore.userInfo?.fiscalYear || '',
      tenantName:
        res?.context?.tenantName || userStore.userInfo?.tenantName || '',
    };
    pagination.value.current = page;
    pagination.value.total = res?.total || 0;
  } finally {
    loading.value = false;
  }
};

const formatAmount = (value: number | string) =>
  Number(value || 0).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';
const resetFilters = async () => {
  searchParams.value = {
    fiscalYear: userStore.userInfo?.fiscalYear || '',
    indicatorId: undefined,
    scopeName: '',
    status: undefined,
  };
  selectedRowKeys.value = [];
  await Promise.all([fetchIndicators(), fetchList(1)]);
};
const clearSelection = () => (selectedRowKeys.value = []);
const getSelectedRecords = () =>
  dataSource.value.filter((item) =>
    selectedRowKeys.value.some((key) => `${key}` === `${item.id}`),
  );
const handleBatchStatus = async (status: '0' | '1') => {
  const records = getSelectedRecords();
  if (records.length === 0) return message.warning('请先选择支出范围');
  batchLoading.value = true;
  try {
    for (const record of records)
      await researchExpenseScopeApi.update(record.id, { ...record, status });
    message.success('批量状态更新成功');
    clearSelection();
    await fetchList(pagination.value.current);
  } finally {
    batchLoading.value = false;
  }
};
const handleBatchDelete = () => {
  const records = getSelectedRecords();
  if (records.length === 0) return message.warning('请先选择支出范围');
  Modal.confirm({
    title: '确定删除选中的支出范围吗？',
    content: `共 ${records.length} 条记录。`,
    okButtonProps: { danger: true },
    onOk: async () => {
      batchLoading.value = true;
      try {
        for (const record of records)
          await researchExpenseScopeApi.remove(record.id);
        message.success(`已删除${records.length}条记录`);
        clearSelection();
        await fetchList(pagination.value.current);
      } finally {
        batchLoading.value = false;
      }
    },
  });
};

const openModal = async (record?: any) => {
  formState.value = record?.id
    ? { ...(await researchExpenseScopeApi.getById(record.id)) }
    : defaultForm();
  isModalVisible.value = true;
};
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    formState.value.availableAmount = Number(
      formState.value.availableAmount ||
        Number(formState.value.scopeAmount || 0) -
          Number(formState.value.usedAmount || 0),
    );
    if (formState.value.id) {
      await researchExpenseScopeApi.update(formState.value.id, formState.value);
      message.success('更新支出范围成功');
    } else {
      await researchExpenseScopeApi.create(formState.value);
      message.success('新增支出范围成功');
    }
    isModalVisible.value = false;
    await fetchList(1);
  } finally {
    submitting.value = false;
  }
};
const handleDelete = async (id: string) => {
  await researchExpenseScopeApi.remove(id);
  message.success('删除支出范围成功');
  await fetchList(1);
};

onMounted(async () => {
  await Promise.all([fetchIndicators(), fetchList(1)]);
});
</script>

<template>
  <Page>
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-4 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.fiscalYear"
            placeholder="年度"
            class="w-28"
            allow-clear
          /><Select
            v-model:value="searchParams.indicatorId"
            :options="indicatorOptions"
            placeholder="指标"
            class="w-52"
            allow-clear
            show-search
            option-filter-prop="label"
          /><Input
            v-model:value="searchParams.scopeName"
            placeholder="范围名称"
            class="w-48"
            allow-clear
          /><Select
            v-model:value="searchParams.status"
            placeholder="状态"
            class="w-28"
            allow-clear
          >
            <Select.Option value="0">正常</Select.Option
            ><Select.Option value="1">停用</Select.Option> </Select
          ><Button type="primary" @click="fetchList(1)">查询</Button
          ><Button @click="resetFilters">重置</Button
          ><Button type="primary" class="ml-auto" @click="openModal()">
            + 新增
          </Button>
        </div>
        <div
          class="mb-3 flex flex-wrap items-center gap-3 rounded bg-gray-50 px-3 py-2 text-sm text-gray-600"
        >
          <span>已选 {{ selectedCount }} 条</span
          ><Button
            size="small"
            :disabled="selectedCount === 0"
            :loading="batchLoading"
            @click="handleBatchStatus('0')"
          >
            批量启用 </Button
          ><Button
            size="small"
            :disabled="selectedCount === 0"
            :loading="batchLoading"
            @click="handleBatchStatus('1')"
          >
            批量停用 </Button
          ><Button
            size="small"
            danger
            :disabled="selectedCount === 0"
            :loading="batchLoading"
            @click="handleBatchDelete"
          >
            批量删除 </Button
          ><Button
            type="link"
            size="small"
            class="!px-0"
            :disabled="selectedCount === 0"
            @click="clearSelection"
          >
            清空选择
          </Button>
        </div>
        <Table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="pagination"
          :row-selection="rowSelection"
          @change="(pag) => fetchList(pag.current || 1)"
          row-key="id"
          bordered
          size="middle"
          :scroll="{ x: 1280 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'indicatorId'">
              {{ getIndicatorName(record.indicatorId) }}
            </template>
            <template v-if="column.key === 'scopeAmount'">
              {{ formatAmount(record.scopeAmount) }}
            </template>
            <template v-if="column.key === 'usedAmount'">
              {{ formatAmount(record.usedAmount) }}
            </template>
            <template v-if="column.key === 'availableAmount'">
              {{ formatAmount(record.availableAmount) }}
            </template>
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '正常' : '停用' }}
              </Tag>
            </template>
            <template v-if="column.key === 'createTime'">
              {{ formatDate(record.createTime) }}
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openModal(record)">
                编辑 </Button
              ><Popconfirm
                title="确定删除吗？"
                @confirm="handleDelete(record.id)"
              >
                <Button type="link" danger size="small"> 删除 </Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
      <Modal
        v-model:open="isModalVisible"
        :title="formState.id ? '编辑支出范围' : '新增支出范围'"
        @ok="handleSubmit"
        :confirm-loading="submitting"
        destroy-on-close
        width="700px"
      >
        <Form
          ref="formRef"
          :model="formState"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
          class="mt-4"
        >
          <div class="grid grid-cols-2 gap-x-4">
            <Form.Item label="指标" name="indicatorId">
              <Select
                v-model:value="formState.indicatorId"
                :options="indicatorOptions"
                show-search
                option-filter-prop="label"
                allow-clear
              />
            </Form.Item>
            <Form.Item
              label="范围名称"
              name="scopeName"
              :rules="[{ required: true, message: '请输入范围名称' }]"
            >
              <Input v-model:value="formState.scopeName" />
            </Form.Item>
            <Form.Item label="范围金额" name="scopeAmount">
              <InputNumber
                v-model:value="formState.scopeAmount"
                class="w-full"
                :min="0"
              />
            </Form.Item>
            <Form.Item label="已使用" name="usedAmount">
              <InputNumber
                v-model:value="formState.usedAmount"
                class="w-full"
                :min="0"
              />
            </Form.Item>
            <Form.Item label="可用余额" name="availableAmount">
              <InputNumber
                v-model:value="formState.availableAmount"
                class="w-full"
                :min="0"
              />
            </Form.Item>
            <Form.Item label="状态" name="status">
              <Radio.Group v-model:value="formState.status">
                <Radio value="0">正常</Radio><Radio value="1">停用</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          <Form.Item label="备注" name="remark">
            <Input.TextArea v-model:value="formState.remark" :rows="3" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  </Page>
</template>
