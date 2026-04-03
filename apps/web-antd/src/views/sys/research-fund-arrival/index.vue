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

import { researchFundArrivalApi } from '#/api/core/sys-manage';

const userStore = useUserStore();
const loading = ref(false);
const dataSource = ref<any[]>([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const contextInfo = ref({
  fiscalYear: userStore.userInfo?.fiscalYear || '',
  tenantName: userStore.userInfo?.tenantName || '',
});
const searchParams = ref({
  fiscalYear: userStore.userInfo?.fiscalYear || '',
  payeeName: '',
  isReleased: undefined,
  status: undefined,
});

const pageDescription = computed(() => {
  const parts = [];
  if (contextInfo.value.tenantName) {
    parts.push(`当前账套：${contextInfo.value.tenantName}`);
  }
  if (contextInfo.value.fiscalYear) {
    parts.push(`默认年度：${contextInfo.value.fiscalYear}年度`);
  }
  return parts.join(' · ') || '科研资金到账业务示例，已接入年度上下文过滤。';
});

const columns = [
  { title: '收款方', dataIndex: 'payeeName', key: 'payeeName', width: 180 },
  {
    title: '到账日期',
    dataIndex: 'arrivalDate',
    key: 'arrivalDate',
    width: 140,
  },
  {
    title: '到账金额',
    dataIndex: 'arrivalAmount',
    key: 'arrivalAmount',
    width: 120,
  },
  {
    title: '收款账号',
    dataIndex: 'payeeAccount',
    key: 'payeeAccount',
    width: 180,
  },
  { title: '到账银行', dataIndex: 'payeeBank', key: 'payeeBank', width: 160 },
  { title: '是否下达', dataIndex: 'isReleased', key: 'isReleased', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
  { title: '操作', key: 'action', width: 130 },
];

const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const defaultForm = () => ({
  arrivalAmount: 0,
  arrivalDate: `${userStore.userInfo?.fiscalYear || new Date().getFullYear()}-01-01`,
  claimedAmount: 0,
  deptName: '',
  isReleased: '0',
  payeeAccount: '',
  payeeBank: '',
  payeeName: '',
  releaseDate: '',
  remark: '',
  status: '0',
});
const formState = ref<any>(defaultForm());

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await researchFundArrivalApi.getList({
      page,
      pageSize: pagination.value.pageSize,
      ...searchParams.value,
    });
    dataSource.value = res?.items || [];
    pagination.value.current = page;
    pagination.value.total = res?.total || 0;
    contextInfo.value = {
      fiscalYear:
        res?.context?.fiscalYear || userStore.userInfo?.fiscalYear || '',
      tenantName:
        res?.context?.tenantName || userStore.userInfo?.tenantName || '',
    };
  } finally {
    loading.value = false;
  }
};

const openModal = async (record?: any) => {
  if (record?.id) {
    const detail = await researchFundArrivalApi.getById(record.id);
    formState.value = {
      ...detail,
      arrivalDate: formatDateValue(detail?.arrivalDate),
      releaseDate: formatDateValue(detail?.releaseDate),
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
      await researchFundArrivalApi.update(formState.value.id, formState.value);
      message.success('更新资金到账成功');
    } else {
      await researchFundArrivalApi.create(formState.value);
      message.success('新增资金到账成功');
    }
    isModalVisible.value = false;
    fetchList(1);
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id: string) => {
  await researchFundArrivalApi.remove(id);
  message.success('删除资金到账成功');
  fetchList(1);
};

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';
const formatDateValue = (value?: string) =>
  value ? new Date(value).toISOString().slice(0, 10) : '';
const formatMoney = (value?: number | string) =>
  value === undefined || value === null || value === ''
    ? '0.00'
    : Number(value).toFixed(2);

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
            v-model:value="searchParams.payeeName"
            placeholder="收款方名称"
            style="width: 220px"
          />
          <Select
            v-model:value="searchParams.isReleased"
            placeholder="是否下达"
            allow-clear
            style="width: 140px"
          >
            <Select.Option value="0">未下达</Select.Option>
            <Select.Option value="1">已下达</Select.Option>
          </Select>
          <Select
            v-model:value="searchParams.status"
            placeholder="状态"
            allow-clear
            style="width: 120px"
          >
            <Select.Option value="0">正常</Select.Option>
            <Select.Option value="1">停用</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button
            @click="
              () => {
                searchParams.fiscalYear = userStore.userInfo?.fiscalYear || '';
                searchParams.payeeName = '';
                searchParams.isReleased = undefined;
                searchParams.status = undefined;
                fetchList(1);
              }
            "
          >
            重置
          </Button>
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
          :scroll="{ x: 1350 }"
          @change="(pag) => fetchList(pag.current)"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'arrivalDate'">
              {{ formatDate(record.arrivalDate) }}
            </template>
            <template v-if="column.key === 'arrivalAmount'">
              {{ formatMoney(record.arrivalAmount) }}
            </template>
            <template v-if="column.key === 'isReleased'">
              <Tag
                :color="record.isReleased === '1' ? 'success' : 'processing'"
              >
                {{ record.isReleased === '1' ? '已下达' : '未下达' }}
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
                编辑
              </Button>
              <Popconfirm
                title="确定删除吗？"
                @confirm="handleDelete(record.id)"
              >
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
    </div>

    <Modal
      v-model:open="isModalVisible"
      :title="formState.id ? '编辑资金到账' : '新增资金到账'"
      @ok="handleSubmit"
      :confirm-loading="submitting"
      destroy-on-close
      width="720px"
    >
      <Form ref="formRef" :model="formState" layout="vertical" class="mt-4">
        <div class="grid grid-cols-2 gap-4">
          <Form.Item
            label="收款方"
            name="payeeName"
            :rules="[{ required: true, message: '请输入收款方名称' }]"
          >
            <Input
              v-model:value="formState.payeeName"
              placeholder="请输入收款方名称"
            />
          </Form.Item>
          <Form.Item
            label="到账日期"
            name="arrivalDate"
            :rules="[{ required: true, message: '请输入到账日期' }]"
          >
            <Input
              v-model:value="formState.arrivalDate"
              placeholder="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item label="到账金额" name="arrivalAmount">
            <InputNumber
              v-model:value="formState.arrivalAmount"
              :min="0"
              style="width: 100%"
            />
          </Form.Item>
          <Form.Item label="已认领金额" name="claimedAmount">
            <InputNumber
              v-model:value="formState.claimedAmount"
              :min="0"
              style="width: 100%"
            />
          </Form.Item>
          <Form.Item label="收款账号" name="payeeAccount">
            <Input
              v-model:value="formState.payeeAccount"
              placeholder="请输入收款账号"
            />
          </Form.Item>
          <Form.Item label="到账银行" name="payeeBank">
            <Input
              v-model:value="formState.payeeBank"
              placeholder="请输入到账银行"
            />
          </Form.Item>
          <Form.Item label="是否下达" name="isReleased">
            <Radio.Group v-model:value="formState.isReleased">
              <Radio value="0">未下达</Radio>
              <Radio value="1">已下达</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="下达日期" name="releaseDate">
            <Input
              v-model:value="formState.releaseDate"
              placeholder="YYYY-MM-DD，可不填"
            />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Radio.Group v-model:value="formState.status">
              <Radio value="0">正常</Radio>
              <Radio value="1">停用</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="部门名称" name="deptName">
            <Input
              v-model:value="formState.deptName"
              placeholder="可选填写部门名称"
            />
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
