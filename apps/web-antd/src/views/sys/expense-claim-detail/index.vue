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
  Select,
  Table,
  Tag,
} from 'ant-design-vue';

import { expenseClaimDetailApi } from '#/api/core/sys-manage';

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
  usage: '',
  indicatorName: '',
  status: undefined,
});
const pageDescription = computed(() => {
  const parts = [];
  if (contextInfo.value.tenantName)
    parts.push(`当前账套：${contextInfo.value.tenantName}`);
  if (contextInfo.value.fiscalYear)
    parts.push(`默认年度：${contextInfo.value.fiscalYear}年度`);
  return parts.join(' · ') || '报销明细业务示例，已接入年度上下文过滤。';
});
const columns = [
  { title: '用途', dataIndex: 'usage', key: 'usage', width: 220 },
  {
    title: '指标名称',
    dataIndex: 'indicatorName',
    key: 'indicatorName',
    width: 180,
  },
  {
    title: '经济分类',
    dataIndex: 'econCategory',
    key: 'econCategory',
    width: 160,
  },
  {
    title: '申请金额',
    dataIndex: 'applyAmount',
    key: 'applyAmount',
    width: 120,
  },
  { title: '小计', dataIndex: 'subtotal', key: 'subtotal', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
  { title: '操作', key: 'action', width: 130 },
];
const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const defaultForm = () => ({
  usage: '',
  indicatorName: '',
  econCategory: '',
  applyAmount: 0,
  remainAmount: 0,
  subtotal: 0,
  status: '0',
  remark: '',
});
const formState = ref<any>(defaultForm());
const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await expenseClaimDetailApi.getList({
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
    ? await expenseClaimDetailApi.getById(record.id)
    : defaultForm();
  isModalVisible.value = true;
};
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.id) {
      await expenseClaimDetailApi.update(formState.value.id, formState.value);
      message.success('更新报销明细成功');
    } else {
      await expenseClaimDetailApi.create(formState.value);
      message.success('新增报销明细成功');
    }
    isModalVisible.value = false;
    fetchList(1);
  } finally {
    submitting.value = false;
  }
};
const handleDelete = async (id: string) => {
  await expenseClaimDetailApi.remove(id);
  message.success('删除报销明细成功');
  fetchList(1);
};
const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';
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
          /><Input
            v-model:value="searchParams.usage"
            placeholder="用途"
            style="width: 220px"
          /><Input
            v-model:value="searchParams.indicatorName"
            placeholder="指标名称"
            style="width: 180px"
          /><Select
            v-model:value="searchParams.status"
            placeholder="状态"
            allow-clear
            style="width: 120px"
          >
            <Select.Option value="0">正常</Select.Option
            ><Select.Option value="1">停用</Select.Option> </Select
          ><Button type="primary" @click="fetchList(1)">查询</Button
          ><Button
            @click="
              () => {
                searchParams.fiscalYear = userStore.userInfo?.fiscalYear || '';
                searchParams.usage = '';
                searchParams.indicatorName = '';
                searchParams.status = undefined;
                fetchList(1);
              }
            "
          >
            重置 </Button
          ><Button type="primary" class="ml-auto" @click="openModal()">
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
          :scroll="{ x: 1280 }"
          @change="(pag) => fetchList(pag.current)"
        >
          <template #bodyCell="{ column, record }">
            <template
              v-if="column.key === 'applyAmount' || column.key === 'subtotal'"
            >
              {{ formatMoney(record[column.key]) }} </template
            ><template v-if="column.key === 'createTime'">
              {{ formatDate(record.createTime) }} </template
            ><template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '正常' : '停用' }}
              </Tag> </template
            ><template v-if="column.key === 'action'">
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
      :title="formState.id ? '编辑报销明细' : '新增报销明细'"
      @ok="handleSubmit"
      :confirm-loading="submitting"
      destroy-on-close
      width="760px"
    >
      <Form ref="formRef" :model="formState" layout="vertical" class="mt-4">
        <div class="grid grid-cols-2 gap-4">
          <Form.Item
            label="用途"
            name="usage"
            :rules="[{ required: true, message: '请输入用途' }]"
          >
            <Input
              v-model:value="formState.usage"
              placeholder="请输入用途"
            /> </Form.Item
          ><Form.Item label="指标名称" name="indicatorName">
            <Input
              v-model:value="formState.indicatorName"
              placeholder="请输入指标名称"
            /> </Form.Item
          ><Form.Item label="经济分类" name="econCategory">
            <Input
              v-model:value="formState.econCategory"
              placeholder="请输入经济分类"
            /> </Form.Item
          ><Form.Item label="申请金额" name="applyAmount">
            <InputNumber
              v-model:value="formState.applyAmount"
              :min="0"
              style="width: 100%"
            /> </Form.Item
          ><Form.Item label="剩余额度" name="remainAmount">
            <InputNumber
              v-model:value="formState.remainAmount"
              :min="0"
              style="width: 100%"
            /> </Form.Item
          ><Form.Item label="小计" name="subtotal">
            <InputNumber
              v-model:value="formState.subtotal"
              :min="0"
              style="width: 100%"
            /> </Form.Item
          ><Form.Item label="状态" name="status">
            <Select v-model:value="formState.status">
              <Select.Option value="0">正常</Select.Option
              ><Select.Option value="1">停用</Select.Option>
            </Select>
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
