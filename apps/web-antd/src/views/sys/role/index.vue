<script setup lang="ts">
// @ts-nocheck
import { computed, onMounted, ref } from 'vue';

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
  Tree,
} from 'ant-design-vue';

import { sysMenuApi, sysRoleApi } from '#/api/core/sys-manage';
import StatusTag from '#/components/StatusTag/index.vue';
import { useCrudTable } from '#/composables/useCrudTable';

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
  api: sysRoleApi,
  rowKey: 'roleId',
  defaultFormState: {
    roleName: '',
    roleKey: '',
    roleSort: 0,
    dataScope: '1',
    status: '0',
    remark: '',
  },
  messages: {
    createSuccess: '角色新增成功',
    updateSuccess: '角色更新成功',
    deleteSuccess: '角色删除成功',
  },
});

const batchLoading = ref(false);
const selectedRowKeys = ref<Array<number | string>>([]);
const searchParams = ref({ roleName: '', roleKey: '', status: undefined });

const dataScopeOptions = [
  { label: '全部数据权限', value: '1' },
  { label: '自定数据权限', value: '2' },
  { label: '本部门数据权限', value: '3' },
  { label: '本部门及以下数据权限', value: '4' },
  { label: '仅本人数据权限', value: '5' },
];
const dataScopeMap = Object.fromEntries(
  dataScopeOptions.map((item) => [item.value, item.label]),
);

const columns = [
  { title: '角色名称', dataIndex: 'roleName', key: 'roleName', width: 180 },
  { title: '权限字符', dataIndex: 'roleKey', key: 'roleKey', width: 200 },
  { title: '显示顺序', dataIndex: 'roleSort', key: 'roleSort', width: 100 },
  { title: '数据范围', dataIndex: 'dataScope', key: 'dataScope', width: 160 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
  { title: '操作', key: 'action', width: 220 },
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
  () => dataSource.value.filter((item: any) => item.status === '0').length,
);
const disabledCount = computed(
  () => dataSource.value.filter((item: any) => item.status === '1').length,
);

const formatDate = (value: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';

const doFetch = async (page = 1) => {
  await fetchList(page, searchParams.value);
};

const resetFilters = async () => {
  searchParams.value = { roleName: '', roleKey: '', status: undefined };
  selectedRowKeys.value = [];
  await doFetch(1);
};

const clearSelection = () => {
  selectedRowKeys.value = [];
};

const getSelectedRecords = () =>
  dataSource.value.filter((item: any) =>
    selectedRowKeys.value.some((key) => `${key}` === `${item.roleId}`),
  );

const handleBatchStatus = async (status: string) => {
  const records = getSelectedRecords();
  if (records.length === 0) {
    message.warning('请先选择角色');
    return;
  }
  batchLoading.value = true;
  try {
    let changedCount = 0;
    for (const record of records) {
      if (record.status === status) continue;
      await sysRoleApi.update(record.roleId, {
        ...record,
        status,
        roleSort: Number(record.roleSort || 0),
      });
      changedCount += 1;
    }
    message.success(
      changedCount > 0 ? `已处理${changedCount}个角色` : '所选角色状态无需调整',
    );
    clearSelection();
    await doFetch(pagination.value.current);
  } catch (error) {
    console.error(error);
    message.error('批量更新失败');
  } finally {
    batchLoading.value = false;
  }
};

const handleBatchDelete = () => {
  const records = getSelectedRecords();
  if (records.length === 0) {
    message.warning('请先选择角色');
    return;
  }
  Modal.confirm({
    title: '确定删除选中的角色吗？',
    content: `共 ${records.length} 个角色，删除后不可恢复。`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { danger: true },
    centered: true,
    onOk: async () => {
      batchLoading.value = true;
      try {
        for (const record of records) {
          await sysRoleApi.remove(record.roleId);
        }
        message.success(`已删除${records.length}个角色`);
        clearSelection();
        await doFetch(pagination.value.current);
      } finally {
        batchLoading.value = false;
      }
    },
  });
};

const onModalOk = () => {
  handleSubmit({ roleSort: Number(formState.value.roleSort || 0) });
};

const permModalVisible = ref(false);
const permLoading = ref(false);
const permSaving = ref(false);
const currentRole = ref<any>(null);
const menuTreeData = ref<any[]>([]);
const checkedMenuKeys = ref<number[]>([]);
const selectedMenuCount = computed(() => checkedMenuKeys.value.length);

const buildMenuTree = (list: any[], parentId = 0): any[] => {
  return list
    .filter((item) => Number(item.parentId ?? 0) === Number(parentId))
    .map((item) => ({
      title: item.menuName,
      key: item.menuId,
      orderNum: item.orderNum,
      children: buildMenuTree(list, item.menuId),
    }))
    .sort((a, b) => (a.orderNum ?? 0) - (b.orderNum ?? 0));
};

const openPermModal = async (record: any) => {
  currentRole.value = record;
  permModalVisible.value = true;
  permLoading.value = true;
  try {
    const [menuList, roleMenuIds] = await Promise.all([
      sysMenuApi.getList(),
      sysRoleApi.getRoleMenus(record.roleId),
    ]);
    const flatMenus = menuList?.items || menuList || [];
    menuTreeData.value = buildMenuTree(flatMenus);
    checkedMenuKeys.value = roleMenuIds || [];
  } catch (error) {
    console.error(error);
    message.error('获取角色权限失败');
  } finally {
    permLoading.value = false;
  }
};

const handleMenuCheck = (checkedKeys: any) => {
  checkedMenuKeys.value = Array.isArray(checkedKeys)
    ? checkedKeys
    : checkedKeys.checked;
};

const handleSavePerm = async () => {
  if (!currentRole.value) return;
  permSaving.value = true;
  try {
    await sysRoleApi.saveRoleMenus(
      currentRole.value.roleId,
      checkedMenuKeys.value.map(Number),
    );
    message.success('菜单权限保存成功');
    permModalVisible.value = false;
  } catch (error) {
    console.error(error);
    message.error('菜单权限保存失败');
  } finally {
    permSaving.value = false;
  }
};

onMounted(() => {
  doFetch(1);
});
</script>

<template>
  <Page>
    <div class="p-4">

      <Card :bordered="false">
        <div class="mb-4 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.roleName"
            placeholder="角色名称"
            class="w-40"
            allow-clear
          />
          <Input
            v-model:value="searchParams.roleKey"
            placeholder="权限字符"
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
            + 新增角色
          </Button>
        </div>

        <div
          class="mb-3 flex flex-wrap items-center gap-3 rounded bg-gray-50 px-3 py-2 text-sm text-gray-600"
        >
          <span>已选 {{ selectedCount }} 个角色</span>
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
          row-key="roleId"
          bordered
          size="middle"
          :scroll="{ x: 1260 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'dataScope'">
              <span>{{
                dataScopeMap[record.dataScope || '1'] || '未定义'
              }}</span>
            </template>
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
              <Button type="link" size="small" @click="openPermModal(record)">
                权限
              </Button>
              <Popconfirm
                title="确定删除该角色吗？"
                @confirm="handleDelete(record.roleId)"
              >
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>

      <Modal
        v-model:open="isModalVisible"
        :title="formState.roleId ? '编辑角色' : '新增角色'"
        @ok="onModalOk"
        :confirm-loading="submitting"
        destroy-on-close
        width="620px"
      >
        <Form
          ref="formRef"
          :model="formState"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
          class="mt-4"
        >
          <Form.Item
            label="角色名称"
            name="roleName"
            :rules="[{ required: true, message: '请输入角色名称' }]"
          >
            <Input
              v-model:value="formState.roleName"
              placeholder="请输入角色名称"
            />
          </Form.Item>
          <Form.Item
            label="权限字符"
            name="roleKey"
            :rules="[{ required: true, message: '请输入权限字符' }]"
          >
            <Input
              v-model:value="formState.roleKey"
              placeholder="如：finance:manager"
            />
          </Form.Item>
          <Form.Item label="显示顺序" name="roleSort">
            <InputNumber
              v-model:value="formState.roleSort"
              class="w-full"
              :min="0"
            />
          </Form.Item>
          <Form.Item label="数据范围" name="dataScope">
            <Select
              v-model:value="formState.dataScope"
              :options="dataScopeOptions"
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

      <Modal
        v-model:open="permModalVisible"
        title="菜单权限分配"
        @ok="handleSavePerm"
        :confirm-loading="permSaving"
        width="860px"
        destroy-on-close
      >
        <div
          class="mb-4 rounded border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600"
        >
          <div>当前角色：{{ currentRole?.roleName || '-' }}</div>
          <div class="mt-1">权限字符：{{ currentRole?.roleKey || '-' }}</div>
          <div class="mt-1">已勾选菜单：{{ selectedMenuCount }}</div>
        </div>
        <Card :bordered="false" :loading="permLoading">
          <Tree
            checkable
            block-node
            default-expand-all
            :tree-data="menuTreeData"
            :checked-keys="checkedMenuKeys"
            @check="handleMenuCheck"
          />
        </Card>
      </Modal>
    </div>
  </Page>
</template>
