<script setup lang="ts">
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

import { sysConfigApi, sysTenantApi } from '#/api/core/sys-manage';
import StatusTag from '#/components/StatusTag/index.vue';
import { useCrudTable } from '#/composables/useCrudTable';

const router = useRouter();

const batchLoading = ref(false);
const searchParams = ref<{ status?: string; tenantName: string }>({
  tenantName: '',
  status: undefined,
});
const tenantParameterSummary = ref<any>({});
const tenantRuntimeConfig = ref<any>({});
const quickFilter = ref<'all' | 'default' | 'enabled'>('all');
const selectedRowKeys = ref<Array<number | string>>([]);

const {
  loading,
  dataSource,
  pagination,
  isModalVisible,
  submitting,
  formRef,
  formState,
  fetchList,
  handleDelete,
} = useCrudTable({
  api: sysTenantApi,
  rowKey: 'tenantId',
  defaultFormState: {
    tenantName: '',
    status: '0',
    remark: '',
  },
  messages: {
    createSuccess: '新增成功',
    updateSuccess: '更新成功',
    deleteSuccess: '删除成功',
  },
});

const columns = [
  { title: '账套名称', dataIndex: 'tenantName', key: 'tenantName' },
  { title: '账套编码', dataIndex: 'tenantId', key: 'tenantCode', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
  { title: '创建人', dataIndex: 'createBy', key: 'createBy', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  { title: '操作', key: 'action', width: 220 },
];

const clearSelection = () => {
  selectedRowKeys.value = [];
};

const isDefaultTenant = (tenantId: number | string) =>
  `${tenantRuntimeConfig.value.defaultTenantId || ''}` === `${tenantId}`;

const doFetch = async (page = 1) => {
  await fetchList(page, searchParams.value);
};

const fetchTenantParameterSummary = async () => {
  tenantParameterSummary.value = await sysConfigApi
    .getGroup('tenant')
    .catch(() => ({}));
};

const fetchTenantRuntimeConfig = async () => {
  tenantRuntimeConfig.value = await sysConfigApi
    .getGroup('tenantRuntime')
    .catch(() => ({}));
};

const defaultTenantName = computed(() => {
  const record = dataSource.value.find((item) =>
    isDefaultTenant(item.tenantId),
  );
  return record?.tenantName || '-';
});

const displayDataSource = computed(() => {
  if (quickFilter.value === 'default') {
    return dataSource.value.filter((item) => isDefaultTenant(item.tenantId));
  }
  if (quickFilter.value === 'enabled') {
    return dataSource.value.filter((item) => item.status === '0');
  }
  return dataSource.value;
});

const selectedCount = computed(() => selectedRowKeys.value.length);

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  preserveSelectedRowKeys: true,
  onChange: (keys: Array<number | string>) => {
    selectedRowKeys.value = keys;
  },
}));

const applyQuickFilter = (mode: 'all' | 'default' | 'enabled') => {
  quickFilter.value = mode;
  searchParams.value.status = mode === 'enabled' ? '0' : undefined;
  clearSelection();
  doFetch(1);
};

const resetFilters = () => {
  quickFilter.value = 'all';
  searchParams.value.tenantName = '';
  searchParams.value.status = undefined;
  clearSelection();
  doFetch(1);
};

const getSelectedRecords = () =>
  dataSource.value.filter((item) =>
    selectedRowKeys.value.some((key) => `${key}` === `${item.tenantId}`),
  );

const handleSetDefaultTenant = async (tenantId: number | string) => {
  await sysConfigApi.saveGroup('tenantRuntime', {
    defaultTenantId: String(tenantId),
  });
  await fetchTenantRuntimeConfig();
  message.success('已设为默认账套');
};

const handleToggleStatus = async (record: any) => {
  const nextStatus = record.status === '0' ? '1' : '0';
  if (nextStatus === '1' && isDefaultTenant(record.tenantId)) {
    message.warning('默认账套不能直接停用，请先切换默认账套');
    return;
  }
  await sysTenantApi.update(record.tenantId, { ...record, status: nextStatus });
  message.success(nextStatus === '0' ? '账套已启用' : '账套已停用');
  await doFetch(pagination.value.current);
};

const handleBatchStatus = async (targetStatus: '0' | '1') => {
  const selectedRecords = getSelectedRecords();
  if (selectedRecords.length === 0) {
    message.warning('请先选择账套');
    return;
  }
  if (
    targetStatus === '1' &&
    selectedRecords.some((item) => isDefaultTenant(item.tenantId))
  ) {
    message.warning('默认账套不能批量停用，请先切换默认账套');
    return;
  }

  const actionText = targetStatus === '0' ? '启用' : '停用';
  batchLoading.value = true;
  try {
    let changedCount = 0;
    for (const record of selectedRecords) {
      if (record.status === targetStatus) {
        continue;
      }
      await sysTenantApi.update(record.tenantId, {
        ...record,
        status: targetStatus,
      });
      changedCount += 1;
    }
    message.success(
      changedCount > 0
        ? `已${actionText}${changedCount}个账套`
        : '所选账套状态无需调整',
    );
    clearSelection();
    await doFetch(pagination.value.current);
  } catch (error: any) {
    message.error(error?.message || `批量${actionText}失败`);
  } finally {
    batchLoading.value = false;
  }
};

const handleBatchDelete = () => {
  const selectedRecords = getSelectedRecords();
  if (selectedRecords.length === 0) {
    message.warning('请先选择账套');
    return;
  }
  if (selectedRecords.some((item) => isDefaultTenant(item.tenantId))) {
    message.warning('默认账套不能删除，请先切换默认账套');
    return;
  }

  Modal.confirm({
    title: '确定删除选中的账套吗？',
    content: `共 ${selectedRecords.length} 个账套，删除后不可恢复。`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { danger: true },
    centered: true,
    onOk: async () => {
      batchLoading.value = true;
      try {
        for (const record of selectedRecords) {
          await sysTenantApi.remove(record.tenantId);
        }
        message.success(`已删除${selectedRecords.length}个账套`);
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

const openModalCustom = (record?: any) => {
  formState.value = record
    ? { ...record }
    : { tenantName: '', status: '0', remark: '' };
  isModalVisible.value = true;
};

const handleSubmitCustom = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.tenantId) {
      await sysTenantApi.update(formState.value.tenantId, formState.value);
      message.success('更新成功');
    } else {
      await sysTenantApi.create(formState.value);
      message.success('新增成功');
    }
    isModalVisible.value = false;
    await doFetch(pagination.value.current);
  } catch (error) {
    console.error(error);
  } finally {
    submitting.value = false;
  }
};

const handleDeleteTenant = async (id: number | string) => {
  if (isDefaultTenant(id)) {
    message.warning('默认账套不能删除，请先切换默认账套');
    return;
  }
  await handleDelete(id);
  await doFetch(pagination.value.current);
};

const formatDate = (v: string) =>
  v ? new Date(v).toLocaleString('zh-CN') : '-';

onMounted(() => {
  doFetch(1);
  fetchTenantParameterSummary();
  fetchTenantRuntimeConfig();
});
</script>

<template>
  <Page>
    <div class="p-4">

      <Card :bordered="false">
        <div class="mb-3 flex flex-wrap gap-3">
          <Button
            :type="quickFilter === 'all' ? 'primary' : 'default'"
            @click="applyQuickFilter('all')"
          >
            全部账套
          </Button>
          <Button
            :type="quickFilter === 'default' ? 'primary' : 'default'"
            @click="applyQuickFilter('default')"
          >
            默认账套
          </Button>
          <Button
            :type="quickFilter === 'enabled' ? 'primary' : 'default'"
            @click="applyQuickFilter('enabled')"
          >
            仅启用
          </Button>
          <Input
            v-model:value="searchParams.tenantName"
            placeholder="账套名称"
            class="w-40"
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
          <Button type="primary" class="ml-auto" @click="openModalCustom()">
            + 新增
          </Button>
        </div>

        <div
          class="mb-3 flex flex-wrap items-center gap-3 rounded bg-gray-50 px-3 py-2 text-sm text-gray-600"
        >
          <span>已选 {{ selectedCount }} 个账套</span>
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
          :data-source="displayDataSource"
          :loading="loading"
          :pagination="quickFilter === 'default' ? false : pagination"
          :row-selection="rowSelection"
          @change="(pag) => doFetch(pag.current || 1)"
          row-key="tenantId"
          bordered
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'tenantCode'">
              <span>{{
                `ZT-${String(record.tenantId).padStart(3, '0')}`
              }}</span>
              <Tag
                v-if="isDefaultTenant(record.tenantId)"
                color="processing"
                class="ml-2"
              >
                默认
              </Tag>
            </template>
            <template v-if="column.key === 'status'">
              <StatusTag :status="record.status" />
            </template>
            <template v-if="column.key === 'createTime'">
              {{ formatDate(record.createTime) }}
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openModalCustom(record)">
                编辑
              </Button>
              <Button
                type="link"
                size="small"
                @click="handleSetDefaultTenant(record.tenantId)"
              >
                设为默认
              </Button>
              <Button
                type="link"
                size="small"
                @click="handleToggleStatus(record)"
              >
                {{ record.status === '0' ? '停用' : '启用' }}
              </Button>
              <Button
                type="link"
                size="small"
                @click="router.push('/sys/settings/tenant-parameter')"
              >
                参数设置
              </Button>
              <Popconfirm
                title="确定删除吗？"
                @confirm="handleDeleteTenant(record.tenantId)"
              >
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>

      <Modal
        v-model:open="isModalVisible"
        :title="formState.tenantId ? '编辑账套' : '新增账套'"
        @ok="handleSubmitCustom"
        :confirm-loading="submitting"
        destroy-on-close
      >
        <Form
          ref="formRef"
          :model="formState"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }"
          class="mt-4"
        >
          <Form.Item
            label="账套名称"
            name="tenantName"
            :rules="[{ required: true, message: '请输入账套名称' }]"
          >
            <Input
              v-model:value="formState.tenantName"
              placeholder="请输入名称"
            />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Radio.Group v-model:value="formState.status">
              <Radio value="0">正常</Radio>
              <Radio value="1">停用</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea
              v-model:value="formState.remark"
              placeholder="请输入备注信息"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  </Page>
</template>
