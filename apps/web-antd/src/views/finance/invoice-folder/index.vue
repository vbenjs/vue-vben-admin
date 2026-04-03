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
  Select,
  Table,
  Tag,
} from 'ant-design-vue';

import { invoiceFolderApi } from '#/api/core/finance';

const loading = ref(false);
const dataSource = ref<any[]>([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const searchParams = ref({
  keyword: '',
  folderName: '',
  invoiceType: undefined as string | undefined,
  useStatus: undefined as string | undefined,
  verifierStatus: undefined as string | undefined,
});
const defaultForm = () => ({
  amount: 0,
  applicant: '',
  billNo: '',
  code: '',
  fileName: '',
  folderName: '默认发票夹',
  invoiceNo: '',
  invoiceType: '增值税电子普通发票',
  remark: '',
  sourceType: '手工录入',
  status: '0',
  title: '',
  useStatus: '0',
  userName: '',
  verifierStatus: '0',
});
const formState = ref<any>(defaultForm());

const columns = [
  { title: '发票夹', dataIndex: 'folderName', key: 'folderName', width: 120 },
  { title: '发票号码', dataIndex: 'invoiceNo', key: 'invoiceNo', width: 160 },
  { title: '文件名称', dataIndex: 'fileName', key: 'fileName', width: 220 },
  { title: '发票类型', dataIndex: 'invoiceType', key: 'invoiceType', width: 180 },
  { title: '金额', dataIndex: 'amount', key: 'amount', width: 120 },
  { title: '票据状态', dataIndex: 'useStatus', key: 'useStatus', width: 100 },
  { title: '核验状态', dataIndex: 'verifierStatus', key: 'verifierStatus', width: 100 },
  { title: '使用人', dataIndex: 'userName', key: 'userName', width: 120 },
  { title: '上传时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 180 },
];

const useStatusMap: Record<string, { color: string; text: string }> = {
  '0': { color: 'default', text: '未报销' },
  '1': { color: 'processing', text: '已关联' },
  '2': { color: 'success', text: '已使用' },
};

const verifierStatusMap: Record<string, { color: string; text: string }> = {
  '0': { color: 'default', text: '未核验' },
  '1': { color: 'success', text: '已核验' },
  '2': { color: 'error', text: '核验异常' },
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
    const res = await invoiceFolderApi.getList({
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
  formState.value = record?.id ? await invoiceFolderApi.getById(record.id) : defaultForm();
  isModalVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.id) {
      await invoiceFolderApi.update(formState.value.id, formState.value);
      message.success('更新发票成功');
    } else {
      await invoiceFolderApi.create(formState.value);
      message.success('新增发票成功');
    }
    isModalVisible.value = false;
    fetchList(1);
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id: string) => {
  await invoiceFolderApi.remove(id);
  message.success('删除发票成功');
  fetchList(1);
};

const showPlaceholder = (text: string) => {
  message.info(`${text}已接入入口，本轮先保留为占位能力`);
};

onMounted(() => fetchList());
</script>

<template>
  <Page title="发票夹" description="集中维护电子发票、票据状态与使用人信息。">
    <div class="space-y-4">
      <Card>
        <div class="mb-4 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.keyword"
            placeholder="发票号码/文件名称/使用人"
            style="width: 240px"
          />
          <Input
            v-model:value="searchParams.folderName"
            placeholder="发票夹名称"
            style="width: 160px"
          />
          <Select
            v-model:value="searchParams.invoiceType"
            placeholder="发票类型"
            allow-clear
            style="width: 180px"
          >
            <Select.Option value="增值税电子普通发票">增值税电子普通发票</Select.Option>
            <Select.Option value="增值税专用发票">增值税专用发票</Select.Option>
            <Select.Option value="电子票据">电子票据</Select.Option>
          </Select>
          <Select
            v-model:value="searchParams.useStatus"
            placeholder="票据状态"
            allow-clear
            style="width: 120px"
          >
            <Select.Option value="0">未报销</Select.Option>
            <Select.Option value="1">已关联</Select.Option>
            <Select.Option value="2">已使用</Select.Option>
          </Select>
          <Select
            v-model:value="searchParams.verifierStatus"
            placeholder="核验状态"
            allow-clear
            style="width: 120px"
          >
            <Select.Option value="0">未核验</Select.Option>
            <Select.Option value="1">已核验</Select.Option>
            <Select.Option value="2">核验异常</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button
            @click="
              () => {
                searchParams.keyword = '';
                searchParams.folderName = '';
                searchParams.invoiceType = undefined;
                searchParams.useStatus = undefined;
                searchParams.verifierStatus = undefined;
                fetchList(1);
              }
            "
          >
            重置
          </Button>
          <Button type="primary" @click="openModal()">新增发票</Button>
          <Button @click="showPlaceholder('识别发票')">识别发票</Button>
          <Button @click="showPlaceholder('文件授权')">文件授权</Button>
          <Button @click="showPlaceholder('发票还原')">发票还原</Button>
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
            <template v-if="column.key === 'useStatus'">
              <Tag :color="useStatusMap[record.useStatus]?.color || 'default'">
                {{ useStatusMap[record.useStatus]?.text || '-' }}
              </Tag>
            </template>
            <template v-if="column.key === 'verifierStatus'">
              <Tag :color="verifierStatusMap[record.verifierStatus]?.color || 'default'">
                {{ verifierStatusMap[record.verifierStatus]?.text || '-' }}
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
      :title="formState.id ? '编辑发票' : '新增发票'"
      @ok="handleSubmit"
      :confirm-loading="submitting"
      destroy-on-close
      width="900px"
    >
      <Form ref="formRef" :model="formState" layout="vertical" class="mt-4">
        <div class="grid grid-cols-3 gap-4">
          <Form.Item label="发票夹" name="folderName">
            <Input v-model:value="formState.folderName" placeholder="请输入发票夹名称" />
          </Form.Item>
          <Form.Item
            label="发票号码"
            name="invoiceNo"
            :rules="[{ required: true, message: '请输入发票号码' }]"
          >
            <Input v-model:value="formState.invoiceNo" placeholder="请输入发票号码" />
          </Form.Item>
          <Form.Item label="发票代码" name="code">
            <Input v-model:value="formState.code" placeholder="请输入发票代码" />
          </Form.Item>
          <Form.Item label="文件名称" name="fileName">
            <Input v-model:value="formState.fileName" placeholder="请输入文件名称" />
          </Form.Item>
          <Form.Item label="发票类型" name="invoiceType">
            <Select v-model:value="formState.invoiceType" placeholder="请选择发票类型">
              <Select.Option value="增值税电子普通发票">增值税电子普通发票</Select.Option>
              <Select.Option value="增值税专用发票">增值税专用发票</Select.Option>
              <Select.Option value="电子票据">电子票据</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="来源方式" name="sourceType">
            <Select v-model:value="formState.sourceType" placeholder="请选择来源方式">
              <Select.Option value="手工录入">手工录入</Select.Option>
              <Select.Option value="OCR识别">OCR识别</Select.Option>
              <Select.Option value="接口导入">接口导入</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="金额" name="amount">
            <InputNumber v-model:value="formState.amount" class="w-full" :min="0" />
          </Form.Item>
          <Form.Item label="票据状态" name="useStatus">
            <Select v-model:value="formState.useStatus">
              <Select.Option value="0">未报销</Select.Option>
              <Select.Option value="1">已关联</Select.Option>
              <Select.Option value="2">已使用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="核验状态" name="verifierStatus">
            <Select v-model:value="formState.verifierStatus">
              <Select.Option value="0">未核验</Select.Option>
              <Select.Option value="1">已核验</Select.Option>
              <Select.Option value="2">核验异常</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="使用人" name="userName">
            <Input v-model:value="formState.userName" placeholder="请输入使用人" />
          </Form.Item>
          <Form.Item label="申请人" name="applicant">
            <Input v-model:value="formState.applicant" placeholder="请输入申请人" />
          </Form.Item>
          <Form.Item label="关联单号" name="billNo">
            <Input v-model:value="formState.billNo" placeholder="可关联报账单号" />
          </Form.Item>
        </div>
        <Form.Item label="标题" name="title">
          <Input v-model:value="formState.title" placeholder="请输入标题" />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea v-model:value="formState.remark" :rows="3" placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  </Page>
</template>
