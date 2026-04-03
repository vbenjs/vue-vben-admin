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

import { researchProjectApi } from '#/api/core/sys-manage';

const userStore = useUserStore();
const loading = ref(false);
const dataSource = ref<any[]>([]);
const total = ref(0);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const contextInfo = ref({
  fiscalYear: userStore.userInfo?.fiscalYear || '',
  tenantName: userStore.userInfo?.tenantName || '',
});
const searchParams = ref({
  applyYear: userStore.userInfo?.fiscalYear || '',
  flowStatus: undefined,
  projectName: '',
  projectStatus: undefined,
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
  return parts.join(' · ') || '科研项目业务示例，已接入年度上下文过滤。';
});

const columns = [
  {
    title: '项目编号',
    dataIndex: 'projectCode',
    key: 'projectCode',
    width: 140,
  },
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
  { title: '申报年度', dataIndex: 'applyYear', key: 'applyYear', width: 110 },
  {
    title: '负责人',
    dataIndex: 'projectManager',
    key: 'projectManager',
    width: 120,
  },
  { title: '流程状态', dataIndex: 'flowStatus', key: 'flowStatus', width: 100 },
  {
    title: '立项状态',
    dataIndex: 'projectStatus',
    key: 'projectStatus',
    width: 110,
  },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
  { title: '操作', key: 'action', width: 250 },
];

const historyColumns: any[] = [
  {
    title: '动作',
    dataIndex: 'approvalAction',
    key: 'approvalAction',
    width: 100,
  },
  {
    title: '审批人',
    dataIndex: 'approverName',
    key: 'approverName',
    width: 120,
  },
  {
    title: '审批部门',
    dataIndex: 'approverDeptName',
    key: 'approverDeptName',
    width: 150,
  },
  { title: '意见', dataIndex: 'approvalOpinion', key: 'approvalOpinion' },
  { title: '时间', dataIndex: 'approvalTime', key: 'approvalTime', width: 180 },
];

const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const historyOpen = ref(false);
const historyLoading = ref(false);
const historyDataSource = ref<any[]>([]);
const currentHistoryTitle = ref('');
const defaultForm = () => ({
  applyYear: userStore.userInfo?.fiscalYear || '',
  flowStatus: '0',
  projectCode: '',
  projectManager: '',
  projectName: '',
  projectSource: '',
  projectStatus: '0',
  projectType: '',
  remark: '',
  status: '0',
  totalAmount: 0,
});
const formState = ref<any>(defaultForm());

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await researchProjectApi.getList({
      page,
      pageSize: pagination.value.pageSize,
      ...searchParams.value,
    });
    dataSource.value = res?.items || [];
    total.value = res?.total || 0;
    contextInfo.value = {
      fiscalYear:
        res?.context?.fiscalYear || userStore.userInfo?.fiscalYear || '',
      tenantName:
        res?.context?.tenantName || userStore.userInfo?.tenantName || '',
    };
    pagination.value.current = page;
    pagination.value.total = total.value;
  } finally {
    loading.value = false;
  }
};

const openModal = async (record?: any) => {
  formState.value = record?.id
    ? { ...(await researchProjectApi.getById(record.id)) }
    : defaultForm();
  isModalVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.id) {
      await researchProjectApi.update(formState.value.id, formState.value);
      message.success('更新科研项目成功');
    } else {
      await researchProjectApi.create(formState.value);
      message.success('新增科研项目成功');
    }
    isModalVisible.value = false;
    fetchList(1);
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id: string) => {
  await researchProjectApi.remove(id);
  message.success('删除科研项目成功');
  fetchList(1);
};

const formatDate = (v: string) =>
  v ? new Date(v).toLocaleString('zh-CN') : '-';
const formatFlowStatus = (value: string) =>
  value === '1' ? '已提交' : '未提交';
const formatProjectStatus = (value: string) =>
  value === '1' ? '已立项' : '未立项';

const handleSubmitFlow = async (record: any) => {
  await researchProjectApi.submit(record.id);
  message.success('科研项目送审成功');
  await fetchList(pagination.value.current);
};

const handleWithdrawFlow = async (record: any) => {
  await researchProjectApi.withdraw(record.id);
  message.success('科研项目撤回成功');
  await fetchList(pagination.value.current);
};

const openHistory = async (record: any) => {
  try {
    historyLoading.value = true;
    historyOpen.value = true;
    currentHistoryTitle.value = `审核历史 - ${record.projectName || record.projectCode || ''}`;
    const history = await researchProjectApi.getHistory(record.id);
    historyDataSource.value = Array.isArray(history) ? history : [];
  } finally {
    historyLoading.value = false;
  }
};

onMounted(() => fetchList());
</script>

<template>
  <Page>
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-3 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.projectName"
            placeholder="项目名称"
            class="w-44"
            allow-clear
          />
          <Input
            v-model:value="searchParams.applyYear"
            placeholder="申报年度"
            class="w-32"
            allow-clear
          />
          <Select
            v-model:value="searchParams.flowStatus"
            placeholder="流程状态"
            class="w-32"
            allow-clear
          >
            <Select.Option value="0">未提交</Select.Option>
            <Select.Option value="1">已提交</Select.Option>
          </Select>
          <Select
            v-model:value="searchParams.projectStatus"
            placeholder="立项状态"
            class="w-32"
            allow-clear
          >
            <Select.Option value="0">未立项</Select.Option>
            <Select.Option value="1">已立项</Select.Option>
          </Select>
          <Select
            v-model:value="searchParams.status"
            placeholder="状态"
            class="w-28"
            allow-clear
          >
            <Select.Option value="0">正常</Select.Option>
            <Select.Option value="1">停用</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button
            @click="
              () => {
                searchParams.projectName = '';
                searchParams.applyYear = userStore.userInfo?.fiscalYear || '';
                searchParams.flowStatus = undefined;
                searchParams.projectStatus = undefined;
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
          @change="(pag) => fetchList(pag.current)"
          row-key="id"
          bordered
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'flowStatus'">
              <Tag
                :color="record.flowStatus === '1' ? 'processing' : 'default'"
              >
                {{ formatFlowStatus(record.flowStatus) }}
              </Tag>
            </template>
            <template v-if="column.key === 'projectStatus'">
              <Tag
                :color="record.projectStatus === '1' ? 'success' : 'processing'"
              >
                {{ formatProjectStatus(record.projectStatus) }}
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
              <Button
                v-if="record.flowStatus !== '1'"
                type="link"
                size="small"
                @click="handleSubmitFlow(record)"
              >
                送审
              </Button>
              <Button
                v-if="record.flowStatus === '1'"
                type="link"
                size="small"
                @click="handleWithdrawFlow(record)"
              >
                撤回
              </Button>
              <Button type="link" size="small" @click="openHistory(record)">
                历史
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
      :title="formState.id ? '编辑科研项目' : '新增科研项目'"
      @ok="handleSubmit"
      :confirm-loading="submitting"
      destroy-on-close
      width="680px"
    >
      <Form ref="formRef" :model="formState" layout="vertical" class="mt-4">
        <div class="grid grid-cols-2 gap-4">
          <Form.Item label="项目编号" name="projectCode">
            <Input
              v-model:value="formState.projectCode"
              placeholder="如：RP-2026-001"
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
          <Form.Item label="申报年度" name="applyYear">
            <Input v-model:value="formState.applyYear" placeholder="如：2026" />
          </Form.Item>
          <Form.Item label="负责人" name="projectManager">
            <Input
              v-model:value="formState.projectManager"
              placeholder="请输入负责人"
            />
          </Form.Item>
          <Form.Item label="项目类型" name="projectType">
            <Input
              v-model:value="formState.projectType"
              placeholder="如：科研课题"
            />
          </Form.Item>
          <Form.Item label="项目来源" name="projectSource">
            <Input
              v-model:value="formState.projectSource"
              placeholder="如：省自然基金"
            />
          </Form.Item>
          <Form.Item label="总金额" name="totalAmount">
            <InputNumber
              v-model:value="formState.totalAmount"
              :min="0"
              style="width: 100%"
            />
          </Form.Item>
          <Form.Item label="流程状态" name="flowStatus">
            <Radio.Group v-model:value="formState.flowStatus" disabled>
              <Radio value="0">未提交</Radio>
              <Radio value="1">已提交</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="立项状态" name="projectStatus">
            <Radio.Group v-model:value="formState.projectStatus">
              <Radio value="0">未立项</Radio>
              <Radio value="1">已立项</Radio>
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

    <Modal
      v-model:open="historyOpen"
      :title="currentHistoryTitle"
      :footer="null"
      width="980px"
      destroy-on-close
    >
      <Table
        :columns="historyColumns"
        :data-source="historyDataSource"
        :loading="historyLoading"
        row-key="id"
        bordered
        size="small"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'approvalTime'">
            {{ formatDate(record.approvalTime) }}
          </template>
        </template>
      </Table>
    </Modal>
  </Page>
</template>
