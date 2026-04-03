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

import { researchFundClaimApi } from '#/api/core/sys-manage';

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
  isClaimed: undefined,
  status: undefined,
});

const pageDescription = computed(() => {
  const parts = [];
  if (contextInfo.value.tenantName)
    parts.push(`当前账套：${contextInfo.value.tenantName}`);
  if (contextInfo.value.fiscalYear)
    parts.push(`默认年度：${contextInfo.value.fiscalYear}`);
  return parts.join(' · ') || '资金认领台账';
});

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  preserveSelectedRowKeys: true,
  onChange: (keys: Array<number | string>) => {
    selectedRowKeys.value = keys;
  },
}));

const selectedCount = computed(() => selectedRowKeys.value.length);
const claimedCount = computed(
  () => dataSource.value.filter((item) => item.isClaimed === '1').length,
);
const normalCount = computed(
  () => dataSource.value.filter((item) => item.status === '0').length,
);
const currentPageAmount = computed(() =>
  dataSource.value.reduce(
    (sum, item) => sum + Number(item.claimAmount || 0),
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
    title: '指标名称',
    dataIndex: 'indicatorName',
    key: 'indicatorName',
    width: 200,
  },
  {
    title: '认领金额',
    dataIndex: 'claimAmount',
    key: 'claimAmount',
    width: 120,
  },
  { title: '认领日期', dataIndex: 'claimDate', key: 'claimDate', width: 140 },
  { title: '认领状态', dataIndex: 'isClaimed', key: 'isClaimed', width: 100 },
  {
    title: '经办人',
    dataIndex: 'operatorName',
    key: 'operatorName',
    width: 120,
  },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
  { title: '操作', key: 'action', width: 160 },
];

const defaultForm = () => ({
  projectName: '',
  indicatorName: '',
  claimAmount: 0,
  claimDate: `${userStore.userInfo?.fiscalYear || new Date().getFullYear()}-01-01`,
  isClaimed: '0',
  operatorName: '',
  status: '0',
  remark: '',
});

const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const formState = ref<any>(defaultForm());

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await researchFundClaimApi.getList({
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

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';
const formatDateValue = (value?: string) =>
  value ? new Date(value).toISOString().slice(0, 10) : '';
const formatAmount = (value: number | string) =>
  Number(value || 0).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const resetFilters = async () => {
  searchParams.value = {
    fiscalYear: userStore.userInfo?.fiscalYear || '',
    projectName: '',
    isClaimed: undefined,
    status: undefined,
  };
  selectedRowKeys.value = [];
  await fetchList(1);
};

const clearSelection = () => {
  selectedRowKeys.value = [];
};

const getSelectedRecords = () =>
  dataSource.value.filter((item) =>
    selectedRowKeys.value.some((key) => `${key}` === `${item.id}`),
  );

const handleBatchStatus = async (status: '0' | '1') => {
  const records = getSelectedRecords();
  if (records.length === 0) return message.warning('请先选择认领记录');
  batchLoading.value = true;
  try {
    for (const record of records) {
      await researchFundClaimApi.update(record.id, {
        ...record,
        claimDate: formatDateValue(record.claimDate),
        status,
      });
    }
    message.success('批量状态更新成功');
    clearSelection();
    await fetchList(pagination.value.current);
  } finally {
    batchLoading.value = false;
  }
};

const handleBatchDelete = () => {
  const records = getSelectedRecords();
  if (records.length === 0) return message.warning('请先选择认领记录');
  Modal.confirm({
    title: '确定删除选中的认领记录吗？',
    content: `共 ${records.length} 条记录，删除后不可恢复。`,
    okButtonProps: { danger: true },
    onOk: async () => {
      batchLoading.value = true;
      try {
        for (const record of records)
          await researchFundClaimApi.remove(record.id);
        message.success(`已删除${records.length}条认领记录`);
        clearSelection();
        await fetchList(pagination.value.current);
      } finally {
        batchLoading.value = false;
      }
    },
  });
};

const openModal = async (record?: any) => {
  if (record?.id) {
    const detail = await researchFundClaimApi.getById(record.id);
    formState.value = {
      ...detail,
      claimDate: formatDateValue(detail?.claimDate),
    };
  } else {
    formState.value = defaultForm();
  }
  isModalVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.id) {
      await researchFundClaimApi.update(formState.value.id, formState.value);
      message.success('更新资金认领成功');
    } else {
      await researchFundClaimApi.create(formState.value);
      message.success('新增资金认领成功');
    }
    isModalVisible.value = false;
    await fetchList(1);
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id: string) => {
  await researchFundClaimApi.remove(id);
  message.success('删除资金认领成功');
  await fetchList(1);
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
            placeholder="年度，如 2026"
            class="w-32"
            allow-clear
          />
          <Input
            v-model:value="searchParams.projectName"
            placeholder="项目名称"
            class="w-52"
            allow-clear
          />
          <Select
            v-model:value="searchParams.isClaimed"
            placeholder="认领状态"
            allow-clear
            class="w-32"
          >
            <Select.Option value="0">未认领</Select.Option>
            <Select.Option value="1">已认领</Select.Option>
          </Select>
          <Select
            v-model:value="searchParams.status"
            placeholder="状态"
            allow-clear
            class="w-28"
          >
            <Select.Option value="0">正常</Select.Option>
            <Select.Option value="1">停用</Select.Option>
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
          <span>已选 {{ selectedCount }} 条</span>
          <Button
            size="small"
            :disabled="selectedCount === 0"
            :loading="batchLoading"
            @click="handleBatchStatus('0')"
          >
            批量启用
          </Button>
          <Button
            size="small"
            :disabled="selectedCount === 0"
            :loading="batchLoading"
            @click="handleBatchStatus('1')"
          >
            批量停用
          </Button>
          <Button
            size="small"
            danger
            :disabled="selectedCount === 0"
            :loading="batchLoading"
            @click="handleBatchDelete"
          >
            批量删除
          </Button>
          <Button
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
          :scroll="{ x: 1360 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'claimAmount'">
              {{ formatAmount(record.claimAmount) }}
            </template>
            <template v-if="column.key === 'claimDate'">
              {{ formatDate(record.claimDate) }}
            </template>
            <template v-if="column.key === 'isClaimed'">
              <Tag :color="record.isClaimed === '1' ? 'success' : 'default'">
                {{ record.isClaimed === '1' ? '已认领' : '未认领' }}
              </Tag>
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
        :title="formState.id ? '编辑资金认领' : '新增资金认领'"
        @ok="handleSubmit"
        :confirm-loading="submitting"
        destroy-on-close
        width="680px"
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
            <Form.Item label="指标名称" name="indicatorName">
              <Input v-model:value="formState.indicatorName" />
            </Form.Item>
            <Form.Item label="认领金额" name="claimAmount">
              <InputNumber
                v-model:value="formState.claimAmount"
                class="w-full"
                :min="0"
              />
            </Form.Item>
            <Form.Item label="认领日期" name="claimDate">
              <Input
                v-model:value="formState.claimDate"
                placeholder="YYYY-MM-DD"
              />
            </Form.Item>
            <Form.Item label="认领状态" name="isClaimed">
              <Radio.Group v-model:value="formState.isClaimed">
                <Radio value="0">未认领</Radio><Radio value="1">已认领</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="经办人" name="operatorName">
              <Input v-model:value="formState.operatorName" />
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
