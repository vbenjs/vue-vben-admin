<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

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

import { incomeSettlementApi, invoiceFolderApi } from '#/api/core/finance';

const loading = ref(false);
const dataSource = ref<any[]>([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const invoicePickerOpen = ref(false);
const invoicePickerLoading = ref(false);
const invoiceDataSource = ref<any[]>([]);
const searchParams = ref({
  keyword: '',
  deptName: '',
  receiptMethod: undefined as string | undefined,
  status: undefined as string | undefined,
});
const defaultForm = () => ({
  amount: 0,
  applicant: '',
  bankAccount: '',
  bankName: '',
  billNo: '',
  contactType: '往来单位',
  content: '',
  deptName: '',
  fileName: '',
  folderName: '默认发票夹',
  invoiceAmount: 0,
  invoiceNo: '',
  invoiceType: '电子票据',
  isSupplement: '0',
  payeeName: '',
  receiptMethod: '银行转账',
  remark: '',
  status: '0',
  title: '',
});
const formState = ref<any>(defaultForm());

const columns = [
  { title: '结算单号', dataIndex: 'billNo', key: 'billNo', width: 160 },
  { title: '收款人', dataIndex: 'payeeName', key: 'payeeName', width: 140 },
  { title: '部门', dataIndex: 'deptName', key: 'deptName', width: 160 },
  { title: '收款内容', dataIndex: 'content', key: 'content', width: 220 },
  { title: '收款方式', dataIndex: 'receiptMethod', key: 'receiptMethod', width: 120 },
  { title: '收款金额', dataIndex: 'amount', key: 'amount', width: 120 },
  { title: '发票号码', dataIndex: 'invoiceNo', key: 'invoiceNo', width: 160 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 180 },
];
const invoiceColumns = [
  { title: '发票号码', dataIndex: 'invoiceNo', key: 'invoiceNo', width: 180 },
  { title: '文件名称', dataIndex: 'fileName', key: 'fileName', width: 220 },
  { title: '发票类型', dataIndex: 'invoiceType', key: 'invoiceType', width: 180 },
  { title: '金额', dataIndex: 'amount', key: 'amount', width: 120 },
  { title: '操作', key: 'action', width: 120 },
];

const statusMap: Record<string, { color: string; text: string }> = {
  '0': { color: 'default', text: '草稿' },
  '1': { color: 'processing', text: '已提交' },
  '2': { color: 'success', text: '已完成' },
};

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';
const formatMoney = (value?: number | string) =>
  value === undefined || value === null || value === ''
    ? '0.00'
    : Number(value).toFixed(2);

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await incomeSettlementApi.getList({
      page,
      pageSize: pagination.value.pageSize,
      ...searchParams.value,
    });
    dataSource.value = res?.items || [];
    pagination.value.current = page;
    pagination.value.total = res?.total || 0;
  } finally {
    loading.value = false;
  }
};

const openModal = async (record?: any) => {
  formState.value = record?.id
    ? await incomeSettlementApi.getById(record.id)
    : defaultForm();
  isModalVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.id) {
      await incomeSettlementApi.update(formState.value.id, formState.value);
      message.success('更新收入结算单成功');
    } else {
      await incomeSettlementApi.create(formState.value);
      message.success('新增收入结算单成功');
    }
    isModalVisible.value = false;
    fetchList(1);
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id: string) => {
  await incomeSettlementApi.remove(id);
  message.success('删除收入结算单成功');
  fetchList(1);
};

const openInvoiceFolder = () => {
  window.open('/finance/invoice-folder', '_blank');
};
const openInvoicePicker = async () => {
  try {
    invoicePickerLoading.value = true;
    invoicePickerOpen.value = true;
    const res = await invoiceFolderApi.getList({ page: 1, pageSize: 200, useStatus: '0' });
    invoiceDataSource.value = res?.items || [];
  } finally {
    invoicePickerLoading.value = false;
  }
};
const applyInvoice = (record: any) => {
  formState.value.invoiceNo = record.invoiceNo || '';
  formState.value.invoiceAmount = Number(record.amount || 0);
  formState.value.fileName = record.fileName || '';
  formState.value.folderName = record.folderName || '默认发票夹';
  invoicePickerOpen.value = false;
};

onMounted(() => fetchList());
</script>

<template>
  <Page title="收入结算单" description="维护收入结算单、发票信息与收款信息。">
    <div class="space-y-4">
      <Card>
        <div class="mb-4 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.keyword"
            placeholder="结算单号/收款人/发票号"
            style="width: 240px"
          />
          <Input
            v-model:value="searchParams.deptName"
            placeholder="部门"
            style="width: 180px"
          />
          <Select
            v-model:value="searchParams.receiptMethod"
            placeholder="收款方式"
            allow-clear
            style="width: 140px"
          >
            <Select.Option value="银行转账">银行转账</Select.Option>
            <Select.Option value="现金">现金</Select.Option>
            <Select.Option value="POS刷卡">POS刷卡</Select.Option>
          </Select>
          <Select
            v-model:value="searchParams.status"
            placeholder="状态"
            allow-clear
            style="width: 120px"
          >
            <Select.Option value="0">草稿</Select.Option>
            <Select.Option value="1">已提交</Select.Option>
            <Select.Option value="2">已完成</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button
            @click="
              () => {
                searchParams.keyword = '';
                searchParams.deptName = '';
                searchParams.receiptMethod = undefined;
                searchParams.status = undefined;
                fetchList(1);
              }
            "
          >
            重置
          </Button>
          <Button @click="openInvoiceFolder">发票夹</Button>
          <Button type="primary" class="ml-auto" @click="openModal()">新增收入结算单</Button>
        </div>

        <Table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="pagination"
          row-key="id"
          bordered
          size="middle"
          :scroll="{ x: 1500 }"
          @change="(pag) => fetchList(pag.current)"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'amount'">
              {{ formatMoney(record.amount) }}
            </template>
            <template v-if="column.key === 'status'">
              <Tag :color="statusMap[record.status]?.color || 'default'">
                {{ statusMap[record.status]?.text || '-' }}
              </Tag>
            </template>
            <template v-if="column.key === 'createTime'">
              {{ formatDate(record.createTime) }}
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openModal(record)">编辑</Button>
              <Popconfirm title="确定删除吗？" @confirm="handleDelete(record.id)">
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
    </div>

    <Modal
      v-model:open="isModalVisible"
      :title="formState.id ? '编辑收入结算单' : '新增收入结算单'"
      @ok="handleSubmit"
      :confirm-loading="submitting"
      destroy-on-close
      width="980px"
    >
      <Form ref="formRef" :model="formState" layout="vertical" class="mt-4">
        <div class="grid grid-cols-3 gap-4">
          <Form.Item label="结算单号" name="billNo">
            <Input v-model:value="formState.billNo" placeholder="请输入结算单号" />
          </Form.Item>
          <Form.Item label="收款人" name="payeeName" :rules="[{ required: true, message: '请输入收款人' }]">
            <Input v-model:value="formState.payeeName" placeholder="请输入收款人" />
          </Form.Item>
          <Form.Item label="申请人" name="applicant">
            <Input v-model:value="formState.applicant" placeholder="请输入申请人" />
          </Form.Item>
          <Form.Item label="部门" name="deptName">
            <Input v-model:value="formState.deptName" placeholder="请输入部门" />
          </Form.Item>
          <Form.Item label="收款内容" name="content" :rules="[{ required: true, message: '请输入收款内容' }]">
            <Input v-model:value="formState.content" placeholder="请输入收款内容" />
          </Form.Item>
          <Form.Item label="收款方式" name="receiptMethod">
            <Select v-model:value="formState.receiptMethod">
              <Select.Option value="银行转账">银行转账</Select.Option>
              <Select.Option value="现金">现金</Select.Option>
              <Select.Option value="POS刷卡">POS刷卡</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="收款金额" name="amount">
            <InputNumber v-model:value="formState.amount" class="w-full" :min="0" />
          </Form.Item>
          <Form.Item label="发票金额" name="invoiceAmount">
            <InputNumber v-model:value="formState.invoiceAmount" class="w-full" :min="0" />
          </Form.Item>
          <Form.Item label="发票号码" name="invoiceNo">
            <Input v-model:value="formState.invoiceNo" placeholder="请输入发票号码">
              <template #addonAfter>
                <Button type="link" size="small" @click="openInvoicePicker">选择发票</Button>
              </template>
            </Input>
          </Form.Item>
          <Form.Item label="发票类型" name="invoiceType">
            <Select v-model:value="formState.invoiceType">
              <Select.Option value="电子票据">电子票据</Select.Option>
              <Select.Option value="增值税电子普通发票">增值税电子普通发票</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="开户行" name="bankName">
            <Input v-model:value="formState.bankName" placeholder="请输入开户行" />
          </Form.Item>
          <Form.Item label="银行账户" name="bankAccount">
            <Input v-model:value="formState.bankAccount" placeholder="请输入银行账户" />
          </Form.Item>
          <Form.Item label="往来单位类型" name="contactType">
            <Select v-model:value="formState.contactType">
              <Select.Option value="往来单位">往来单位</Select.Option>
              <Select.Option value="个人">个人</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="补录" name="isSupplement">
            <Radio.Group v-model:value="formState.isSupplement">
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select v-model:value="formState.status">
              <Select.Option value="0">草稿</Select.Option>
              <Select.Option value="1">已提交</Select.Option>
              <Select.Option value="2">已完成</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <Form.Item label="附件文件名" name="fileName">
          <Input v-model:value="formState.fileName" placeholder="可填写附件文件名" />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea v-model:value="formState.remark" :rows="3" placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>

    <Modal
      v-model:open="invoicePickerOpen"
      title="选择发票"
      :footer="null"
      width="900px"
      destroy-on-close
    >
      <Table
        :columns="invoiceColumns"
        :data-source="invoiceDataSource"
        :loading="invoicePickerLoading"
        row-key="id"
        bordered
        size="small"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'amount'">
            {{ formatMoney(record.amount) }}
          </template>
          <template v-if="column.key === 'action'">
            <Button type="link" size="small" @click="applyInvoice(record)">选择</Button>
          </template>
        </template>
      </Table>
    </Modal>
  </Page>
</template>
