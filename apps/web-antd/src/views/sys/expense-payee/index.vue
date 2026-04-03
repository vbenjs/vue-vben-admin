<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Table,
  Tag,
} from 'ant-design-vue';

import { expensePayeeApi } from '#/api/core/sys-manage';

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
  bankAccount: '',
  bankName: '',
  isEnabled: undefined as string | undefined,
  status: undefined as string | undefined,
});
const pageDescription = computed(() => {
  const parts = [];
  if (contextInfo.value.tenantName)
    parts.push(`当前账套：${contextInfo.value.tenantName}`);
  if (contextInfo.value.fiscalYear)
    parts.push(`默认年度：${contextInfo.value.fiscalYear}年度`);
  return parts.join(' · ') || '收款人业务示例，已接入年度上下文过滤。';
});
const columns = [
  { title: '收款人', dataIndex: 'payeeName', key: 'payeeName', width: 180 },
  {
    title: '银行账号',
    dataIndex: 'bankAccount',
    key: 'bankAccount',
    width: 180,
  },
  { title: '开户行', dataIndex: 'bankName', key: 'bankName', width: 180 },
  {
    title: '账户类型',
    dataIndex: 'accountType',
    key: 'accountType',
    width: 120,
  },
  {
    title: '所属部门/预算单位',
    dataIndex: 'budgetUnit',
    key: 'budgetUnit',
    width: 180,
  },
  { title: '启用', dataIndex: 'isEnabled', key: 'isEnabled', width: 90 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
  { title: '操作', key: 'action', width: 130 },
];
const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const defaultForm = () => ({
  payeeName: '',
  bankAccount: '',
  bankName: '',
  accountType: '',
  budgetUnit: '',
  isEnabled: '1',
  status: '0',
  remark: '',
});
const formState = ref<any>(defaultForm());
const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await expensePayeeApi.getList({
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
  formState.value = record?.id
    ? await expensePayeeApi.getById(record.id)
    : defaultForm();
  isModalVisible.value = true;
};
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.id) {
      await expensePayeeApi.update(formState.value.id, formState.value);
      message.success('更新收款人成功');
    } else {
      await expensePayeeApi.create(formState.value);
      message.success('新增收款人成功');
    }
    isModalVisible.value = false;
    fetchList(1);
  } finally {
    submitting.value = false;
  }
};
const handleDelete = async (id: string) => {
  await expensePayeeApi.remove(id);
  message.success('删除收款人成功');
  fetchList(1);
};
const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';
onMounted(() => fetchList());
</script>
<template>
  <Page title="收款人维护" :description="pageDescription">
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
            placeholder="收款人"
            style="width: 180px"
          />
          <Input
            v-model:value="searchParams.bankAccount"
            placeholder="银行账号"
            style="width: 180px"
          />
          <Input
            v-model:value="searchParams.bankName"
            placeholder="开户行"
            style="width: 180px"
          />
          <Select
            v-model:value="searchParams.isEnabled"
            placeholder="启用"
            allow-clear
            style="width: 120px"
          >
            <Select.Option value="1">启用</Select.Option>
            <Select.Option value="0">停用</Select.Option>
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
                searchParams.bankAccount = '';
                searchParams.bankName = '';
                searchParams.isEnabled = undefined;
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
          :scroll="{ x: 1460 }"
          @change="(pag) => fetchList(pag.current)"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'isEnabled'">
              <Tag :color="record.isEnabled === '1' ? 'success' : 'default'">
                {{ record.isEnabled === '1' ? '启用' : '停用' }}
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
              <Popconfirm title="确定删除吗？" @confirm="handleDelete(record.id)">
                <Button type="link" danger size="small"> 删除 </Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
    </div>
    <Modal
      v-model:open="isModalVisible"
      :title="formState.id ? '编辑收款人' : '新增收款人'"
      @ok="handleSubmit"
      :confirm-loading="submitting"
      destroy-on-close
      width="720px"
    >
      <Form ref="formRef" :model="formState" layout="vertical" class="mt-4">
        <div class="grid grid-cols-2 gap-4">
          <Form.Item
            label="收款人"
            name="payeeName"
            :rules="[{ required: true, message: '请输入收款人' }]"
          >
            <Input v-model:value="formState.payeeName" placeholder="请输入收款人" />
          </Form.Item>
          <Form.Item label="银行账号" name="bankAccount">
            <Input
              v-model:value="formState.bankAccount"
              placeholder="请输入银行账号"
            />
          </Form.Item>
          <Form.Item label="开户行" name="bankName">
            <Input v-model:value="formState.bankName" placeholder="请输入开户行" />
          </Form.Item>
          <Form.Item label="账户类型" name="accountType">
            <Input v-model:value="formState.accountType" placeholder="如：对公" />
          </Form.Item>
          <Form.Item label="所属部门/预算单位" name="budgetUnit">
            <Input
              v-model:value="formState.budgetUnit"
              placeholder="请输入所属部门或预算单位"
            />
          </Form.Item>
          <Form.Item label="启用" name="isEnabled">
            <Radio.Group v-model:value="formState.isEnabled">
              <Radio value="1">启用</Radio>
              <Radio value="0">停用</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Radio.Group v-model:value="formState.status">
              <Radio value="0">正常</Radio>
              <Radio value="1">停用</Radio>
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
