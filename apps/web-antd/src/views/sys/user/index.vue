<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import {
  Card, Table, Button, Input, Row, Col, Tree, Tag,
  Modal, Form, Radio, Select, Popconfirm, message,
} from 'ant-design-vue';
import { sysUserApi, sysDeptApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const searchParams = ref({ userName: '', phonenumber: '', status: undefined, deptId: undefined });

/* ---- 部门树 ---- */
const deptTreeData = ref([]);

const fetchDepts = async () => {
  const depts = await sysDeptApi.getList();
  deptTreeData.value = depts.map((d: any) => ({ title: d.deptName, key: d.deptId }));
};

const handleDeptSelect = (keys: any[]) => {
  searchParams.value.deptId = keys[0];
  fetchList(1);
};

/* ---- 列表 ---- */
const columns = [
  { title: '用户账号', dataIndex: 'userName', key: 'userName' },
  { title: '用户昵称', dataIndex: 'nickName', key: 'nickName' },
  { title: '手机号码', dataIndex: 'phonenumber', key: 'phonenumber' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  { title: '操作', key: 'action', width: 130 },
];

const formatDate = (v: string) => (v ? new Date(v).toLocaleString('zh-CN') : '-');

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysUserApi.getList({
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
  userName: '', nickName: '', phonenumber: '', email: '',
  deptId: undefined, status: '0', remark: '',
});

const openModal = (record?: any) => {
  formState.value = record
    ? { ...record }
    : { userName: '', nickName: '', phonenumber: '', email: '', deptId: undefined, status: '0', remark: '' };
  isModalVisible.value = true;
};

const handleOk = async () => {
  try {
    await formRef.value?.validate();
    isSubmitLoading.value = true;
    if (formState.value.userId) {
      await sysUserApi.update(formState.value.userId, formState.value);
      message.success('修改用户成功');
    } else {
      await sysUserApi.create(formState.value);
      message.success('新增用户成功');
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
  await sysUserApi.remove(id);
  message.success('删除用户成功');
  fetchList(pagination.value.current);
};

onMounted(() => {
  fetchDepts();
  fetchList();
});
</script>

<template>
  <Page title="用户管理" description="组织人员维护，分配角色。">
    <div class="p-4">
      <Row :gutter="16">
        <!-- 部门树 -->
        <Col :span="5">
          <Card title="组织架构" :bordered="false" class="h-full">
            <Tree
              :tree-data="deptTreeData"
              @select="handleDeptSelect"
              class="border border-gray-100 p-2 rounded"
            />
          </Card>
        </Col>

        <!-- 用户列表 -->
        <Col :span="19">
          <Card :bordered="false">
            <!-- 搜索栏 -->
            <div class="mb-3 flex gap-3 flex-wrap">
              <Input
                v-model:value="searchParams.userName"
                placeholder="用户账号"
                class="w-40"
                allowClear
              />
              <Input
                v-model:value="searchParams.phonenumber"
                placeholder="手机号码"
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
                    searchParams.userName = '';
                    searchParams.phonenumber = '';
                    searchParams.status = undefined;
                    searchParams.deptId = undefined;
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
              rowKey="userId"
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
                  <Popconfirm title="确认删除该用户吗？" @confirm="handleDelete(record.userId)">
                    <Button type="link" danger size="small">删除</Button>
                  </Popconfirm>
                </template>
              </template>
            </Table>
          </Card>
        </Col>
      </Row>
    </div>

    <!-- 编辑/新增弹窗 -->
    <Modal
      v-model:open="isModalVisible"
      :title="formState.userId ? '编辑用户' : '新增用户'"
      @ok="handleOk"
      :confirmLoading="isSubmitLoading"
      destroyOnClose
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
          label="用户账号"
          name="userName"
          :rules="[{ required: true, message: '请输入用户账号' }]"
        >
          <Input v-model:value="formState.userName" placeholder="请输入登录账号" />
        </Form.Item>
        <Form.Item
          label="用户昵称"
          name="nickName"
          :rules="[{ required: true, message: '请输入用户昵称' }]"
        >
          <Input v-model:value="formState.nickName" placeholder="如：张三" />
        </Form.Item>
        <Form.Item label="手机号码" name="phonenumber">
          <Input v-model:value="formState.phonenumber" placeholder="请输入手机号码" />
        </Form.Item>
        <Form.Item label="邮箱" name="email">
          <Input v-model:value="formState.email" placeholder="请输入邮箱" />
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
