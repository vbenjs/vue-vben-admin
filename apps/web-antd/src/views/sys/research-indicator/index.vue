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

import { researchIndicatorApi } from '#/api/core/sys-manage';

const userStore = useUserStore();
const loading = ref(false);
const batchLoading = ref(false);
const dataSource = ref<any[]>([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const selectedRowKeys = ref<Array<number | string>>([]);
const contextInfo = ref({
  fiscalYear: userStore.userInfo?.fiscalYear || '',
  tenantName: userStore.userInfo?.tenantName || '',
});
const searchParams = ref({
  fiscalYear: userStore.userInfo?.fiscalYear || '',
  projectName: '',
  indicatorName: '',
  flowStatus: undefined,
  status: undefined,
});

const pageDescription = computed(() => {
  const parts = [];
  if (contextInfo.value.tenantName)
    parts.push(`当前账套：${contextInfo.value.tenantName}`);
  if (contextInfo.value.fiscalYear)
    parts.push(`默认年度：${contextInfo.value.fiscalYear}`);
  return parts.join(' · ') || '科研指标台账';
});

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  preserveSelectedRowKeys: true,
  onChange: (keys: Array<number | string>) => (selectedRowKeys.value = keys),
}));

const selectedCount = computed(() => selectedRowKeys.value.length);
const flowCount = computed(
  () => dataSource.value.filter((item) => item.flowStatus === '1').length,
);
const totalAmount = computed(() =>
  dataSource.value.reduce(
    (sum, item) => sum + Number(item.indicatorAmount || 0),
    0,
  ),
);
const availableAmount = computed(() =>
  dataSource.value.reduce(
    (sum, item) => sum + Number(item.availableAmount || 0),
    0,
  ),
);

const columns = [
  {
    title: '项目名称',
    dataIndex: 'projectName',
    key: 'projectName',
    width: 220,
  },
  {
    title: '指标编码',
    dataIndex: 'indicatorCode',
    key: 'indicatorCode',
    width: 140,
  },
  {
    title: '指标名称',
    dataIndex: 'indicatorName',
    key: 'indicatorName',
    width: 220,
  },
  { title: '归口部门', dataIndex: 'deptName', key: 'deptName', width: 140 },
  {
    title: '指标金额',
    dataIndex: 'indicatorAmount',
    key: 'indicatorAmount',
    width: 120,
  },
  { title: '已使用', dataIndex: 'usedAmount', key: 'usedAmount', width: 120 },
  {
    title: '可用余额',
    dataIndex: 'availableAmount',
    key: 'availableAmount',
    width: 120,
  },
  { title: '流程状态', dataIndex: 'flowStatus', key: 'flowStatus', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '操作', key: 'action', width: 250 },
];

const historyColumns: any[] = [
  {
    title: '动作',
    dataIndex: 'approvalAction',
    key: 'approvalAction',
    width: 100,
  },
  {
    title: '审批人',
    dataIndex: 'approverName',
    key: 'approverName',
    width: 120,
  },
  {
    title: '审批部门',
    dataIndex: 'approverDeptName',
    key: 'approverDeptName',
    width: 150,
  },
  { title: '意见', dataIndex: 'approvalOpinion', key: 'approvalOpinion' },
  { title: '时间', dataIndex: 'approvalTime', key: 'approvalTime', width: 180 },
];

const defaultForm = () => ({
  deptName: '',
  projectName: '',
  indicatorCode: '',
  indicatorName: '',
  indicatorAmount: 0,
  usedAmount: 0,
  availableAmount: 0,
  flowStatus: '0',
  status: '0',
  remark: '',
});
const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const formState = ref<any>(defaultForm());
const historyOpen = ref(false);
const historyLoading = ref(false);
const historyDataSource = ref<any[]>([]);
const currentHistoryTitle = ref('');

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await researchIndicatorApi.getList({
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
const resetFilters = async () => {
  searchParams.value = {
    fiscalYear: userStore.userInfo?.fiscalYear || '',
    projectName: '',
    indicatorName: '',
    flowStatus: undefined,
    status: undefined,
  };
  selectedRowKeys.value = [];
  await fetchList(1);
};
const clearSelection = () => (selectedRowKeys.value = []);
const getSelectedRecords = () =>
  dataSource.value.filter((item) =>
    selectedRowKeys.value.some((key) => `${key}` === `${item.id}`),
  );

const handleBatchStatus = async (status: '0' | '1') => {
  const records = getSelectedRecords();
  if (records.length === 0) return message.warning('请先选择指标');
  batchLoading.value = true;
  try {
    for (const record of records)
      await researchIndicatorApi.update(record.id, { ...record, status });
    message.success('批量状态更新成功');
    clearSelection();
    await fetchList(pagination.value.current);
  } finally {
    batchLoading.value = false;
  }
};
const handleBatchDelete = () => {
  const records = getSelectedRecords();
  if (records.length === 0) return message.warning('请先选择指标');
  Modal.confirm({
    title: '确定删除选中的指标吗？',
    content: `共 ${records.length} 条记录。`,
    okButtonProps: { danger: true },
    onOk: async () => {
      batchLoading.value = true;
      try {
        for (const record of records)
          await researchIndicatorApi.remove(record.id);
        message.success(`已删除${records.length}条指标记录`);
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
    ? { ...(await researchIndicatorApi.getById(record.id)) }
    : defaultForm();
  isModalVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    formState.value.availableAmount = Number(
      formState.value.availableAmount ||
        Number(formState.value.indicatorAmount || 0) -
          Number(formState.value.usedAmount || 0),
    );
    if (formState.value.id) {
      await researchIndicatorApi.update(formState.value.id, formState.value);
      message.success('更新科研指标成功');
    } else {
      await researchIndicatorApi.create(formState.value);
      message.success('新增科研指标成功');
    }
    isModalVisible.value = false;
    await fetchList(1);
  } finally {
    submitting.value = false;
  }
};
const handleDelete = async (id: string) => {
  await researchIndicatorApi.remove(id);
  message.success('删除科研指标成功');
  await fetchList(1);
};
const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';

const handleSubmitFlow = async (record: any) => {
  await researchIndicatorApi.submit(record.id);
  message.success('科研指标送审成功');
  await fetchList(pagination.value.current);
};

const handleWithdrawFlow = async (record: any) => {
  await researchIndicatorApi.withdraw(record.id);
  message.success('科研指标撤回成功');
  await fetchList(pagination.value.current);
};

const openHistory = async (record: any) => {
  try {
    historyLoading.value = true;
    historyOpen.value = true;
    currentHistoryTitle.value = `审核历史 - ${record.indicatorName || record.indicatorCode || ''}`;
    const history = await researchIndicatorApi.getHistory(record.id);
    historyDataSource.value = Array.isArray(history) ? history : [];
  } finally {
    historyLoading.value = false;
  }
};

onMounted(() => fetchList());
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
          />
          <Input
            v-model:value="searchParams.projectName"
            placeholder="项目名称"
            class="w-48"
            allow-clear
          />
          <Input
            v-model:value="searchParams.indicatorName"
            placeholder="指标名称"
            class="w-48"
            allow-clear
          />
          <Select
            v-model:value="searchParams.flowStatus"
            placeholder="流程状态"
            class="w-32"
            allow-clear
          >
            <Select.Option value="0">未提交</Select.Option
            ><Select.Option value="1">流转中</Select.Option>
          </Select>
          <Select
            v-model:value="searchParams.status"
            placeholder="状态"
            class="w-28"
            allow-clear
          >
            <Select.Option value="0">正常</Select.Option
            ><Select.Option value="1">停用</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button @click="resetFilters">重置</Button>
          <Button type="primary" class="ml-auto" @click="openModal()">
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
          :scroll="{ x: 1500 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'indicatorAmount'">
              {{ formatAmount(record.indicatorAmount) }}
            </template>
            <template v-if="column.key === 'usedAmount'">
              {{ formatAmount(record.usedAmount) }}
            </template>
            <template v-if="column.key === 'availableAmount'">
              {{ formatAmount(record.availableAmount) }}
            </template>
            <template v-if="column.key === 'flowStatus'">
              <Tag
                :color="record.flowStatus === '1' ? 'processing' : 'default'"
              >
                {{ record.flowStatus === '1' ? '流转中' : '未提交' }}
              </Tag>
            </template>
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '正常' : '停用' }}
              </Tag>
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openModal(record)">
                编辑 </Button
              ><Button
                v-if="record.flowStatus !== '1'"
                type="link"
                size="small"
                @click="handleSubmitFlow(record)"
              >
                送审 </Button
              ><Button
                v-if="record.flowStatus === '1'"
                type="link"
                size="small"
                @click="handleWithdrawFlow(record)"
              >
                撤回 </Button
              ><Button type="link" size="small" @click="openHistory(record)">
                历史 </Button
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
        :title="formState.id ? '编辑科研指标' : '新增科研指标'"
        @ok="handleSubmit"
        :confirm-loading="submitting"
        destroy-on-close
        width="760px"
      >
        <Form
          ref="formRef"
          :model="formState"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
          class="mt-4"
        >
          <div class="grid grid-cols-2 gap-x-4">
            <Form.Item
              label="项目名称"
              name="projectName"
              :rules="[{ required: true, message: '请输入项目名称' }]"
            >
              <Input v-model:value="formState.projectName" />
            </Form.Item>
            <Form.Item label="归口部门" name="deptName">
              <Input v-model:value="formState.deptName" />
            </Form.Item>
            <Form.Item label="指标编码" name="indicatorCode">
              <Input v-model:value="formState.indicatorCode" />
            </Form.Item>
            <Form.Item
              label="指标名称"
              name="indicatorName"
              :rules="[{ required: true, message: '请输入指标名称' }]"
            >
              <Input v-model:value="formState.indicatorName" />
            </Form.Item>
            <Form.Item label="指标金额" name="indicatorAmount">
              <InputNumber
                v-model:value="formState.indicatorAmount"
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
            <Form.Item label="流程状态" name="flowStatus">
              <Radio.Group v-model:value="formState.flowStatus" disabled>
                <Radio value="0">未提交</Radio><Radio value="1">流转中</Radio>
              </Radio.Group>
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
      <Modal
        v-model:open="historyOpen"
        :title="currentHistoryTitle"
        :footer="null"
        width="980px"
        destroy-on-close
      >
        <Table
          :columns="historyColumns"
          :data-source="historyDataSource"
          :loading="historyLoading"
          row-key="id"
          bordered
          size="small"
          :pagination="false"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'approvalTime'">
              {{ formatDate(record.approvalTime) }}
            </template>
          </template>
        </Table>
      </Modal>
    </div>
  </Page>
</template>
