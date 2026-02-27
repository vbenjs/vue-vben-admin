<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Card, Table, Button, Input, Tag, Modal, Form, message, Popconfirm, TreeSelect } from 'ant-design-vue';
import { sysDeptApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const searchParams = ref({ deptName: '' });

// 弹窗与表单状态
const isModalVisible = ref(false);
const isSubmitLoading = ref(false);
const formRef = ref();
const formState = ref<any>({
  deptName: '',
  parentId: undefined,
  orderNum: 0,
  leader: '',
  phone: '',
  email: '',
  status: '0',
});

const deptTreeData = ref([]);

// 把平铺的部门数据转换为树形结构（用于TreeSelect选择父级部门）
const listToTree = (list: any[]) => {
  const map: any = {};
  const roots: any[] = [];
  list.forEach(item => {
    map[item.deptId] = { ...item, title: item.deptName, value: item.deptId, key: item.deptId, children: [] };
  });
  list.forEach(item => {
    if (item.parentId && map[item.parentId]) {
      map[item.parentId].children.push(map[item.deptId]);
    } else {
      roots.push(map[item.deptId]);
    }
  });
  return roots;
};

// 展开表格数据同样需要树形
const convertToTableTree = (list: any[]) => {
  const map: any = {};
  const roots: any[] = [];
  list.forEach(item => {
    map[item.deptId] = { ...item, key: item.deptId, children: [] };
  });
  list.forEach(item => {
    if (item.parentId && map[item.parentId]) {
      map[item.parentId].children.push(map[item.deptId]);
    } else {
      roots.push(map[item.deptId]);
    }
  });
  // 去除空的 children
  const removeEmptyChildren = (nodes: any[]) => {
    nodes.forEach(node => {
      if (node.children.length === 0) {
        delete node.children;
      } else {
        removeEmptyChildren(node.children);
      }
    });
  };
  removeEmptyChildren(roots);
  return roots;
};

const openModal = () => {
  formState.value = { deptName: '', parentId: undefined, orderNum: 0, leader: '', phone: '', email: '', status: '0' };
  isModalVisible.value = true;
};

const openEditModal = (record: any) => {
  formState.value = { ...record };
  isModalVisible.value = true;
};

const openAddSubModal = (record: any) => {
  formState.value = { deptName: '', parentId: record.deptId, orderNum: 0, leader: '', phone: '', email: '', status: '0' };
  isModalVisible.value = true;
};

const handleDelete = async (id: number) => {
  try {
    await sysDeptApi.remove(id);
    message.success('删除部门成功');
    fetchList();
  } catch (error) {
    console.error('Delete error:', error);
  }
};

const handleOk = async () => {
  try {
    await formRef.value?.validate();
    isSubmitLoading.value = true;
    if (formState.value.deptId) {
      await sysDeptApi.update(formState.value.deptId, formState.value);
      message.success('修改部门成功');
    } else {
      await sysDeptApi.create(formState.value);
      message.success('新增部门成功');
    }
    isModalVisible.value = false;
    fetchList();
  } catch (error) {
    console.error('Submit error:', error);
  } finally {
    isSubmitLoading.value = false;
  }
};

const columns = [
  { title: '部门名称', dataIndex: 'deptName', key: 'deptName' },
  { title: '排序', dataIndex: 'orderNum', key: 'orderNum' },
  { title: '负责人', dataIndex: 'leader', key: 'leader' },
  { title: '电话', dataIndex: 'phone', key: 'phone' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  { title: '操作', key: 'action', width: 250 }
];

const fetchList = async () => {
  try {
    loading.value = true;
    const res = await sysDeptApi.getList({ ...searchParams.value });
    const rawList = res || [];
    dataSource.value = convertToTableTree(rawList) as any;
    deptTreeData.value = listToTree(rawList) as any;
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchList());
</script>

<template>
  <Page title="组织架构" description="公司部门树形层级管理。">
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-4 flex gap-4">
          <Input v-model:value="searchParams.deptName" placeholder="部门名称" class="w-64" allowClear />
          <Button type="primary" @click="fetchList">查询</Button>
          <Button @click="() => { searchParams.deptName = ''; fetchList(); }">重置</Button>
          <Button type="primary" ghost class="ml-auto" @click="openModal">新增部门</Button>
        </div>
        <Table 
          :columns="columns" 
          :dataSource="dataSource" 
          :loading="loading" 
          :pagination="false"
          rowKey="deptId"
          bordered
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '正常' : '停用' }}
              </Tag>
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openAddSubModal(record)">新增子部门</Button>
              <Button type="link" size="small" @click="openEditModal(record)">编辑</Button>
              <Popconfirm title="确认删除该部门吗？" @confirm="handleDelete(record.deptId)">
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
    </div>

    <!-- 编辑/新增部门弹窗 -->
    <Modal
      v-model:open="isModalVisible"
      :title="formState.deptId ? '编辑部门' : '新增部门'"
      @ok="handleOk"
      :confirmLoading="isSubmitLoading"
      destroyOnClose
    >
      <Form
        ref="formRef"
        :model="formState"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
        class="mt-4"
      >
        <Form.Item label="上级部门" name="parentId">
          <TreeSelect
            v-model:value="formState.parentId"
            :tree-data="deptTreeData"
            placeholder="请选择上级部门"
            allow-clear
            tree-default-expand-all
          />
        </Form.Item>
        <Form.Item label="部门名称" name="deptName" :rules="[{ required: true, message: '请输入部门名称' }]">
          <Input v-model:value="formState.deptName" placeholder="如: 技术部" />
        </Form.Item>
        <Form.Item label="显示排序" name="orderNum">
          <Input type="number" v-model:value="formState.orderNum" placeholder="如: 1" />
        </Form.Item>
        <Form.Item label="负责人" name="leader">
          <Input v-model:value="formState.leader" placeholder="请输入负责人姓名" />
        </Form.Item>
        <Form.Item label="联系电话" name="phone">
          <Input v-model:value="formState.phone" placeholder="请输入联系电话" />
        </Form.Item>
        <Form.Item label="邮箱" name="email">
          <Input v-model:value="formState.email" placeholder="请输入邮箱地址" />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Input v-model:value="formState.status" placeholder="0为正常，1为停用" />
        </Form.Item>
      </Form>
    </Modal>
  </Page>
</template>
