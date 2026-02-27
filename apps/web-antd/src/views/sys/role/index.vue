<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Card, Table, Button, Input, Tag, Modal, Form, message, Popconfirm } from 'ant-design-vue';
import { sysRoleApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const searchParams = ref({ roleName: '' });

// 弹窗与表单状态
const isModalVisible = ref(false);
const isSubmitLoading = ref(false);
const formRef = ref();
const formState = ref<any>({
  roleName: '',
  roleKey: '',
  roleSort: 0,
  status: '0',
});

const openModal = () => {
  formState.value = { roleName: '', roleKey: '', roleSort: 0, status: '0' };
  isModalVisible.value = true;
};

const openEditModal = (record: any) => {
  formState.value = { ...record };
  isModalVisible.value = true;
};

const handleDelete = async (id: number) => {
  try {
    await sysRoleApi.remove(id);
    message.success('删除角色成功');
    fetchList();
  } catch (error) {
    console.error('Delete error:', error);
  }
};

const handleOk = async () => {
  try {
    await formRef.value?.validate();
    isSubmitLoading.value = true;
    if (formState.value.roleId) {
      await sysRoleApi.update(formState.value.roleId, formState.value);
      message.success('修改角色成功');
    } else {
      await sysRoleApi.create(formState.value);
      message.success('新增角色成功');
    }
    isModalVisible.value = false;
    fetchList(1);
  } catch (error) {
    console.error('Submit error:', error);
  } finally {
    isSubmitLoading.value = false;
  }
};

const columns = [
  { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
  { title: '权限字符', dataIndex: 'roleKey', key: 'roleKey' },
  { title: '显示顺序', dataIndex: 'roleSort', key: 'roleSort' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作', key: 'action', width: 200 }
];

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysRoleApi.getList({ page, pageSize: pagination.value.pageSize, ...searchParams.value });
    dataSource.value = res?.items || [];
    pagination.value.current = page;
    pagination.value.total = res?.total || 0;
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchList());
</script>

<template>
  <Page title="角色管理" description="权限和菜案的集合体，分配给用户。">
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-4 flex gap-4">
          <Input v-model:value="searchParams.roleName" placeholder="角色名称" class="w-64" allowClear />
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button @click="() => { searchParams.roleName = ''; fetchList(1); }">重置</Button>
          <Button type="primary" ghost class="ml-auto" @click="openModal">新增角色</Button>
        </div>
        <Table 
          :columns="columns" 
          :dataSource="dataSource" 
          :loading="loading" 
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          rowKey="roleId"
          bordered
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '正常' : '停用' }}
              </Tag>
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openEditModal(record)">编辑</Button>
              <Button type="link" size="small">分配权限</Button>
              <Popconfirm title="确认删除该角色吗？" @confirm="handleDelete(record.roleId)">
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
    </div>

    <!-- 编辑/新增角色弹窗 -->
    <Modal
      v-model:open="isModalVisible"
      :title="formState.roleId ? '编辑角色' : '新增角色'"
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
        <Form.Item label="角色名称" name="roleName" :rules="[{ required: true, message: '请输入角色名称' }]">
          <Input v-model:value="formState.roleName" placeholder="如: 管理员" />
        </Form.Item>
        <Form.Item label="权限字符" name="roleKey" :rules="[{ required: true, message: '请输入权限字符' }]">
          <Input v-model:value="formState.roleKey" placeholder="如: admin" />
        </Form.Item>
        <Form.Item label="显示顺序" name="roleSort">
          <Input type="number" v-model:value="formState.roleSort" placeholder="如: 1" />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Input v-model:value="formState.status" placeholder="0为正常，1为停用" />
        </Form.Item>
      </Form>
    </Modal>
  </Page>
</template>
