<script setup lang="ts">
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
  TreeSelect,
} from 'ant-design-vue';

import { sysConfigApi, sysDeptApi } from '#/api/core/sys-manage';
import StatusTag from '#/components/StatusTag/index.vue';
import { useCrudTable } from '#/composables/useCrudTable';

const router = useRouter();

const orgConfig = ref<any>({});
const quickFilter = ref<'all' | 'enabled' | 'root'>('all');
const searchParams = ref<{ deptName: string; status?: string }>({
  deptName: '',
  status: undefined,
});

const defaultFormState = {
  deptName: '',
  deptCode: '',
  parentId: undefined,
  deptType: '0',
  orderNum: 0,
  leader: '',
  phone: '',
  email: '',
  status: '0',
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
  api: sysDeptApi,
  rowKey: 'deptId',
  defaultFormState,
  messages: {
    createSuccess: '组织新增成功',
    updateSuccess: '组织更新成功',
    deleteSuccess: '删除组织成功',
  },
});

const deptTypeOptions = [
  { label: '标准部门', value: '0' },
  { label: '组织单元', value: '1' },
];

const deptTypeMap: Record<string, { color: string; text: string }> = {
  '0': { color: 'blue', text: '标准部门' },
  '1': { color: 'purple', text: '组织单元' },
};

const listToTree = (list: any[]) => {
  const nodeMap = new Map<number, any>();
  const roots: any[] = [];
  list.forEach((item) => {
    nodeMap.set(item.deptId, {
      ...item,
      title: item.deptName,
      value: item.deptId,
      key: item.deptId,
      children: [],
    });
  });
  list.forEach((item) => {
    const current = nodeMap.get(item.deptId);
    const parentId = Number(item.parentId || 0);
    if (parentId > 0 && nodeMap.has(parentId)) {
      nodeMap.get(parentId).children.push(current);
    } else {
      roots.push(current);
    }
  });
  const removeEmptyChildren = (nodes: any[]) => {
    nodes.forEach((node) => {
      if (!node.children?.length) {
        delete node.children;
        return;
      }
      removeEmptyChildren(node.children);
    });
  };
  removeEmptyChildren(roots);
  return roots;
};

const displayFlatList = computed(() => {
  if (quickFilter.value === 'enabled') {
    return dataSource.value.filter((item: any) => item.status === '0');
  }
  if (quickFilter.value === 'root') {
    return dataSource.value.filter(
      (item: any) => Number(item.parentId || 0) === 0,
    );
  }
  return dataSource.value;
});

const tableData = computed(() => listToTree(displayFlatList.value));
const deptTreeData = computed(() => listToTree(dataSource.value));
const totalCount = computed(() => dataSource.value.length);
const enabledCount = computed(
  () => dataSource.value.filter((item: any) => item.status === '0').length,
);
const rootCount = computed(
  () =>
    dataSource.value.filter((item: any) => Number(item.parentId || 0) === 0)
      .length,
);
const leaderFilledCount = computed(
  () => dataSource.value.filter((item: any) => item.leader).length,
);

const columns = [
  { title: '组织名称', dataIndex: 'deptName', key: 'deptName', width: 220 },
  { title: '组织编码', dataIndex: 'deptCode', key: 'deptCode', width: 140 },
  { title: '类型', dataIndex: 'deptType', key: 'deptType', width: 120 },
  { title: '负责人', dataIndex: 'leader', key: 'leader', width: 120 },
  { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 140 },
  { title: '排序', dataIndex: 'orderNum', key: 'orderNum', width: 90 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 170 },
  { title: '操作', key: 'action', width: 260, fixed: 'right' as const },
];

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';

const fetchOrgConfig = async () => {
  orgConfig.value = await sysConfigApi.getGroup('org').catch(() => ({}));
};

const doFetch = async () => {
  await fetchList(1, searchParams.value);
};

const resetFormState = (parentId?: number | string) => {
  formState.value = { ...defaultFormState, parentId };
};

const openCreateModal = () => {
  resetFormState(undefined);
  isModalVisible.value = true;
};

const openAddSubModal = (record: any) => {
  resetFormState(record.deptId);
  isModalVisible.value = true;
};

const openEditModal = (record: any) => {
  formState.value = {
    ...record,
    parentId: Number(record.parentId || 0) || undefined,
  };
  isModalVisible.value = true;
};

const hasChildren = (deptId: number | string) =>
  dataSource.value.some((item: any) => `${item.parentId || 0}` === `${deptId}`);

const handleDeleteDept = async (deptId: number | string) => {
  if (hasChildren(deptId)) {
    message.warning('请先删除下级组织后再删除当前节点');
    return;
  }
  await handleDelete(deptId);
  await doFetch();
};

const handleSubmitCustom = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    const payload = {
      ...formState.value,
      parentId: formState.value.parentId || 0,
    };
    if (formState.value.deptId) {
      await sysDeptApi.update(formState.value.deptId, payload);
      message.success('组织更新成功');
    } else {
      await sysDeptApi.create(payload);
      message.success('组织新增成功');
    }
    isModalVisible.value = false;
    await doFetch();
  } catch (error: any) {
    if (error?.errorFields) return;
    message.error(error?.message || '保存失败');
  } finally {
    submitting.value = false;
  }
};

const applyQuickFilter = (mode: 'all' | 'enabled' | 'root') => {
  quickFilter.value = mode;
};

const resetFilters = async () => {
  quickFilter.value = 'all';
  searchParams.value.deptName = '';
  searchParams.value.status = undefined;
  await doFetch();
};

onMounted(async () => {
  await Promise.all([fetchOrgConfig(), doFetch()]);
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
            全部组织
          </Button>
          <Button
            :type="quickFilter === 'enabled' ? 'primary' : 'default'"
            @click="applyQuickFilter('enabled')"
          >
            仅启用
          </Button>
          <Button
            :type="quickFilter === 'root' ? 'primary' : 'default'"
            @click="applyQuickFilter('root')"
          >
            一级组织
          </Button>
          <Input
            v-model:value="searchParams.deptName"
            placeholder="组织名称"
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
          <Button type="primary" @click="doFetch">查询</Button>
          <Button @click="resetFilters">重置</Button>
          <Button type="primary" class="ml-auto" @click="openCreateModal">
            + 新增组织
          </Button>
        </div>

        <Table
          :columns="columns"
          :data-source="tableData"
          :loading="loading"
          :pagination="false"
          row-key="deptId"
          bordered
          size="middle"
          :default-expand-all-rows="true"
          :scroll="{ x: 1280 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'deptType'">
              <Tag
                :color="deptTypeMap[record.deptType || '0']?.color || 'default'"
              >
                {{ deptTypeMap[record.deptType || '0']?.text || '未定义' }}
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
              <Button type="link" size="small" @click="openEditModal(record)">
                编辑
              </Button>
              <Popconfirm
                title="确定删除该组织吗？"
                @confirm="handleDeleteDept(record.deptId)"
              >
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>

      <Modal
        v-model:open="isModalVisible"
        :title="formState.deptId ? '编辑组织' : '新增组织'"
        @ok="handleSubmitCustom"
        :confirm-loading="submitting"
        destroy-on-close
        width="640px"
      >
        <Form
          ref="formRef"
          :model="formState"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
          class="mt-4"
        >
          <div class="grid grid-cols-2 gap-x-4">
            <Form.Item label="上级组织" name="parentId">
              <TreeSelect
                v-model:value="formState.parentId"
                :tree-data="deptTreeData"
                placeholder="不选则为一级组织"
                allow-clear
                tree-default-expand-all
              />
            </Form.Item>
            <Form.Item label="组织类型" name="deptType">
              <Radio.Group v-model:value="formState.deptType">
                <Radio
                  v-for="item in deptTypeOptions"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="组织名称"
              name="deptName"
              :rules="[{ required: true, message: '请输入组织名称' }]"
            >
              <Input
                v-model:value="formState.deptName"
                placeholder="请输入组织名称"
              />
            </Form.Item>
            <Form.Item label="组织编码" name="deptCode">
              <Input
                v-model:value="formState.deptCode"
                placeholder="请输入组织编码"
              />
            </Form.Item>
            <Form.Item label="负责人" name="leader">
              <Input
                v-model:value="formState.leader"
                placeholder="请输入负责人"
              />
            </Form.Item>
            <Form.Item label="联系电话" name="phone">
              <Input
                v-model:value="formState.phone"
                placeholder="请输入联系电话"
              />
            </Form.Item>
            <Form.Item label="邮箱" name="email">
              <Input v-model:value="formState.email" placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item label="显示排序" name="orderNum">
              <InputNumber
                v-model:value="formState.orderNum"
                class="w-full"
                :min="0"
              />
            </Form.Item>
            <Form.Item label="状态" name="status">
              <Radio.Group v-model:value="formState.status">
                <Radio value="0">正常</Radio><Radio value="1">停用</Radio>
              </Radio.Group>
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
