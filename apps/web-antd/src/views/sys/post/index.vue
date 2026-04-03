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
} from 'ant-design-vue';

import { sysConfigApi, sysPostApi } from '#/api/core/sys-manage';
import StatusTag from '#/components/StatusTag/index.vue';
import { useCrudTable } from '#/composables/useCrudTable';

const router = useRouter();

/**
 * 使用 useCrudTable 替代手动 CRUD 状态管理
 * 自动获得: loading, dataSource, pagination, formState, isModalVisible,
 *           submitting, formRef, openModal, handleSubmit, handleDelete 等
 */
const {
  loading,
  dataSource,
  pagination,
  isModalVisible,
  submitting,
  formRef,
  formState,
  fetchList,
  openModal,
  handleSubmit,
  handleDelete,
} = useCrudTable({
  api: sysPostApi,
  rowKey: 'postId',
  defaultFormState: {
    postName: '',
    postCode: '',
    postSort: 0,
    status: '0',
    remark: '',
  },
  messages: {
    createSuccess: '岗位新增成功',
    updateSuccess: '岗位更新成功',
    deleteSuccess: '岗位删除成功',
  },
});

// ========== 页面特有逻辑（非 CRUD 通用部分） ==========
const batchLoading = ref(false);
const selectedRowKeys = ref<Array<number | string>>([]);
const quickFilter = ref<'all' | 'disabled' | 'enabled'>('all');
const searchParams = ref<{
  postCode: string;
  postName: string;
  status?: string;
}>({
  postCode: '',
  postName: '',
  status: undefined,
});
const orgConfig = ref<any>({});

const columns = [
  { title: '岗位名称', dataIndex: 'postName', key: 'postName', width: 180 },
  { title: '岗位编码', dataIndex: 'postCode', key: 'postCode', width: 160 },
  { title: '排序', dataIndex: 'postSort', key: 'postSort', width: 90 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
  { title: '创建人', dataIndex: 'createBy', key: 'createBy', width: 120 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
  { title: '操作', key: 'action', width: 180 },
];

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  preserveSelectedRowKeys: true,
  onChange: (keys: Array<number | string>) => {
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
const maxSort = computed(() =>
  dataSource.value.reduce(
    (max, item) => Math.max(max, Number(item.postSort || 0)),
    0,
  ),
);

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';

const clearSelection = () => {
  selectedRowKeys.value = [];
};

const fetchOrgConfig = async () => {
  orgConfig.value = await sysConfigApi.getGroup('org').catch(() => ({}));
};

/** 使用 useCrudTable.fetchList 并注入搜索参数 */
const doFetch = async (page = 1) => {
  await fetchList(page, searchParams.value);
};

const getSelectedRecords = () =>
  dataSource.value.filter((item) =>
    selectedRowKeys.value.some((key) => `${key}` === `${item.postId}`),
  );

const handleBatchStatus = async (status: '0' | '1') => {
  const selectedRecords = getSelectedRecords();
  if (selectedRecords.length === 0) {
    message.warning('请先选择岗位');
    return;
  }
  batchLoading.value = true;
  try {
    let changedCount = 0;
    for (const record of selectedRecords) {
      if (record.status === status) continue;
      await sysPostApi.update(record.postId, {
        ...record,
        postSort: Number(record.postSort || 0),
        status,
      });
      changedCount += 1;
    }
    message.success(
      changedCount > 0 ? `已处理${changedCount}个岗位` : '所选岗位状态无需调整',
    );
    clearSelection();
    await doFetch(pagination.value.current);
  } catch (error: any) {
    message.error(error?.message || '批量更新失败');
  } finally {
    batchLoading.value = false;
  }
};

const handleBatchDelete = () => {
  const selectedRecords = getSelectedRecords();
  if (selectedRecords.length === 0) {
    message.warning('请先选择岗位');
    return;
  }
  Modal.confirm({
    title: '确定删除选中的岗位吗？',
    content: `共 ${selectedRecords.length} 个岗位，删除后不可恢复。`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { danger: true },
    centered: true,
    onOk: async () => {
      batchLoading.value = true;
      try {
        for (const record of selectedRecords) {
          await sysPostApi.remove(record.postId);
        }
        message.success(`已删除${selectedRecords.length}个岗位`);
        clearSelection();
        await doFetch(pagination.value.current);
      } catch (error: any) {
        message.error(error?.message || '批量删除失败');
        throw error;
      } finally {
        batchLoading.value = false;
      }
    },
  });
};

const applyQuickFilter = async (mode: 'all' | 'disabled' | 'enabled') => {
  quickFilter.value = mode;
  searchParams.value.status =
    mode === 'all' ? undefined : mode === 'enabled' ? '0' : '1';
  clearSelection();
  await doFetch(1);
};

const resetFilters = async () => {
  quickFilter.value = 'all';
  searchParams.value.postCode = '';
  searchParams.value.postName = '';
  searchParams.value.status = undefined;
  clearSelection();
  await doFetch(1);
};

onMounted(async () => {
  await Promise.all([fetchOrgConfig(), doFetch(1)]);
});
</script>

<template>
  <Page>
    <div class="p-4">


      <Card :bordered="false">
        <div class="mb-4 flex flex-wrap gap-3">
          <Button
            :type="quickFilter === 'all' ? 'primary' : 'default'"
            @click="applyQuickFilter('all')"
          >
            全部岗位
          </Button>
          <Button
            :type="quickFilter === 'enabled' ? 'primary' : 'default'"
            @click="applyQuickFilter('enabled')"
          >
            仅启用
          </Button>
          <Button
            :type="quickFilter === 'disabled' ? 'primary' : 'default'"
            @click="applyQuickFilter('disabled')"
          >
            仅停用
          </Button>
          <Input
            v-model:value="searchParams.postCode"
            placeholder="岗位编码"
            class="w-40"
            allow-clear
          />
          <Input
            v-model:value="searchParams.postName"
            placeholder="岗位名称"
            class="w-44"
            allow-clear
          />
          <Select
            v-model:value="searchParams.status"
            placeholder="状态"
            class="w-28"
            allow-clear
          >
            <Select.Option value="0">正常</Select.Option>
            <Select.Option value="1">停用</Select.Option>
          </Select>
          <Button type="primary" @click="doFetch(1)">查询</Button>
          <Button @click="resetFilters">重置</Button>
          <Button type="primary" class="ml-auto" @click="openModal()">
            + 新增岗位
          </Button>
        </div>

        <div
          class="mb-3 flex flex-wrap items-center gap-3 rounded bg-gray-50 px-3 py-2 text-sm text-gray-600"
        >
          <span>已选 {{ selectedCount }} 个岗位</span>
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
          @change="(pag) => doFetch(pag.current || 1)"
          row-key="postId"
          bordered
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <StatusTag :status="record.status" />
            </template>
            <template v-if="column.key === 'createTime'">
              {{ formatDate(record.createTime) }}
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openModal(record)">
                编辑
              </Button>
              <Popconfirm
                title="确定删除该岗位吗？"
                @confirm="handleDelete(record.postId)"
              >
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>

      <Modal
        v-model:open="isModalVisible"
        :title="formState.postId ? '编辑岗位' : '新增岗位'"
        @ok="handleSubmit"
        :confirm-loading="submitting"
        destroy-on-close
        width="560px"
      >
        <Form
          ref="formRef"
          :model="formState"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
          class="mt-4"
        >
          <Form.Item
            label="岗位名称"
            name="postName"
            :rules="[{ required: true, message: '请输入岗位名称' }]"
          >
            <Input
              v-model:value="formState.postName"
              placeholder="请输入岗位名称"
            />
          </Form.Item>
          <Form.Item
            label="岗位编码"
            name="postCode"
            :rules="[{ required: true, message: '请输入岗位编码' }]"
          >
            <Input
              v-model:value="formState.postCode"
              placeholder="请输入岗位编码"
            />
          </Form.Item>
          <Form.Item label="显示排序" name="postSort">
            <InputNumber
              v-model:value="formState.postSort"
              class="w-full"
              :min="0"
            />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Radio.Group v-model:value="formState.status">
              <Radio value="0">正常</Radio><Radio value="1">停用</Radio>
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
