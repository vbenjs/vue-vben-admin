<script setup lang="ts">
// @ts-nocheck
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Table,
  Tree,
  TreeSelect,
  Upload,
} from 'ant-design-vue';

import {
  sysDeptApi,
  sysPostApi,
  sysRoleApi,
  sysUserApi,
} from '#/api/core/sys-manage';
import StatusTag from '#/components/StatusTag/index.vue';
import { useCrudTable } from '#/composables/useCrudTable';

const router = useRouter();

const defaultForm = () => ({
  userName: '',
  nickName: '',
  sex: '0',
  phonenumber: '',
  email: '',
  deptId: undefined,
  roleIds: [],
  postIds: [],
  status: '0',
  remark: '',
  avatar: '',
  signature: '',
});

const {
  loading,
  dataSource,
  pagination,
  isModalVisible,
  submitting,
  formRef,
  formState,
  fetchList,
  handleSubmit,
  handleDelete,
} = useCrudTable({
  api: sysUserApi,
  rowKey: 'userId',
  defaultFormState: defaultForm(),
  messages: {
    createSuccess: '用户新增成功，默认密码为 123456',
    updateSuccess: '用户更新成功',
    deleteSuccess: '删除成功',
  },
});

const batchLoading = ref(false);
const selectedRowKeys = ref<Array<number | string>>([]);
const selectedDeptKeys = ref<Array<number | string>>([]);
const searchParams = ref({
  userName: '',
  phonenumber: '',
  status: undefined,
  deptId: undefined,
});

const deptRawList = ref<any[]>([]);
const deptTreeData = ref<any[]>([]);
const roleOptions = ref<any[]>([]);
const postOptions = ref<any[]>([]);

const buildDeptTree = (list: any[], parentId = 0): any[] => {
  return list
    .filter((item) => Number(item.parentId ?? 0) === Number(parentId))
    .map((item) => ({
      title: item.deptName,
      key: item.deptId,
      value: item.deptId,
      orderNum: item.orderNum,
      children: buildDeptTree(list, item.deptId),
    }))
    .sort((a, b) => (a.orderNum ?? 0) - (b.orderNum ?? 0));
};

const columns = [
  { title: '用户账号', dataIndex: 'userName', key: 'userName', width: 150 },
  { title: '用户昵称', dataIndex: 'nickName', key: 'nickName', width: 150 },
  { title: '所属组织', dataIndex: 'deptName', key: 'deptName', width: 180 },
  { title: '岗位', dataIndex: 'postNames', key: 'postNames', width: 200 },
  { title: '角色', dataIndex: 'roleNames', key: 'roleNames', width: 200 },
  {
    title: '手机号码',
    dataIndex: 'phonenumber',
    key: 'phonenumber',
    width: 140,
  },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
  { title: '操作', key: 'action', width: 170, fixed: 'right' },
];

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  preserveSelectedRowKeys: true,
  onChange: (keys: Array<number | string>) => {
    selectedRowKeys.value = keys;
  },
}));

const totalUsers = computed(() => pagination.value.total || 0);
const enabledUsers = computed(
  () => dataSource.value.filter((item: any) => item.status === '0').length,
);
const disabledUsers = computed(
  () => dataSource.value.filter((item: any) => item.status === '1').length,
);
const selectedCount = computed(() => selectedRowKeys.value.length);
const deptCount = computed(() => deptRawList.value.length);
const postCount = computed(() => postOptions.value.length);
const roleCount = computed(() => roleOptions.value.length);

const formatDate = (value: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';

const doFetch = async (page = 1) => {
  await fetchList(page, searchParams.value);
};

const fetchDepts = async () => {
  const depts = await sysDeptApi.getList().catch(() => []);
  deptRawList.value = depts || [];
  deptTreeData.value = buildDeptTree(depts || []);
};

const fetchRoles = async () => {
  try {
    const res = await sysRoleApi.getList({ pageSize: 200 });
    roleOptions.value = (res?.items || []).map((item) => ({
      label: item.roleName,
      value: item.roleId,
    }));
  } catch {
    roleOptions.value = [];
  }
};

const fetchPosts = async () => {
  try {
    const res = await sysPostApi.getList({ pageSize: 200 });
    postOptions.value = (res?.items || []).map((item) => ({
      label: item.postName,
      value: item.postId,
    }));
  } catch {
    postOptions.value = [];
  }
};

const resetFilters = async () => {
  selectedDeptKeys.value = [];
  searchParams.value = {
    userName: '',
    phonenumber: '',
    status: undefined,
    deptId: undefined,
  };
  selectedRowKeys.value = [];
  await doFetch(1);
};

const handleDeptSelect = async (keys: any) => {
  selectedDeptKeys.value = keys;
  searchParams.value.deptId = keys?.[0];
  await doFetch(1);
};

const clearSelection = () => {
  selectedRowKeys.value = [];
};

const getSelectedRecords = () =>
  dataSource.value.filter((item: any) =>
    selectedRowKeys.value.some((key) => `${key}` === `${item.userId}`),
  );

const handleBatchStatus = async (status: string) => {
  const records = getSelectedRecords();
  if (records.length === 0) {
    message.warning('请先选择用户');
    return;
  }
  batchLoading.value = true;
  try {
    let changedCount = 0;
    for (const record of records) {
      if (record.status === status) continue;
      await sysUserApi.update(record.userId, {
        ...record,
        roleIds: record.roleIds || [],
        postIds: record.postIds || [],
        status,
      });
      changedCount += 1;
    }
    message.success(
      changedCount > 0 ? `已处理${changedCount}个用户` : '所选用户状态无需调整',
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
    message.warning('请先选择用户');
    return;
  }
  Modal.confirm({
    title: '确定删除选中的用户吗？',
    content: `共 ${records.length} 个用户，删除后不可恢复。`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { danger: true },
    centered: true,
    onOk: async () => {
      batchLoading.value = true;
      try {
        for (const record of records) {
          await sysUserApi.remove(record.userId);
        }
        message.success(`已删除${records.length}个用户`);
        clearSelection();
        await doFetch(pagination.value.current);
      } finally {
        batchLoading.value = false;
      }
    },
  });
};

const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => resolve(reader.result));
    reader.onerror = (error) => reject(error);
  });
};

const beforeAvatarUpload = async (file: File) => {
  formState.value.avatar = (await getBase64(file)) as string;
  return false;
};

const beforeSignatureUpload = async (file: File) => {
  formState.value.signature = (await getBase64(file)) as string;
  return false;
};

const openModalCustom = async (record?: any) => {
  if (record) {
    submitting.value = true;
    try {
      const detail = await sysUserApi.getById(record.userId);
      formState.value = {
        ...defaultForm(),
        ...detail,
        roleIds: detail.roleIds || [],
        postIds: detail.postIds || [],
      };
    } catch (error) {
      console.error(error);
      formState.value = {
        ...defaultForm(),
        ...record,
        roleIds: record.roleIds || [],
        postIds: record.postIds || [],
      };
    } finally {
      submitting.value = false;
    }
  } else {
    formState.value = defaultForm();
  }
  isModalVisible.value = true;
};

onMounted(async () => {
  await Promise.all([fetchDepts(), fetchRoles(), fetchPosts(), doFetch(1)]);
});
</script>

<template>
  <Page>
    <div class="p-4">

      <Row :gutter="16">
        <Col :span="6">
          <Card title="组织筛选" :bordered="false" class="h-full">
            <div class="mb-3 text-xs text-gray-500">
              点击组织节点筛选所属用户，清空筛选可查看全部用户。
            </div>
            <Tree
              v-model:selected-keys="selectedDeptKeys"
              :tree-data="deptTreeData"
              class="max-h-[620px] overflow-y-auto rounded border border-gray-100 p-2"
              @select="handleDeptSelect"
            />
            <div class="mt-3">
              <Button block @click="resetFilters">清空组织筛选</Button>
            </div>
          </Card>
        </Col>

        <Col :span="18">
          <Card :bordered="false">
            <div class="mb-4 flex flex-wrap gap-3">
              <Input
                v-model:value="searchParams.userName"
                placeholder="用户账号"
                class="w-40"
                allow-clear
              />
              <Input
                v-model:value="searchParams.phonenumber"
                placeholder="手机号码"
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
                + 新增用户
              </Button>
            </div>

            <div
              class="mb-3 flex flex-wrap items-center gap-3 rounded bg-gray-50 px-3 py-2 text-sm text-gray-600"
            >
              <span>已选 {{ selectedCount }} 个用户</span>
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
              row-key="userId"
              bordered
              size="middle"
              :scroll="{ x: 1460 }"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'postNames'">
                  <span>{{ (record.postNames || []).join(' / ') || '-' }}</span>
                </template>
                <template v-if="column.key === 'roleNames'">
                  <span>{{ (record.roleNames || []).join(' / ') || '-' }}</span>
                </template>
                <template v-if="column.key === 'status'">
                  <StatusTag :status="record.status" />
                </template>
                <template v-if="column.key === 'createTime'">
                  {{ formatDate(record.createTime) }}
                </template>
                <template v-if="column.key === 'action'">
                  <Button
                    type="link"
                    size="small"
                    @click="openModalCustom(record)"
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="确定删除该用户吗？"
                    @confirm="handleDelete(record.userId)"
                  >
                    <Button type="link" danger size="small">删除</Button>
                  </Popconfirm>
                </template>
              </template>
            </Table>
          </Card>
        </Col>
      </Row>

      <Modal
        v-model:open="isModalVisible"
        :title="formState.userId ? '编辑用户' : '新增用户'"
        @ok="handleSubmit()"
        :confirm-loading="submitting"
        destroy-on-close
        width="880px"
      >
        <Form
          ref="formRef"
          :model="formState"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 19 }"
          class="mt-4"
        >
          <Row :gutter="16">
            <Col :span="12">
              <Form.Item
                label="用户账号"
                name="userName"
                :rules="[{ required: true, message: '请输入用户账号' }]"
              >
                <Input
                  v-model:value="formState.userName"
                  placeholder="请输入用户账号"
                />
              </Form.Item>
            </Col>
            <Col :span="12">
              <Form.Item
                label="用户昵称"
                name="nickName"
                :rules="[{ required: true, message: '请输入用户昵称' }]"
              >
                <Input
                  v-model:value="formState.nickName"
                  placeholder="请输入用户昵称"
                />
              </Form.Item>
            </Col>
            <Col :span="12">
              <Form.Item label="所属组织" name="deptId">
                <TreeSelect
                  v-model:value="formState.deptId"
                  :tree-data="deptTreeData"
                  placeholder="请选择所属组织"
                  allow-clear
                  tree-default-expand-all
                />
              </Form.Item>
            </Col>
            <Col :span="12">
              <Form.Item label="岗位" name="postIds">
                <Select
                  v-model:value="formState.postIds"
                  mode="multiple"
                  :options="postOptions"
                  placeholder="请选择岗位"
                  allow-clear
                />
              </Form.Item>
            </Col>
            <Col :span="12">
              <Form.Item label="角色" name="roleIds">
                <Select
                  v-model:value="formState.roleIds"
                  mode="multiple"
                  :options="roleOptions"
                  placeholder="请选择角色"
                  allow-clear
                />
              </Form.Item>
            </Col>
            <Col :span="12">
              <Form.Item label="手机号码" name="phonenumber">
                <Input
                  v-model:value="formState.phonenumber"
                  placeholder="请输入手机号码"
                />
              </Form.Item>
            </Col>
            <Col :span="12">
              <Form.Item label="邮箱" name="email">
                <Input
                  v-model:value="formState.email"
                  placeholder="请输入邮箱"
                />
              </Form.Item>
            </Col>
            <Col :span="12">
              <Form.Item label="性别" name="sex">
                <Radio.Group v-model:value="formState.sex">
                  <Radio value="0">男</Radio><Radio value="1">女</Radio
                  ><Radio value="2">未知</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col :span="12">
              <Form.Item label="状态" name="status">
                <Radio.Group v-model:value="formState.status">
                  <Radio value="0">正常</Radio><Radio value="1">停用</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col :span="12">
              <Form.Item label="头像">
                <Upload
                  :before-upload="beforeAvatarUpload"
                  :show-upload-list="false"
                >
                  <Button>上传头像</Button>
                </Upload>
                <div v-if="formState.avatar" class="mt-2">
                  <img
                    :src="formState.avatar"
                    alt="avatar"
                    class="h-14 w-14 rounded-full border"
                  />
                </div>
              </Form.Item>
            </Col>
            <Col :span="12">
              <Form.Item label="签名">
                <Upload
                  :before-upload="beforeSignatureUpload"
                  :show-upload-list="false"
                >
                  <Button>上传签名</Button>
                </Upload>
                <div
                  v-if="formState.signature"
                  class="mt-2 rounded border bg-white p-2"
                >
                  <img
                    :src="formState.signature"
                    alt="signature"
                    class="max-h-14"
                  />
                </div>
              </Form.Item>
            </Col>
          </Row>
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
