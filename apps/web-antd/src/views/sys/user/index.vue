<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Card, Table, Button, Input, Row, Col, Tree, Tag, Modal, Form, message, Popconfirm } from 'ant-design-vue';
import { sysUserApi, sysDeptApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const searchParams = ref({ userName: '', phonenumber: '', deptId: undefined });

// 部门树
const deptTreeData = ref([]);

// 弹窗与表单状态
const isModalVisible = ref(false);
const isSubmitLoading = ref(false);
const formRef = ref();
const formState = ref<any>({
  userName: '',
  nickName: '',
  phonenumber: '',
  deptId: undefined,
  status: '0',
});

const openModal = () => {
  formState.value = { userName: '', nickName: '', phonenumber: '', deptId: undefined, status: '0' };
  isModalVisible.value = true;
};

const openEditModal = (record: any) => {
  formState.value = { ...record };
  isModalVisible.value = true;
};

const handleDelete = async (id: number) => {
  try {
    await sysUserApi.remove(id);
    message.success('删除用户成功');
    fetchList();
  } catch (error) {
    console.error('Delete error:', error);
  }
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
    fetchList(1);
  } catch (error) {
    console.error('Submit error:', error);
  } finally {
    isSubmitLoading.value = false;
  }
};

const columns = [
  { title: '用户账号', dataIndex: 'userName', key: 'userName' },
  { title: '用户昵称', dataIndex: 'nickName', key: 'nickName' },
  { title: '部门', dataIndex: 'deptId', key: 'deptId' }, // 此处需关联查询或者前端映射，为演示暂显id
  { title: '手机号码', dataIndex: 'phonenumber', key: 'phonenumber' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作', key: 'action', width: 200 }
];

const fetchDepts = async () => {
  const depts = await sysDeptApi.getList();
  // listToTree ...
  deptTreeData.value = depts.map(d => ({ title: d.deptName, key: d.deptId }));
};

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysUserApi.getList({ page, pageSize: pagination.value.pageSize, ...searchParams.value });
    dataSource.value = res?.items || [];
    pagination.value.current = page;
    pagination.value.total = res?.total || 0;
  } finally {
    loading.value = false;
  }
};

const handleDeptSelect = (keys: any[]) => {
  searchParams.value.deptId = keys[0];
  fetchList(1);
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
          <Card :bordered="false" class="h-full">
            <div class="mb-4 flex gap-4">
              <Input v-model:value="searchParams.userName" placeholder="用户账号" class="w-48" allowClear />
              <Input v-model:value="searchParams.phonenumber" placeholder="手机号码" class="w-48" allowClear />
              <Button type="primary" @click="fetchList(1)">查询</Button>
              <Button @click="() => { searchParams.userName = ''; searchParams.phonenumber = ''; fetchList(1); }">重置</Button>
              <Button type="primary" ghost class="ml-auto" @click="openModal">新增用户</Button>
            </div>
            
            <Table 
              :columns="columns" 
              :dataSource="dataSource" 
              :loading="loading" 
              :pagination="pagination"
              @change="(pag) => fetchList(pag.current)"
              rowKey="userId"
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
    
    <!-- 编辑/新增用户弹窗 -->
    <Modal
      v-model:open="isModalVisible"
      :title="formState.userId ? '编辑用户' : '新增用户'"
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
        <Form.Item label="用户账号" name="userName" :rules="[{ required: true, message: '请输入用户账号' }]">
          <Input v-model:value="formState.userName" placeholder="请输入登入时的账号" />
        </Form.Item>
        <Form.Item label="用户昵称" name="nickName" :rules="[{ required: true, message: '请输入用户昵称' }]">
          <Input v-model:value="formState.nickName" placeholder="如: 张三" />
        </Form.Item>
        <Form.Item label="手机号码" name="phonenumber">
          <Input v-model:value="formState.phonenumber" placeholder="请输入绑定的手机" />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Input v-model:value="formState.status" placeholder="0为正常，1为停用" />
        </Form.Item>
      </Form>
    </Modal>
  </Page>
</template>
