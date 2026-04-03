<script setup lang="ts">
// @ts-nocheck
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

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

import {
  sysApprovalProcessApi,
  sysFormDesignApi,
  sysMenuApi,
} from '#/api/core/sys-manage';

const router = useRouter();

const loading = ref(false);
const batchLoading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 20, total: 0 });
const selectedRowKeys = ref([]);
const searchParams = ref({ processName: '', status: undefined });
const formOptions = ref([]);
const menuOptions = ref([]);

const columns = [
  {
    title: '流程名称',
    dataIndex: 'processName',
    key: 'processName',
    width: 180,
  },
  { title: '关联表单', dataIndex: 'formId', key: 'formId', width: 180 },
  { title: '功能菜单', dataIndex: 'menuName', key: 'menuName', width: 180 },
  { title: '业务表', dataIndex: 'bizTable', key: 'bizTable', width: 180 },
  { title: '权重', dataIndex: 'weight', key: 'weight', width: 90 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
  { title: '操作', key: 'action', width: 220 },
];

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  preserveSelectedRowKeys: true,
  onChange: (keys) => {
    selectedRowKeys.value = keys;
  },
}));

const selectedCount = computed(() => selectedRowKeys.value.length);
const enabledCount = computed(
  () => dataSource.value.filter((item) => item.status === '0').length,
);
const disabledCount = computed(
  () => dataSource.value.filter((item) => item.status === '1').length,
);

const formatDate = (value) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';
const getFormName = (formId) =>
  formOptions.value.find((item) => `${item.value}` === `${formId}`)?.label ||
  '-';

const fetchBaseOptions = async () => {
  const [forms, menus] = await Promise.all([
    sysFormDesignApi
      .getList({ page: 1, pageSize: 500 })
      .catch(() => ({ items: [] })),
    sysMenuApi.getList().catch(() => []),
  ]);
  formOptions.value = (forms?.items || []).map((item) => ({
    label: item.formName,
    value: item.formId,
  }));
  menuOptions.value = (menus || [])
    .filter((item) => item.menuType !== 'F')
    .map((item) => ({ label: item.menuName, value: item.menuName }));
};

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysApprovalProcessApi.getList({
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

const resetFilters = async () => {
  searchParams.value = { processName: '', status: undefined };
  selectedRowKeys.value = [];
  await fetchList(1);
};

const clearSelection = () => {
  selectedRowKeys.value = [];
};

const getSelectedRecords = () =>
  dataSource.value.filter((item) =>
    selectedRowKeys.value.some((key) => `${key}` === `${item.processId}`),
  );

const handleBatchStatus = async (status) => {
  const records = getSelectedRecords();
  if (records.length === 0) {
    message.warning('请先选择流程');
    return;
  }
  batchLoading.value = true;
  try {
    for (const record of records) {
      await sysApprovalProcessApi.update(record.processId, {
        ...record,
        status,
      });
    }
    message.success('批量状态更新成功');
    clearSelection();
    await fetchList(pagination.value.current);
  } finally {
    batchLoading.value = false;
  }
};

const handleBatchDelete = () => {
  const records = getSelectedRecords();
  if (records.length === 0) {
    message.warning('请先选择流程');
    return;
  }
  Modal.confirm({
    title: '确定删除选中的流程吗？',
    content: `共 ${records.length} 个流程，删除后不可恢复。`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { danger: true },
    centered: true,
    onOk: async () => {
      batchLoading.value = true;
      try {
        for (const record of records) {
          await sysApprovalProcessApi.remove(record.processId);
        }
        message.success(`已删除${records.length}个流程`);
        clearSelection();
        await fetchList(pagination.value.current);
      } finally {
        batchLoading.value = false;
      }
    },
  });
};

const isModalVisible = ref(false);
const isSubmitLoading = ref(false);
const formRef = ref();
const formState = ref({
  processName: '',
  formId: undefined,
  menuName: '',
  bizTable: '',
  weight: 0,
  flowNodes: '',
  status: '0',
  remark: '',
});

const openModal = (record) => {
  formState.value = record
    ? { ...record }
    : {
        processName: '',
        formId: undefined,
        menuName: '',
        bizTable: '',
        weight: 0,
        flowNodes: '',
        status: '0',
        remark: '',
      };
  isModalVisible.value = true;
};

const handleOk = async () => {
  try {
    await formRef.value?.validate();
    isSubmitLoading.value = true;
    const payload = {
      ...formState.value,
      weight: Number(formState.value.weight || 0),
    };
    if (formState.value.processId) {
      await sysApprovalProcessApi.update(formState.value.processId, payload);
      message.success('流程更新成功');
    } else {
      await sysApprovalProcessApi.create(payload);
      message.success('流程新增成功');
    }
    isModalVisible.value = false;
    await fetchList(pagination.value.current);
  } finally {
    isSubmitLoading.value = false;
  }
};

const handleDelete = async (id) => {
  await sysApprovalProcessApi.remove(id);
  message.success('删除成功');
  await fetchList(pagination.value.current);
};

onMounted(async () => {
  await Promise.all([fetchBaseOptions(), fetchList(1)]);
});
</script>

<template>
  <Page>
    <div class="p-4">

      <Card :bordered="false">
        <div class="mb-4 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.processName"
            placeholder="流程名称"
            class="w-40"
            allow-clear
          />
          <Select
            v-model:value="searchParams.status"
            placeholder="状态"
            class="w-28"
            allow-clear
          >
            <Select.Option value="0">启用中</Select.Option>
            <Select.Option value="1">已停用</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button @click="resetFilters">重置</Button>
          <Button type="primary" class="ml-auto" @click="openModal()">
            + 新建流程
          </Button>
        </div>

        <div
          class="mb-3 flex flex-wrap items-center gap-3 rounded bg-gray-50 px-3 py-2 text-sm text-gray-600"
        >
          <span>已选 {{ selectedCount }} 个流程</span>
          <Button
            size="small"
            :disabled="selectedCount === 0"
            :loading="batchLoading"
            @click="handleBatchStatus('0')"
          >
            批量启用
          </Button>
          <Button
            size="small"
            :disabled="selectedCount === 0"
            :loading="batchLoading"
            @click="handleBatchStatus('1')"
          >
            批量停用
          </Button>
          <Button
            size="small"
            danger
            :disabled="selectedCount === 0"
            :loading="batchLoading"
            @click="handleBatchDelete"
          >
            批量删除
          </Button>
          <Button
            type="link"
            size="small"
            class="!px-0"
            :disabled="selectedCount === 0"
            @click="clearSelection"
          >
            清空选择
          </Button>
        </div>

        <Table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="pagination"
          :row-selection="rowSelection"
          @change="(pag) => fetchList(pag.current || 1)"
          row-key="processId"
          bordered
          size="middle"
          :scroll="{ x: 1280 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'formId'">
              {{ getFormName(record.formId) }}
            </template>
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '启用中' : '已停用' }}
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
                title="确定删除该流程吗？"
                @confirm="handleDelete(record.processId)"
              >
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>

      <Modal
        v-model:open="isModalVisible"
        :title="formState.processId ? '编辑流程' : '新建流程'"
        @ok="handleOk"
        :confirm-loading="isSubmitLoading"
        destroy-on-close
        width="720px"
      >
        <Form
          ref="formRef"
          :model="formState"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
          class="mt-4"
        >
          <div class="grid grid-cols-2 gap-x-4">
            <Form.Item
              label="流程名称"
              name="processName"
              :rules="[{ required: true, message: '请输入流程名称' }]"
            >
              <Input
                v-model:value="formState.processName"
                placeholder="请输入流程名称"
              />
            </Form.Item>
            <Form.Item label="关联表单" name="formId">
              <Select
                v-model:value="formState.formId"
                :options="formOptions"
                placeholder="请选择表单"
                allow-clear
              />
            </Form.Item>
            <Form.Item label="功能菜单" name="menuName">
              <Select
                v-model:value="formState.menuName"
                :options="menuOptions"
                placeholder="请选择功能菜单"
                allow-clear
              />
            </Form.Item>
            <Form.Item label="业务表" name="bizTable">
              <Input
                v-model:value="formState.bizTable"
                placeholder="如 research_project"
              />
            </Form.Item>
            <Form.Item label="流程权重" name="weight">
              <InputNumber
                v-model:value="formState.weight"
                class="w-full"
                :min="0"
              />
            </Form.Item>
            <Form.Item label="状态" name="status">
              <Radio.Group v-model:value="formState.status">
                <Radio value="0">启用</Radio><Radio value="1">停用</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          <Form.Item label="节点配置" name="flowNodes">
            <Input.TextArea
              v-model:value="formState.flowNodes"
              :rows="6"
              placeholder='可填写 JSON，如 [{"node":"提交","assignee":"部门负责人"}]'
            />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea
              v-model:value="formState.remark"
              :rows="3"
              placeholder="请输入备注信息"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  </Page>
</template>
