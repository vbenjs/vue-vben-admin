<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import {
  Card, Table, Button, Input, InputNumber, Tag,
  Modal, Form, Radio, Select, Popconfirm, message,
} from 'ant-design-vue';
import { sysRoleApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const searchParams = ref({ roleName: '', roleKey: '', status: undefined });

const columns = [
  { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
  { title: '权限字符', dataIndex: 'roleKey', key: 'roleKey' },
  { title: '显示顺序', dataIndex: 'roleSort', key: 'roleSort', width: 90 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  { title: '操作', key: 'action', width: 160 },
];

const formatDate = (v: string) => (v ? new Date(v).toLocaleString('zh-CN') : '-');

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysRoleApi.getList({
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

/* ---- Modal ---- */
const isModalVisible = ref(false);
const isSubmitLoading = ref(false);
const formRef = ref();
const formState = ref<any>({
  roleName: '', roleKey: '', roleSort: 0, dataScope: '0', status: '0', remark: '',
});

const openModal = (record?: any) => {
  formState.value = record
    ? { ...record }
    : { roleName: '', roleKey: '', roleSort: 0, dataScope: '0', status: '0', remark: '' };
  isModalVisible.value = true;
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
    fetchList(pagination.value.current);
  } catch (error) {
    console.error('Submit error:', error);
  } finally {
    isSubmitLoading.value = false;
  }
};

const handleDelete = async (id: number) => {
  await sysRoleApi.remove(id);
  message.success('删除角色成功');
  fetchList(pagination.value.current);
};

onMounted(() => fetchList());
</script>

<template>
  <Page title="角色管理" description="权限和菜单的集合体，分配给用户使用。">
    <div class="p-4">
      <Card :bordered="false">
        <!-- 搜索栏 -->
        <div class="mb-3 flex gap-3 flex-wrap">
          <Input
            v-model:value="searchParams.roleName"
            placeholder="角色名称"
            class="w-40"
            allowClear
          />
          <Input
            v-model:value="searchParams.roleKey"
            placeholder="权限字符"
            class="w-40"
            allowClear
          />
          <Select
            v-model:value="searchParams.status"
            placeholder="状态"
            class="w-28"
            allowClear
          >
            <Select.Option value="0">正常</Select.Option>
            <Select.Option value="1">停用</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button
            @click="
              () => {
                searchParams.roleName = '';
                searchParams.roleKey = '';
                searchParams.status = undefined;
                fetchList(1);
              }
            "
            >重置</Button
          >
          <Button type="primary" class="ml-auto" @click="openModal()">+ 新增</Button>
        </div>

        <Table
          :columns="columns"
          :dataSource="dataSource"
          :loading="loading"
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          rowKey="roleId"
          bordered
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '正常' : '停用' }}
              </Tag>
            </template>
            <template v-if="column.key === 'createTime'">
              {{ formatDate(record.createTime) }}
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openModal(record)">编辑</Button>
              <Popconfirm title="确认删除该角色吗？" @confirm="handleDelete(record.roleId)">
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
    </div>

    <!-- 新增/编辑弹窗 -->
    <Modal
      v-model:open="isModalVisible"
      :title="formState.roleId ? '编辑角色' : '新增角色'"
      @ok="handleOk"
      :confirmLoading="isSubmitLoading"
      destroyOnClose
      width="520px"
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
          <Input v-model:value="formState.roleName" placeholder="如：管理员" />
        </Form.Item>
        <Form.Item
          label="权限字符"
          name="roleKey"
          :rules="[{ required: true, message: '请输入权限字符' }]"
        >
          <Input v-model:value="formState.roleKey" placeholder="如：admin" />
        </Form.Item>
        <Form.Item label="显示顺序" name="roleSort">
          <InputNumber v-model:value="formState.roleSort" :min="0" style="width: 100%" />
        </Form.Item>
        <Form.Item label="数据权限" name="dataScope">
          <Select v-model:value="formState.dataScope" placeholder="请选择数据权限">
            <Select.Option value="0">本人权限</Select.Option>
            <Select.Option value="1">本部门权限</Select.Option>
            <Select.Option value="2">本部门及下级</Select.Option>
            <Select.Option value="3">全部权限</Select.Option>
            <Select.Option value="4">自定义权限</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Radio.Group v-model:value="formState.status">
            <Radio value="0">正常</Radio>
            <Radio value="1">停用</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea v-model:value="formState.remark" placeholder="可输入备注信息" />
        </Form.Item>
      </Form>
    </Modal>
  </Page>
</template>
