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

import { procurementReleaseApi } from '#/api/core/sys-manage';

const userStore = useUserStore();
const loading = ref(false);
const submitting = ref(false);
const isModalVisible = ref(false);
const dataSource = ref<any[]>([]);
const formRef = ref();
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const contextInfo = ref({
  fiscalYear: userStore.userInfo?.fiscalYear || '',
  tenantName: userStore.userInfo?.tenantName || '',
});
const searchParams = ref({
  applyNo: '',
  fiscalYear: userStore.userInfo?.fiscalYear || '',
  projectName: '',
  releaseStatus: undefined as string | undefined,
  status: undefined as string | undefined,
});

const defaultFormState = () => ({
  applyNo: '',
  contractAmount: 0,
  expenseUsedAmount: 0,
  procureApplyAmount: 0,
  projectName: '',
  releaseAmount: 0,
  releaseDate: userStore.userInfo?.fiscalYear
    ? `${userStore.userInfo.fiscalYear}-01-01`
    : '',
  releasedAmount: 0,
  releaseStatus: '0',
  remark: '',
  status: '0',
  unitName: '',
  winBidAmount: 0,
});
const formState = ref<any>(defaultFormState());

const pageDescription = computed(
  () =>
    `当前年度：${contextInfo.value.fiscalYear || '-'} ｜ 当前账套：${contextInfo.value.tenantName || '-'}`,
);

const columns = [
  { title: '申报单号', dataIndex: 'applyNo', key: 'applyNo', width: 180 },
  {
    title: '项目名称',
    dataIndex: 'projectName',
    key: 'projectName',
    width: 220,
  },
  { title: '归口单位', dataIndex: 'unitName', key: 'unitName', width: 180 },
  {
    title: '申报金额',
    dataIndex: 'procureApplyAmount',
    key: 'procureApplyAmount',
    width: 140,
  },
  {
    title: '中标金额',
    dataIndex: 'winBidAmount',
    key: 'winBidAmount',
    width: 140,
  },
  {
    title: '释放金额',
    dataIndex: 'releaseAmount',
    key: 'releaseAmount',
    width: 140,
  },
  {
    title: '释放日期',
    dataIndex: 'releaseDate',
    key: 'releaseDate',
    width: 140,
  },
  {
    title: '释放状态',
    dataIndex: 'releaseStatus',
    key: 'releaseStatus',
    width: 120,
  },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 140 },
];

const formatMoney = (value?: number | string) =>
  value === undefined || value === null || value === ''
    ? '0.00'
    : Number(value).toFixed(2);
const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString('zh-CN') : '-';
const formatDateTime = (value?: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';
const normalizeDate = (value?: string) =>
  value ? String(value).slice(0, 10) : '';

async function fetchList(page = pagination.value.current) {
  loading.value = true;
  try {
    const result = await procurementReleaseApi.getList({
      ...searchParams.value,
      page,
      pageSize: pagination.value.pageSize,
    });
    dataSource.value = result.items || [];
    pagination.value = {
      ...pagination.value,
      current: page,
      total: result.total || 0,
    };
    if (result.context) contextInfo.value = result.context;
  } finally {
    loading.value = false;
  }
}

function resetSearch() {
  searchParams.value = {
    applyNo: '',
    fiscalYear: userStore.userInfo?.fiscalYear || '',
    projectName: '',
    releaseStatus: undefined,
    status: undefined,
  };
  fetchList(1);
}

function openModal(record?: any) {
  formState.value = record
    ? {
        ...defaultFormState(),
        ...record,
        releaseDate: normalizeDate(record.releaseDate),
      }
    : defaultFormState();
  isModalVisible.value = true;
}

async function handleSubmit() {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.id) {
      await procurementReleaseApi.update(formState.value.id, formState.value);
      message.success('更新采购释放成功');
    } else {
      await procurementReleaseApi.create(formState.value);
      message.success('新增采购释放成功');
    }
    isModalVisible.value = false;
    fetchList(1);
  } finally {
    submitting.value = false;
  }
}

async function handleDelete(id: string) {
  await procurementReleaseApi.remove(id);
  message.success('删除采购释放成功');
  fetchList(1);
}

onMounted(() => fetchList());
</script>

<template>
  <Page>
    <div class="space-y-4">
      <Card>
        <div class="mb-4 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.fiscalYear"
            placeholder="年度，如 2026"
            style="width: 140px"
          />
          <Input
            v-model:value="searchParams.applyNo"
            placeholder="申报单号"
            style="width: 180px"
          />
          <Input
            v-model:value="searchParams.projectName"
            placeholder="项目名称"
            style="width: 180px"
          />
          <Select
            v-model:value="searchParams.releaseStatus"
            placeholder="释放状态"
            allow-clear
            style="width: 120px"
          >
            <Select.Option value="0">未释放</Select.Option
            ><Select.Option value="1">已释放</Select.Option>
          </Select>
          <Select
            v-model:value="searchParams.status"
            placeholder="状态"
            allow-clear
            style="width: 120px"
          >
            <Select.Option value="0">正常</Select.Option
            ><Select.Option value="1">停用</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button @click="resetSearch">重置</Button>
          <Button type="primary" class="ml-auto" @click="openModal()">
            + 新增
          </Button>
        </div>
        <Table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="pagination"
          row-key="id"
          bordered
          size="middle"
          :scroll="{ x: 1800 }"
          @change="(pag) => fetchList(pag.current || 1)"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'procureApplyAmount'">
              {{ formatMoney(record.procureApplyAmount) }}
            </template>
            <template v-else-if="column.key === 'winBidAmount'">
              {{ formatMoney(record.winBidAmount) }}
            </template>
            <template v-else-if="column.key === 'releaseAmount'">
              {{ formatMoney(record.releaseAmount) }}
            </template>
            <template v-else-if="column.key === 'releaseDate'">
              {{ formatDate(record.releaseDate) }}
            </template>
            <template v-else-if="column.key === 'createTime'">
              {{ formatDateTime(record.createTime) }}
            </template>
            <template v-else-if="column.key === 'releaseStatus'">
              <Tag
                :color="record.releaseStatus === '1' ? 'processing' : 'default'"
              >
                {{ record.releaseStatus === '1' ? '已释放' : '未释放' }}
              </Tag>
            </template>
            <template v-else-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '正常' : '停用' }}
              </Tag>
            </template>
            <template v-else-if="column.key === 'action'">
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
    </div>
    <Modal
      v-model:open="isModalVisible"
      :title="formState.id ? '编辑采购释放' : '新增采购释放'"
      @ok="handleSubmit"
      :confirm-loading="submitting"
      destroy-on-close
      width="860px"
    >
      <Form ref="formRef" :model="formState" layout="vertical" class="mt-4">
        <div class="grid grid-cols-2 gap-4">
          <Form.Item
            label="申报单号"
            name="applyNo"
            :rules="[{ required: true, message: '请输入申报单号' }]"
          >
            <Input
              v-model:value="formState.applyNo"
              placeholder="请输入申报单号"
            />
          </Form.Item>
          <Form.Item
            label="项目名称"
            name="projectName"
            :rules="[{ required: true, message: '请输入项目名称' }]"
          >
            <Input
              v-model:value="formState.projectName"
              placeholder="请输入项目名称"
            />
          </Form.Item>
          <Form.Item label="归口单位" name="unitName">
            <Input
              v-model:value="formState.unitName"
              placeholder="请输入归口单位"
            />
          </Form.Item>
          <Form.Item label="申报金额" name="procureApplyAmount">
            <InputNumber
              v-model:value="formState.procureApplyAmount"
              :min="0"
              style="width: 100%"
            />
          </Form.Item>
          <Form.Item label="中标金额" name="winBidAmount">
            <InputNumber
              v-model:value="formState.winBidAmount"
              :min="0"
              style="width: 100%"
            />
          </Form.Item>
          <Form.Item label="释放金额" name="releaseAmount">
            <InputNumber
              v-model:value="formState.releaseAmount"
              :min="0"
              style="width: 100%"
            />
          </Form.Item>
          <Form.Item
            label="释放日期"
            name="releaseDate"
            :rules="[{ required: true, message: '请输入释放日期' }]"
          >
            <Input
              v-model:value="formState.releaseDate"
              placeholder="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item label="释放状态" name="releaseStatus">
            <Radio.Group v-model:value="formState.releaseStatus">
              <Radio value="0">未释放</Radio><Radio value="1">已释放</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Radio.Group v-model:value="formState.status">
              <Radio value="0">正常</Radio><Radio value="1">停用</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
        <Form.Item label="备注" name="remark">
          <Input.TextArea
            v-model:value="formState.remark"
            placeholder="可输入备注信息"
          />
        </Form.Item>
      </Form>
    </Modal>
  </Page>
</template>
