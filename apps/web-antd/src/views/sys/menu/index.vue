<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Card, Table, Button, Input, Tag, Modal, Form, message, Popconfirm, TreeSelect, Radio, Select } from 'ant-design-vue';
import { sysMenuApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const searchParams = ref({ menuName: '', status: undefined });

// 弹窗与表单状态
const isModalVisible = ref(false);
const isSubmitLoading = ref(false);
const formRef = ref();
const formState = ref<any>({
  menuName: '',
  parentId: undefined,
  orderNum: 0,
  path: '',
  component: '',
  menuType: 'C',
  visible: '0',
  status: '0',
  icon: '',
  perms: '',
  isFrame: 1,
  isCache: 0,
});

const menuTreeData = ref([]);

// 转换为树结构（带 children）
const convertToTableTree = (list: any[]) => {
  const map: any = {};
  const roots: any[] = [];
  list.forEach(item => {
    map[item.menuId] = { ...item, key: item.menuId, value: item.menuId, title: item.menuName, children: [] };
  });
  list.forEach(item => {
    if (item.parentId && map[item.parentId]) {
      map[item.parentId].children.push(map[item.menuId]);
    } else {
      roots.push(map[item.menuId]);
    }
  });
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
  formState.value = {
    menuName: '', parentId: undefined, orderNum: 0, path: '', component: '',
    menuType: 'C', visible: '0', status: '0', icon: '', perms: '', isFrame: 1, isCache: 0
  };
  isModalVisible.value = true;
};

const openEditModal = (record: any) => {
  formState.value = { ...record };
  isModalVisible.value = true;
};

const openAddSubModal = (record: any) => {
  formState.value = {
    menuName: '', parentId: record.menuId, orderNum: 0, path: '', component: '',
    menuType: 'C', visible: '0', status: '0', icon: '', perms: '', isFrame: 1, isCache: 0
  };
  isModalVisible.value = true;
};

const handleDelete = async (id: number) => {
  try {
    await sysMenuApi.remove(id);
    message.success('删除菜单成功');
    fetchList();
  } catch (error) {
    console.error('Delete error:', error);
  }
};

const handleOk = async () => {
  try {
    await formRef.value?.validate();
    isSubmitLoading.value = true;
    if (formState.value.menuId) {
      await sysMenuApi.update(formState.value.menuId, formState.value);
      message.success('修改菜单成功');
    } else {
      await sysMenuApi.create(formState.value);
      message.success('新增菜单成功');
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
  { title: '菜单名称', dataIndex: 'menuName', key: 'menuName' },
  { title: '图标', dataIndex: 'icon', key: 'icon' },
  { title: '排序', dataIndex: 'orderNum', key: 'orderNum' },
  { title: '权限标识', dataIndex: 'perms', key: 'perms' },
  { title: '组件路径', dataIndex: 'component', key: 'component' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action', width: 250 }
];

const fetchList = async () => {
  try {
    loading.value = true;
    const res = await sysMenuApi.getList({ ...searchParams.value });
    const rawList = res || [];
    const tree = convertToTableTree(rawList);
    dataSource.value = tree as any;
    menuTreeData.value = [{ title: '主类目', value: 0, children: tree }] as any;
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchList());
</script>

<template>
  <Page title="菜单管理" description="系统左侧导航菜单、页面操作按钮的权限配置。">
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-3 flex gap-3 flex-wrap">
          <Input v-model:value="searchParams.menuName" placeholder="菜单名称" class="w-40" allowClear />
          <Select v-model:value="searchParams.status" placeholder="状态" class="w-28" allowClear>
            <Select.Option value="0">正常</Select.Option>
            <Select.Option value="1">停用</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList">查询</Button>
          <Button @click="() => { searchParams.menuName = ''; searchParams.status = undefined; fetchList(); }">重置</Button>
          <Button type="primary" class="ml-auto" @click="openModal">+ 新增</Button>
        </div>
        <Table 
          :columns="columns" 
          :dataSource="dataSource" 
          :loading="loading" 
          :pagination="false"
          rowKey="menuId"
          bordered
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '正常' : '隐藏' }}
              </Tag>
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openAddSubModal(record)">新增</Button>
              <Button type="link" size="small" @click="openEditModal(record)">编辑</Button>
              <Popconfirm title="确认删除该菜单吗？" @confirm="handleDelete(record.menuId)">
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
    </div>

    <!-- 编辑/新增弹窗 -->
    <Modal
      v-model:open="isModalVisible"
      :title="formState.menuId ? '编辑菜单' : '新增菜单'"
      @ok="handleOk"
      :confirmLoading="isSubmitLoading"
      destroyOnClose
      width="600px"
    >
      <Form
        ref="formRef"
        :model="formState"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        class="mt-4"
      >
        <Form.Item label="上级菜单" name="parentId">
          <TreeSelect
            v-model:value="formState.parentId"
            :tree-data="menuTreeData"
            placeholder="请选择上级菜单"
            allow-clear
            tree-default-expand-all
          />
        </Form.Item>
        <Form.Item label="菜单类型" name="menuType">
          <Radio.Group v-model:value="formState.menuType">
            <Radio value="M">目录</Radio>
            <Radio value="C">菜单</Radio>
            <Radio value="F">按钮</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="菜单名称" name="menuName" :rules="[{ required: true, message: '请输入菜单名称' }]">
          <Input v-model:value="formState.menuName" placeholder="如: 用户管理" />
        </Form.Item>
        <Form.Item label="显示排序" name="orderNum">
          <Input type="number" v-model:value="formState.orderNum" placeholder="如: 1" />
        </Form.Item>
        <Form.Item label="路由地址" name="path" v-if="formState.menuType !== 'F'">
          <Input v-model:value="formState.path" placeholder="如: user" />
        </Form.Item>
        <Form.Item label="组件路径" name="component" v-if="formState.menuType === 'C'">
          <Input v-model:value="formState.component" placeholder="如: sys/user/index" />
        </Form.Item>
        <Form.Item label="权限标识" name="perms" v-if="formState.menuType !== 'M'">
          <Input v-model:value="formState.perms" placeholder="如: sys:user:list" />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group v-model:value="formState.status">
            <Radio value="0">正常</Radio>
            <Radio value="1">隐藏</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  </Page>
</template>
