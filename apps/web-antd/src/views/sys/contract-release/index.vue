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

import { contractReleaseApi } from '#/api/core/sys-manage';

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
  contractNo: '',
  contractName: '',
  releaseStatus: undefined,
  status: undefined,
});
const pageDescription = computed(() => {
  const parts = [];
  if (contextInfo.value.tenantName)
    parts.push(`当前账套：${contextInfo.value.tenantName}`);
  if (contextInfo.value.fiscalYear)
    parts.push(`默认年度：${contextInfo.value.fiscalYear}年度`);
  return parts.join(' · ') || '合同下拨业务示例，已接入年度上下文过滤。';
});
const columns = [
  { title: '合同编号', dataIndex: 'contractNo', key: 'contractNo', width: 140 },
  {
    title: '合同名称',
    dataIndex: 'contractName',
    key: 'contractName',
    width: 180,
  },
  {
    title: '下拨日期',
    dataIndex: 'releaseDate',
    key: 'releaseDate',
    width: 140,
  },
  {
    title: '可下拨金额',
    dataIndex: 'releasableAmount',
    key: 'releasableAmount',
    width: 120,
  },
  {
    title: '下拨金额',
    dataIndex: 'releaseAmount',
    key: 'releaseAmount',
    width: 120,
  },
  {
    title: '下拨状态',
    dataIndex: 'releaseStatus',
    key: 'releaseStatus',
    width: 100,
  },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
  { title: '操作', key: 'action', width: 130 },
];
const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const defaultForm = () => ({
  contractNo: '',
  contractName: '',
  releasableAmount: 0,
  releaseAmount: 0,
  releaseDate: `${userStore.userInfo?.fiscalYear || new Date().getFullYear()}-01-01`,
  releaseStatus: '0',
  status: '0',
  remark: '',
});
const formState = ref<any>(defaultForm());
const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await contractReleaseApi.getList({
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
  const detail = record?.id
    ? await contractReleaseApi.getById(record.id)
    : defaultForm();
  formState.value = {
    ...detail,
    releaseDate: detail?.releaseDate
      ? new Date(detail.releaseDate).toISOString().slice(0, 10)
      : defaultForm().releaseDate,
  };
  isModalVisible.value = true;
};
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.id) {
      await contractReleaseApi.update(formState.value.id, formState.value);
      message.success('更新合同下拨成功');
    } else {
      await contractReleaseApi.create(formState.value);
      message.success('新增合同下拨成功');
    }
    isModalVisible.value = false;
    fetchList(1);
  } finally {
    submitting.value = false;
  }
};
const handleDelete = async (id: string) => {
  await contractReleaseApi.remove(id);
  message.success('删除合同下拨成功');
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
            v-model:value="searchParams.contractNo"
            placeholder="合同编号"
            style="width: 180px"
          /><Input
            v-model:value="searchParams.contractName"
            placeholder="合同名称"
            style="width: 180px"
          /><Select
            v-model:value="searchParams.releaseStatus"
            placeholder="下拨状态"
            allow-clear
            style="width: 120px"
          >
            <Select.Option value="0">未下拨</Select.Option
            ><Select.Option value="1">已下拨</Select.Option> </Select
          ><Select
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
                searchParams.contractNo = '';
                searchParams.contractName = '';
                searchParams.releaseStatus = undefined;
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
          :scroll="{ x: 1380 }"
          @change="(pag) => fetchList(pag.current)"
        >
          <template #bodyCell="{ column, record }">
            <template
              v-if="
                column.key === 'releasableAmount' ||
                column.key === 'releaseAmount'
              "
            >
              {{ formatMoney(record[column.key]) }} </template
            ><template
              v-if="column.key === 'releaseDate' || column.key === 'createTime'"
            >
              {{ formatDate(record[column.key]) }} </template
            ><template v-if="column.key === 'releaseStatus'">
              <Tag
                :color="record.releaseStatus === '1' ? 'success' : 'processing'"
              >
                {{ record.releaseStatus === '1' ? '已下拨' : '未下拨' }}
              </Tag> </template
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
      :title="formState.id ? '编辑合同下拨' : '新增合同下拨'"
      @ok="handleSubmit"
      :confirm-loading="submitting"
      destroy-on-close
      width="760px"
    >
      <Form ref="formRef" :model="formState" layout="vertical" class="mt-4">
        <div class="grid grid-cols-2 gap-4">
          <Form.Item label="合同编号" name="contractNo">
            <Input
              v-model:value="formState.contractNo"
              placeholder="请输入合同编号"
            /> </Form.Item
          ><Form.Item
            label="合同名称"
            name="contractName"
            :rules="[{ required: true, message: '请输入合同名称' }]"
          >
            <Input
              v-model:value="formState.contractName"
              placeholder="请输入合同名称"
            /> </Form.Item
          ><Form.Item label="可下拨金额" name="releasableAmount">
            <InputNumber
              v-model:value="formState.releasableAmount"
              :min="0"
              style="width: 100%"
            /> </Form.Item
          ><Form.Item label="下拨金额" name="releaseAmount">
            <InputNumber
              v-model:value="formState.releaseAmount"
              :min="0"
              style="width: 100%"
            /> </Form.Item
          ><Form.Item
            label="下拨日期"
            name="releaseDate"
            :rules="[{ required: true, message: '请输入下拨日期' }]"
          >
            <Input
              v-model:value="formState.releaseDate"
              placeholder="YYYY-MM-DD"
            /> </Form.Item
          ><Form.Item label="下拨状态" name="releaseStatus">
            <Radio.Group v-model:value="formState.releaseStatus">
              <Radio value="0">未下拨</Radio><Radio value="1">已下拨</Radio>
            </Radio.Group> </Form.Item
          ><Form.Item label="状态" name="status">
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
