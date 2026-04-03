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
  Switch,
  Table,
  TreeSelect,
} from 'ant-design-vue';

import { sysMenuApi } from '#/api/core/sys-manage';
import StatusTag from '#/components/StatusTag/index.vue';
import { useCrudTable } from '#/composables/useCrudTable';

const router = useRouter();

const menuNameInputRef = ref();

const quickFilter = ref('all');
const searchParams = ref({ menuName: '', status: undefined });

const defaultFormState = {
  menuName: '',
  parentId: undefined,
  orderNum: 0,
  path: '',
  component: '',
  query: '',
  menuType: 'C',
  visible: '0',
  status: '0',
  icon: '',
  perms: '',
  isFrame: 1,
  isCache: 0,
  remark: '',
};

const {
  loading,
  dataSource,
  isModalVisible,
  submitting,
  formRef,
  formState,
  fetchList,
  handleDelete,
} = useCrudTable({
  api: sysMenuApi,
  rowKey: 'menuId',
  defaultFormState,
  messages: {
    createSuccess: '菜单新增成功',
    updateSuccess: '菜单更新成功',
    deleteSuccess: '删除菜单成功',
  },
});

const menuTypeOptions = [
  { label: '目录', value: 'M' },
  { label: '菜单', value: 'C' },
  { label: '按钮', value: 'F' },
];
const menuTypeMap = {
  M: { color: 'blue', text: '目录' },
  C: { color: 'green', text: '菜单' },
  F: { color: 'purple', text: '按钮' },
};

const buildTree = (list: any[]) => {
  const map = new Map();
  const roots: any[] = [];
  list.forEach((item) => {
    map.set(item.menuId, {
      ...item,
      key: item.menuId,
      value: item.menuId,
      title: item.menuName,
      children: [],
    });
  });
  list.forEach((item) => {
    const current = map.get(item.menuId);
    const parentId = Number(item.parentId || 0);
    if (parentId > 0 && map.has(parentId)) {
      map.get(parentId).children.push(current);
    } else {
      roots.push(current);
    }
  });
  const trim = (nodes: any[]) => {
    nodes.forEach((node) => {
      if (!node.children?.length) {
        delete node.children;
        return;
      }
      trim(node.children);
    });
  };
  trim(roots);
  return roots;
};

const displayFlatList = computed(() => {
  if (quickFilter.value === 'enabled')
    return dataSource.value.filter((item: any) => item.status === '0');
  if (quickFilter.value === 'directory')
    return dataSource.value.filter((item: any) => item.menuType === 'M');
  if (quickFilter.value === 'button')
    return dataSource.value.filter((item: any) => item.menuType === 'F');
  return dataSource.value;
});
const tableData = computed(() => buildTree(displayFlatList.value));
const menuTreeData = computed(() => [
  { title: '主类目', value: 0, key: 0, children: buildTree(dataSource.value) },
]);
const totalCount = computed(() => dataSource.value.length);
const enabledCount = computed(
  () => dataSource.value.filter((item: any) => item.status === '0').length,
);
const directoryCount = computed(
  () => dataSource.value.filter((item: any) => item.menuType === 'M').length,
);
const buttonCount = computed(
  () => dataSource.value.filter((item: any) => item.menuType === 'F').length,
);

const columns = [
  { title: '菜单名称', dataIndex: 'menuName', key: 'menuName', width: 220 },
  { title: '类型', dataIndex: 'menuType', key: 'menuType', width: 100 },
  { title: '图标', dataIndex: 'icon', key: 'icon', width: 120 },
  { title: '排序', dataIndex: 'orderNum', key: 'orderNum', width: 90 },
  { title: '路由路径', dataIndex: 'path', key: 'path', width: 200 },
  { title: '权限标识', dataIndex: 'perms', key: 'perms', width: 200 },
  { title: '显示', dataIndex: 'visible', key: 'visible', width: 90 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 170 },
  { title: '操作', key: 'action', width: 260, fixed: 'right' },
];

const formatDate = (value: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';

const doFetch = async () => {
  await fetchList(1, searchParams.value);
};

const resetFormState = (parentId: any) => {
  formState.value = { ...defaultFormState, parentId };
};

const openModal = (record?: any) => {
  formState.value = record
    ? { ...record, parentId: Number(record.parentId || 0) || undefined }
    : { ...defaultFormState };
  isModalVisible.value = true;
};
const openCreateModal = () => {
  resetFormState(undefined);
  isModalVisible.value = true;
};
const openAddSubModal = (record: any) => {
  resetFormState(record.menuId);
  isModalVisible.value = true;
};

const hasChildren = (menuId: any) =>
  dataSource.value.some((item: any) => `${item.parentId || 0}` === `${menuId}`);

const handleDeleteMenu = async (id: any) => {
  if (hasChildren(id)) {
    message.warning('请先删除下级菜单后再删除当前节点');
    return;
  }
  await handleDelete(id);
  await doFetch();
};

const handleOk = async (continueAdd = false) => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    const payload = {
      ...formState.value,
      parentId: formState.value.parentId || 0,
      orderNum: Number(formState.value.orderNum || 0),
      isFrame: Number(formState.value.isFrame || 0),
      isCache: Number(formState.value.isCache || 0),
    };
    if (formState.value.menuId) {
      await sysMenuApi.update(formState.value.menuId, payload);
      message.success('菜单更新成功');
    } else {
      await sysMenuApi.create(payload);
      message.success('菜单新增成功');
    }
    
    if (continueAdd) {
      const currentParentId = formState.value.parentId;
      formRef.value?.resetFields();
      formState.value = { ...defaultFormState, parentId: currentParentId };
      setTimeout(() => {
        menuNameInputRef.value?.focus();
      }, 100);
    } else {
      isModalVisible.value = false;
    }
    
    await doFetch();
  } catch (error) {
    console.error(error);
  } finally {
    submitting.value = false;
  }
};

const applyQuickFilter = (mode: string) => {
  quickFilter.value = mode;
};

const resetFilters = async () => {
  quickFilter.value = 'all';
  searchParams.value.menuName = '';
  searchParams.value.status = undefined;
  await fetchList();
};

onMounted(() => fetchList());
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
            全部菜单
          </Button>
          <Button
            :type="quickFilter === 'enabled' ? 'primary' : 'default'"
            @click="applyQuickFilter('enabled')"
          >
            仅启用
          </Button>
          <Button
            :type="quickFilter === 'directory' ? 'primary' : 'default'"
            @click="applyQuickFilter('directory')"
          >
            目录
          </Button>
          <Button
            :type="quickFilter === 'button' ? 'primary' : 'default'"
            @click="applyQuickFilter('button')"
          >
            按钮
          </Button>
          <Input
            v-model:value="searchParams.menuName"
            placeholder="菜单名称"
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
          <Button type="primary" @click="doFetch()">查询</Button>
          <Button @click="resetFilters">重置</Button>
          <Button type="primary" class="ml-auto" @click="openCreateModal">
            + 新增菜单
          </Button>
        </div>

        <Table
          :columns="columns"
          :data-source="tableData"
          :loading="loading"
          :pagination="false"
          row-key="menuId"
          bordered
          size="middle"
          :default-expand-all-rows="true"
          :scroll="{ x: 1540 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'menuType'">
              <Tag
                :color="menuTypeMap[record.menuType || 'C']?.color || 'default'"
              >
                {{ menuTypeMap[record.menuType || 'C']?.text || '未知' }}
              </Tag>
            </template>
            <template v-if="column.key === 'visible'">
              <Tag :color="record.visible === '0' ? 'success' : 'default'">
                {{ record.visible === '0' ? '显示' : '隐藏' }}
              </Tag>
            </template>
            <template v-if="column.key === 'status'">
              <StatusTag :status="record.status" />
            </template>
            <template v-if="column.key === 'updateTime'">
              {{ formatDate(record.updateTime || record.createTime) }}
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openAddSubModal(record)">
                新增下级
              </Button>
              <Button type="link" size="small" @click="openModal(record)">
                编辑
              </Button>
              <Popconfirm
                title="确定删除该菜单吗？"
                @confirm="handleDeleteMenu(record.menuId)"
              >
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>

      <Modal
        v-model:open="isModalVisible"
        :title="formState.menuId ? '编辑菜单' : '新增菜单'"
        :confirm-loading="submitting"
        destroy-on-close
        width="760px"
      >
        <template #footer>
          <Button @click="isModalVisible = false">取消</Button>
          <Button
            v-if="!formState.menuId"
            :loading="submitting"
            @click="handleOk(true)"
          >
            保存并继续新增
          </Button>
          <Button type="primary" :loading="submitting" @click="handleOk(false)">
            确定
          </Button>
        </template>
        <Form
          ref="formRef"
          :model="formState"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
          class="mt-4"
        >
          <div class="grid grid-cols-2 gap-x-4">
            <Form.Item label="上级菜单" name="parentId">
              <TreeSelect
                v-model:value="formState.parentId"
                :tree-data="menuTreeData"
                placeholder="不选则为一级菜单"
                allow-clear
                tree-default-expand-all
              />
            </Form.Item>
            <Form.Item label="菜单类型" name="menuType">
              <Radio.Group v-model:value="formState.menuType">
                <Radio
                  v-for="item in menuTypeOptions"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="菜单名称"
              name="menuName"
              :rules="[{ required: true, message: '请输入菜单名称' }]"
            >
              <Input
                ref="menuNameInputRef"
                v-model:value="formState.menuName"
                placeholder="请输入菜单名称"
              />
            </Form.Item>
            <Form.Item label="显示排序" name="orderNum">
              <InputNumber
                v-model:value="formState.orderNum"
                class="w-full"
                :min="0"
              />
            </Form.Item>
            <Form.Item label="路由路径" name="path">
              <Input
                v-model:value="formState.path"
                placeholder="如 /sys/menu"
              />
            </Form.Item>
            <Form.Item label="组件路径" name="component">
              <Input
                v-model:value="formState.component"
                placeholder="如 /sys/menu/index"
              />
            </Form.Item>
            <Form.Item label="权限标识" name="perms">
              <Input
                v-model:value="formState.perms"
                placeholder="如 sys:menu:list"
              />
            </Form.Item>
            <Form.Item label="图标" name="icon">
              <Input
                v-model:value="formState.icon"
                placeholder="如 lucide:menu"
              />
            </Form.Item>
            <Form.Item label="路由参数" name="query">
              <Input v-model:value="formState.query" placeholder="可选 query" />
            </Form.Item>
            <Form.Item label="状态" name="status">
              <Radio.Group v-model:value="formState.status">
                <Radio value="0">正常</Radio><Radio value="1">停用</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="是否显示" name="visible">
              <Radio.Group v-model:value="formState.visible">
                <Radio value="0">显示</Radio><Radio value="1">隐藏</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="内链" name="isFrame">
              <Switch
                :checked="Number(formState.isFrame) === 0"
                checked-children="是"
                un-checked-children="否"
                @change="(checked) => (formState.isFrame = checked ? 0 : 1)"
              />
            </Form.Item>
            <Form.Item label="缓存" name="isCache">
              <Switch
                :checked="Number(formState.isCache) === 0"
                checked-children="开"
                un-checked-children="关"
                @change="(checked) => (formState.isCache = checked ? 0 : 1)"
              />
            </Form.Item>
          </div>
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
