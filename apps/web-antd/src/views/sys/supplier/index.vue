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

import { supplierApi } from '#/api/core/sys-manage';

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
  fiscalYear: userStore.userInfo?.fiscalYear || '',
  procureType: '',
  status: undefined as string | undefined,
  supplierCode: '',
  supplierName: '',
});

const defaultFormState = () => ({
  creditCode: '',
  enterpriseType: '',
  isAbnormal: '0',
  procureType: '',
  registeredCapital: 0,
  remark: '',
  status: '0',
  supplierAddress: '',
  supplierCode: '',
  supplierName: '',
});
const formState = ref<any>(defaultFormState());

const pageDescription = computed(
  () =>
    `当前年度：${contextInfo.value.fiscalYear || '-'} ｜ 当前账套：${contextInfo.value.tenantName || '-'}`,
);

const columns = [
  {
    title: '供应商编码',
    dataIndex: 'supplierCode',
    key: 'supplierCode',
    width: 160,
  },
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
    key: 'supplierName',
    width: 220,
  },
  {
    title: '采购类型',
    dataIndex: 'procureType',
    key: 'procureType',
    width: 140,
  },
  {
    title: '统一信用代码',
    dataIndex: 'creditCode',
    key: 'creditCode',
    width: 180,
  },
  {
    title: '企业类型',
    dataIndex: 'enterpriseType',
    key: 'enterpriseType',
    width: 140,
  },
  {
    title: '注册资本',
    dataIndex: 'registeredCapital',
    key: 'registeredCapital',
    width: 140,
  },
  { title: '异常状态', dataIndex: 'isAbnormal', key: 'isAbnormal', width: 120 },
  {
    title: '地址',
    dataIndex: 'supplierAddress',
    key: 'supplierAddress',
    width: 220,
  },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 140 },
];

const formatMoney = (value?: number | string) =>
  value === undefined || value === null || value === ''
    ? '0.00'
    : Number(value).toFixed(2);
const formatDateTime = (value?: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';

async function fetchList(page = pagination.value.current) {
  loading.value = true;
  try {
    const result = await supplierApi.getList({
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
    fiscalYear: userStore.userInfo?.fiscalYear || '',
    procureType: '',
    status: undefined,
    supplierCode: '',
    supplierName: '',
  };
  fetchList(1);
}

function openModal(record?: any) {
  formState.value = record
    ? { ...defaultFormState(), ...record }
    : defaultFormState();
  isModalVisible.value = true;
}

async function handleSubmit() {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.id) {
      await supplierApi.update(formState.value.id, formState.value);
      message.success('更新供应商成功');
    } else {
      await supplierApi.create(formState.value);
      message.success('新增供应商成功');
    }
    isModalVisible.value = false;
    fetchList(1);
  } finally {
    submitting.value = false;
  }
}

async function handleDelete(id: string) {
  await supplierApi.remove(id);
  message.success('删除供应商成功');
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
            v-model:value="searchParams.supplierCode"
            placeholder="供应商编码"
            style="width: 180px"
          />
          <Input
            v-model:value="searchParams.supplierName"
            placeholder="供应商名称"
            style="width: 180px"
          />
          <Input
            v-model:value="searchParams.procureType"
            placeholder="采购类型"
            style="width: 160px"
          />
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
            <template v-if="column.key === 'registeredCapital'">
              {{ formatMoney(record.registeredCapital) }}
            </template>
            <template v-else-if="column.key === 'createTime'">
              {{ formatDateTime(record.createTime) }}
            </template>
            <template v-else-if="column.key === 'isAbnormal'">
              <Tag :color="record.isAbnormal === '1' ? 'warning' : 'success'">
                {{ record.isAbnormal === '1' ? '异常' : '正常' }}
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
      :title="formState.id ? '编辑供应商' : '新增供应商'"
      @ok="handleSubmit"
      :confirm-loading="submitting"
      destroy-on-close
      width="860px"
    >
      <Form ref="formRef" :model="formState" layout="vertical" class="mt-4">
        <div class="grid grid-cols-2 gap-4">
          <Form.Item
            label="供应商编码"
            name="supplierCode"
            :rules="[{ required: true, message: '请输入供应商编码' }]"
          >
            <Input
              v-model:value="formState.supplierCode"
              placeholder="请输入供应商编码"
            />
          </Form.Item>
          <Form.Item
            label="供应商名称"
            name="supplierName"
            :rules="[{ required: true, message: '请输入供应商名称' }]"
          >
            <Input
              v-model:value="formState.supplierName"
              placeholder="请输入供应商名称"
            />
          </Form.Item>
          <Form.Item label="采购类型" name="procureType">
            <Input
              v-model:value="formState.procureType"
              placeholder="请输入采购类型"
            />
          </Form.Item>
          <Form.Item label="统一信用代码" name="creditCode">
            <Input
              v-model:value="formState.creditCode"
              placeholder="请输入统一信用代码"
            />
          </Form.Item>
          <Form.Item label="企业类型" name="enterpriseType">
            <Input
              v-model:value="formState.enterpriseType"
              placeholder="请输入企业类型"
            />
          </Form.Item>
          <Form.Item label="注册资本" name="registeredCapital">
            <InputNumber
              v-model:value="formState.registeredCapital"
              :min="0"
              style="width: 100%"
            />
          </Form.Item>
          <Form.Item label="异常状态" name="isAbnormal">
            <Radio.Group v-model:value="formState.isAbnormal">
              <Radio value="0">正常</Radio><Radio value="1">异常</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Radio.Group v-model:value="formState.status">
              <Radio value="0">正常</Radio><Radio value="1">停用</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
        <Form.Item label="供应商地址" name="supplierAddress">
          <Input
            v-model:value="formState.supplierAddress"
            placeholder="请输入供应商地址"
          />
        </Form.Item>
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
