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
  message,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Table,
  Tag,
} from 'ant-design-vue';

import { sysApprovalProcessApi, sysFormDesignApi } from '#/api/core/sys-manage';

const router = useRouter();

const loading = ref(false);
const batchLoading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 20, total: 0 });
const selectedRowKeys = ref([]);
const searchParams = ref({ formName: '', status: undefined });
const processOptions = ref([]);

const columns = [
  { title: '表单名称', dataIndex: 'formName', key: 'formName', width: 220 },
  { title: '表单类型', dataIndex: 'formType', key: 'formType', width: 110 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  {
    title: '内容长度',
    dataIndex: 'formContent',
    key: 'formContent',
    width: 100,
  },
  {
    title: '关联流程数',
    dataIndex: 'processCount',
    key: 'processCount',
    width: 110,
  },
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
const customCount = computed(
  () => dataSource.value.filter((item) => item.formType === '1').length,
);

const formatDate = (value) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';

const fetchProcessOptions = async () => {
  const res = await sysApprovalProcessApi
    .getList({ page: 1, pageSize: 500 })
    .catch(() => ({ items: [] }));
  processOptions.value = res?.items || [];
};

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const [forms, processes] = await Promise.all([
      sysFormDesignApi.getList({
        page,
        pageSize: pagination.value.pageSize,
        ...searchParams.value,
      }),
      sysApprovalProcessApi
        .getList({ page: 1, pageSize: 500 })
        .catch(() => ({ items: [] })),
    ]);
    const processItems = processes?.items || [];
    dataSource.value = (forms?.items || []).map((item) => ({
      ...item,
      processCount: processItems.filter(
        (process) => `${process.formId || ''}` === `${item.formId}`,
      ).length,
    }));
    pagination.value.current = page;
    pagination.value.total = forms?.total || 0;
  } finally {
    loading.value = false;
  }
};

const resetFilters = async () => {
  searchParams.value = { formName: '', status: undefined };
  selectedRowKeys.value = [];
  await fetchList(1);
};

const clearSelection = () => {
  selectedRowKeys.value = [];
};

const getSelectedRecords = () =>
  dataSource.value.filter((item) =>
    selectedRowKeys.value.some((key) => `${key}` === `${item.formId}`),
  );

const handleBatchStatus = async (status) => {
  const records = getSelectedRecords();
  if (records.length === 0) {
    message.warning('请先选择表单');
    return;
  }
  batchLoading.value = true;
  try {
    for (const record of records) {
      await sysFormDesignApi.update(record.formId, { ...record, status });
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
    message.warning('请先选择表单');
    return;
  }
  Modal.confirm({
    title: '确定删除选中的表单吗？',
    content: `共 ${records.length} 个表单，删除后不可恢复。`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { danger: true },
    centered: true,
    onOk: async () => {
      batchLoading.value = true;
      try {
        for (const record of records) {
          await sysFormDesignApi.remove(record.formId);
        }
        message.success(`已删除${records.length}个表单`);
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
  formName: '',
  formType: '0',
  formContent: '',
  status: '0',
  remark: '',
});

const openModal = (record) => {
  formState.value = record
    ? { ...record }
    : { formName: '', formType: '0', formContent: '', status: '0', remark: '' };
  isModalVisible.value = true;
};

const handleOk = async () => {
  try {
    await formRef.value?.validate();
    isSubmitLoading.value = true;
    if (formState.value.formId) {
      await sysFormDesignApi.update(formState.value.formId, formState.value);
      message.success('表单更新成功');
    } else {
      await sysFormDesignApi.create(formState.value);
      message.success('表单新增成功');
    }
    isModalVisible.value = false;
    await fetchList(pagination.value.current);
  } finally {
    isSubmitLoading.value = false;
  }
};

const handleDelete = async (id) => {
  await sysFormDesignApi.remove(id);
  message.success('删除成功');
  await fetchList(pagination.value.current);
};

onMounted(async () => {
  await Promise.all([fetchProcessOptions(), fetchList(1)]);
});
</script>

<template>
  <Page>
    <div class="p-4">

      <Card :bordered="false">
        <div class="mb-4 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.formName"
            placeholder="表单名称"
            class="w-40"
            allow-clear
          />
          <Select
            v-model:value="searchParams.status"
            placeholder="状态"
            class="w-28"
            allow-clear
          >
            <Select.Option value="0">启用</Select.Option>
            <Select.Option value="1">停用</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button @click="resetFilters">重置</Button>
          <Button type="primary" class="ml-auto" @click="openModal()">
            + 新建表单
          </Button>
        </div>

        <div
          class="mb-3 flex flex-wrap items-center gap-3 rounded bg-gray-50 px-3 py-2 text-sm text-gray-600"
        >
          <span>已选 {{ selectedCount }} 个表单</span>
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
          row-key="formId"
          bordered
          size="middle"
          :scroll="{ x: 1180 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'formType'">
              <Tag color="processing">
                {{ record.formType === '0' ? '内置' : '自定义' }}
              </Tag>
            </template>
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '启用' : '停用' }}
              </Tag>
            </template>
            <template v-if="column.key === 'formContent'">
              {{ record.formContent?.length || 0 }}
            </template>
            <template v-if="column.key === 'createTime'">
              {{ formatDate(record.createTime) }}
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openModal(record)">
                编辑配置
              </Button>
              <Button
                type="link"
                size="small"
                @click="router.push('/approval/flow-config')"
              >
                关联流程
              </Button>
              <Popconfirm
                title="确定删除该表单吗？"
                @confirm="handleDelete(record.formId)"
              >
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>

      <Modal
        v-model:open="isModalVisible"
        :title="formState.formId ? '编辑表单' : '新建表单'"
        @ok="handleOk"
        :confirm-loading="isSubmitLoading"
        destroy-on-close
        width="760px"
      >
        <Form
          ref="formRef"
          :model="formState"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
          class="mt-4"
        >
          <Form.Item
            label="表单名称"
            name="formName"
            :rules="[{ required: true, message: '请输入表单名称' }]"
          >
            <Input
              v-model:value="formState.formName"
              placeholder="请输入表单名称"
            />
          </Form.Item>
          <Form.Item label="表单类型" name="formType">
            <Radio.Group v-model:value="formState.formType">
              <Radio value="0">内置</Radio><Radio value="1">自定义</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="表单内容" name="formContent">
            <Input.TextArea
              v-model:value="formState.formContent"
              :rows="10"
              placeholder="可填写 JSON Schema / 表单设计稿内容"
            />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Radio.Group v-model:value="formState.status">
              <Radio value="0">启用</Radio><Radio value="1">停用</Radio>
            </Radio.Group>
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
