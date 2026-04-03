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

import { engineeringProjectApi } from '#/api/core/sys-manage';

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
  projectCode: '',
  projectName: '',
  projectStatus: undefined,
  status: undefined,
});
const pageDescription = computed(() => {
  const parts = [];
  if (contextInfo.value.tenantName)
    parts.push(`当前账套：${contextInfo.value.tenantName}`);
  if (contextInfo.value.fiscalYear)
    parts.push(`默认年度：${contextInfo.value.fiscalYear}年度`);
  return parts.join(' · ') || '工程台账业务示例，已接入年度上下文过滤。';
});
const columns = [
  {
    title: '工程编号',
    dataIndex: 'projectCode',
    key: 'projectCode',
    width: 140,
  },
  {
    title: '工程名称',
    dataIndex: 'projectName',
    key: 'projectName',
    width: 180,
  },
  {
    title: '工程类型',
    dataIndex: 'projectType',
    key: 'projectType',
    width: 120,
  },
  {
    title: '工程状态',
    dataIndex: 'projectStatus',
    key: 'projectStatus',
    width: 100,
  },
  {
    title: '总投资',
    dataIndex: 'totalInvestment',
    key: 'totalInvestment',
    width: 120,
  },
  { title: '开工日期', dataIndex: 'startDate', key: 'startDate', width: 140 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
  { title: '操作', key: 'action', width: 130 },
];
const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const defaultForm = () => ({
  projectCode: '',
  projectName: '',
  projectType: '',
  projectStatus: '0',
  totalInvestment: 0,
  startDate: `${userStore.userInfo?.fiscalYear || new Date().getFullYear()}-01-01`,
  projectManager: '',
  status: '0',
  remark: '',
});
const formState = ref<any>(defaultForm());
const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await engineeringProjectApi.getList({
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
    ? await engineeringProjectApi.getById(record.id)
    : defaultForm();
  formState.value = {
    ...detail,
    startDate: detail?.startDate
      ? new Date(detail.startDate).toISOString().slice(0, 10)
      : defaultForm().startDate,
  };
  isModalVisible.value = true;
};
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.id) {
      await engineeringProjectApi.update(formState.value.id, formState.value);
      message.success('更新工程台账成功');
    } else {
      await engineeringProjectApi.create(formState.value);
      message.success('新增工程台账成功');
    }
    isModalVisible.value = false;
    fetchList(1);
  } finally {
    submitting.value = false;
  }
};
const handleDelete = async (id: string) => {
  await engineeringProjectApi.remove(id);
  message.success('删除工程台账成功');
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
            v-model:value="searchParams.projectCode"
            placeholder="工程编号"
            style="width: 180px"
          /><Input
            v-model:value="searchParams.projectName"
            placeholder="工程名称"
            style="width: 180px"
          /><Select
            v-model:value="searchParams.projectStatus"
            placeholder="工程状态"
            allow-clear
            style="width: 120px"
          >
            <Select.Option value="0">未开工</Select.Option
            ><Select.Option value="1">进行中</Select.Option> </Select
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
                searchParams.projectCode = '';
                searchParams.projectName = '';
                searchParams.projectStatus = undefined;
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
          :scroll="{ x: 1360 }"
          @change="(pag) => fetchList(pag.current)"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'totalInvestment'">
              {{ formatMoney(record.totalInvestment) }} </template
            ><template
              v-if="column.key === 'startDate' || column.key === 'createTime'"
            >
              {{ formatDate(record[column.key]) }} </template
            ><template v-if="column.key === 'projectStatus'">
              <Tag
                :color="record.projectStatus === '1' ? 'processing' : 'default'"
              >
                {{ record.projectStatus === '1' ? '进行中' : '未开工' }}
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
      :title="formState.id ? '编辑工程台账' : '新增工程台账'"
      @ok="handleSubmit"
      :confirm-loading="submitting"
      destroy-on-close
      width="760px"
    >
      <Form ref="formRef" :model="formState" layout="vertical" class="mt-4">
        <div class="grid grid-cols-2 gap-4">
          <Form.Item label="工程编号" name="projectCode">
            <Input
              v-model:value="formState.projectCode"
              placeholder="请输入工程编号"
            /> </Form.Item
          ><Form.Item
            label="工程名称"
            name="projectName"
            :rules="[{ required: true, message: '请输入工程名称' }]"
          >
            <Input
              v-model:value="formState.projectName"
              placeholder="请输入工程名称"
            /> </Form.Item
          ><Form.Item label="工程类型" name="projectType">
            <Input
              v-model:value="formState.projectType"
              placeholder="请输入工程类型"
            /> </Form.Item
          ><Form.Item label="工程状态" name="projectStatus">
            <Radio.Group v-model:value="formState.projectStatus">
              <Radio value="0">未开工</Radio><Radio value="1">进行中</Radio>
            </Radio.Group> </Form.Item
          ><Form.Item label="总投资" name="totalInvestment">
            <InputNumber
              v-model:value="formState.totalInvestment"
              :min="0"
              style="width: 100%"
            /> </Form.Item
          ><Form.Item
            label="开工日期"
            name="startDate"
            :rules="[{ required: true, message: '请输入开工日期' }]"
          >
            <Input
              v-model:value="formState.startDate"
              placeholder="YYYY-MM-DD"
            /> </Form.Item
          ><Form.Item label="项目负责人" name="projectManager">
            <Input
              v-model:value="formState.projectManager"
              placeholder="请输入项目负责人"
            /> </Form.Item
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
