<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { DepartmentApi } from '#/api/system/department';
import type { UserApi } from '#/api/system/user';

import { computed, onMounted, reactive, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';

import dayjs from 'dayjs';
import {
  ElButton,
  ElCard,
  ElCheckbox,
  ElCheckboxGroup,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElPagination,
  ElRow,
  ElTag,
} from 'element-plus';

import { useVbenForm, z } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDepartmentFullTreeApi } from '#/api/system/department';
import { getAllRolesApi } from '#/api/system/role';
import {
  assignUserRolesApi,
  createUserApi,
  deleteUserApi,
  getUserDetailApi,
  getUserListApi,
  getUserRolesApi,
  updateUserApi,
  updateUserStatusApi,
} from '#/api/system/user';

// 状态映射
const statusMap = {
  '0': { text: '正常', type: 'success' },
  '8': { text: '封禁', type: 'danger' },
  '9': { text: '删除', type: 'info' },
} as const;

// 表格数据
const tableData = ref<UserApi.UserInfo[]>([]);
const loading = ref(false);
const pagination = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 10,
});

// 对话框状态
const dialogVisible = ref(false);
const dialogTitle = ref('');
const isEdit = ref(false);
const currentUserId = ref<number>();

// 角色分配对话框
const assignRoleDialogVisible = ref(false);
const currentAssignUser = ref<{ userId: number; userName: string }>();
const roleOptions = ref<
  { roleCode: string; roleDesc?: string; roleId: number; roleName: string }[]
>([]);
const selectedRoleCodes = ref<string[]>([]);
const loadingRoles = ref(false);

// 部门数据
const departmentTreeData = ref<DepartmentApi.DepartmentTreeTableNode[]>([]);

// 查询表单
const [QueryForm, queryForm] = useVbenForm({
  collapsed: true,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户名',
        clearable: true,
      },
      fieldName: 'userName',
      label: '用户名',
    },
  ],
  showCollapseButton: false,
  submitButtonOptions: {
    content: '查询',
  },
  resetButtonOptions: {
    content: '重置',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-3',
});

// 响应式表单 Schema
const userFormSchema = computed(() => [
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入用户名',
      disabled: isEdit.value,
    },
    fieldName: 'userName',
    label: '用户名',
    rules: z
      .string()
      .min(3, { message: '用户名至少3个字符' })
      .max(50, { message: '用户名最多50个字符' })
      .regex(/^\w{3,50}$/, '用户名只能包含字母、数字和下划线'),
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入显示名称',
    },
    fieldName: 'displayName',
    label: '显示名称',
    rules: z
      .string()
      .min(2, { message: '显示名称至少2个字符' })
      .max(100, { message: '显示名称最多100个字符' }),
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入邮箱',
    },
    fieldName: 'email',
    label: '邮箱',
    rules: z
      .string()
      .email('请输入正确的邮箱地址')
      .or(z.literal(''))
      .optional(),
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入手机号',
    },
    fieldName: 'phone',
    label: '手机号',
    rules: z
      .string()
      .regex(/^1[3-9]\d{9}$/, '请输入正确的手机号')
      .or(z.literal(''))
      .optional(),
  },
  {
    component: 'TreeSelect',
    componentProps: () => ({
      placeholder: '请选择部门（可多选）',
      data: departmentTreeData.value,
      nodeKey: 'depCode',
      props: {
        label: 'depName',
      },
      multiple: true,
      clearable: true,
      filterable: true,
      showCheckbox: true,
      checkStrictly: true, // 允许选择任何层级的节点，包括父级节点
      defaultExpandAll: false,
      expandOnClickNode: false,
    }),
    fieldName: 'departmentCodes',
    label: '所属部门',
    rules: z.array(z.string()).min(1, { message: '至少选择一个部门' }),
  },
]);

// VbenForm 用户表单
const [UserForm, userFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: handleSave,
  layout: 'vertical',
  showDefaultActions: false,
  schema: userFormSchema.value,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

// 监听 isEdit 变化，动态更新表单 schema
watch(
  isEdit,
  () => {
    userFormApi.setState({
      schema: userFormSchema.value,
    });
  },
  { immediate: false },
);

// 格式化时间
function formatDateTime(dateTime?: string): string {
  if (!dateTime) return '';
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
}

// 获取状态标签类型
function getStatusTagType(status: string): 'danger' | 'info' | 'success' {
  return statusMap[status as keyof typeof statusMap]?.type || 'info';
}

// 获取状态文本
function getStatusText(status: string): string {
  return statusMap[status as keyof typeof statusMap]?.text || '未知';
}

// VxeTable配置
const gridOptions: VxeGridProps<UserApi.UserInfo> = {
  columns: [
    { type: 'seq', width: 70, title: '序号' },
    {
      field: 'userId',
      title: '用户ID',
      width: 80,
      align: 'center',
    },
    {
      field: 'userName',
      title: '用户名',
      minWidth: 120,
      showOverflow: 'tooltip',
    },
    {
      field: 'displayName',
      title: '显示名称',
      minWidth: 120,
      showOverflow: 'tooltip',
    },
    {
      field: 'email',
      title: '邮箱',
      minWidth: 160,
      showOverflow: 'tooltip',
    },
    {
      field: 'phone',
      title: '手机号',
      width: 130,
    },
    {
      field: 'departmentCodes',
      title: '所属部门',
      minWidth: 150,
      slots: { default: 'department' },
    },
    {
      field: 'status',
      title: '状态',
      width: 90,
      slots: { default: 'status' },
    },
    {
      field: 'createdTime',
      title: '创建时间',
      width: 160,
      slots: { default: 'createdTime' },
    },
    {
      title: '操作',
      width: 220,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ],
  data: [],
  pagerConfig: {
    enabled: false,
  },
  loading: false,
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

// 加载用户列表
async function loadUserList() {
  loading.value = true;
  gridOptions.loading = true;
  try {
    const queryParams = queryForm.form.values;
    const params: UserApi.UserListParams = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      userName: queryParams?.userName || undefined,
    };

    const response = await getUserListApi(params);

    tableData.value = response.list;
    pagination.total = response.total;
    pagination.pageNum = response.pageNum;

    // 更新VxeTable数据（参照role方式）
    gridApi.setState({
      gridOptions: {
        data: response.list,
      },
    });
  } catch (error) {
    // ElMessage.error('加载用户列表失败');
    console.error('Load user list error:', error);
  } finally {
    loading.value = false;
    gridOptions.loading = false;
  }
}

// 处理查询表单提交
function onSubmit(_values: Record<string, any>) {
  pagination.pageNum = 1;
  loadUserList();
}

// 分页变化
function handlePageChange(page: number) {
  pagination.pageNum = page;
  loadUserList();
}

function handleSizeChange(size: number) {
  pagination.pageSize = size;
  pagination.pageNum = 1;
  loadUserList();
}

// 新增用户
function handleAdd() {
  dialogTitle.value = '新增用户';
  isEdit.value = false;
  currentUserId.value = undefined;
  dialogVisible.value = true;

  // 重置表单并设置默认值
  userFormApi.resetForm();
  userFormApi.setValues({
    departmentCodes: [], // 设置默认的空部门数组
  });
}

// 编辑用户
async function handleEdit(userId: number) {
  try {
    dialogTitle.value = '编辑用户';
    isEdit.value = true;
    currentUserId.value = userId;
    const response = await getUserDetailApi({ userId });

    // 设置表单值，确保部门编码列表正确处理
    userFormApi.setValues({
      ...response,
      // 确保 departmentCodes 是数组类型
      departmentCodes: response.departmentCodes || [],
    });
    dialogVisible.value = true;
  } catch (error) {
    // ElMessage.error('获取用户详情失败');
    console.error('Get user detail error:', error);
  }
}

// 分配角色
async function handleAssignRole(userId: number, userName: string) {
  try {
    currentAssignUser.value = { userId, userName };
    loadingRoles.value = true;

    // 并行加载角色选项和用户已有角色
    const [, userRoles] = await Promise.all([
      loadRoleOptions(),
      loadUserRoles(userId),
    ]);

    // 设置用户已有的角色为选中状态
    selectedRoleCodes.value = userRoles.roles.map((role) => role.roleCode);

    assignRoleDialogVisible.value = true;
  } catch (error) {
    // ElMessage.error('加载角色信息失败');
    console.error('Load roles error:', error);
  } finally {
    loadingRoles.value = false;
  }
}

// 加载角色选项
async function loadRoleOptions() {
  try {
    const response = await getAllRolesApi();
    roleOptions.value = response || [];
    return response;
  } catch (error) {
    console.error('Load role options error:', error);
    throw error;
  }
}

// 加载用户已有角色
async function loadUserRoles(userId: number) {
  try {
    const response = await getUserRolesApi({ userId });
    return response;
  } catch (error) {
    console.error('Load user roles error:', error);
    throw error;
  }
}

// 确认分配角色
async function handleConfirmAssignRole() {
  if (!currentAssignUser.value) return;

  try {
    await assignUserRolesApi({
      userId: currentAssignUser.value.userId,
      roleCodes: selectedRoleCodes.value,
    });

    ElMessage.success('角色分配成功');
    assignRoleDialogVisible.value = false;
    loadUserList();
  } catch (error) {
    // ElMessage.error('角色分配失败');
    console.error('Assign roles error:', error);
  }
}

// 取消角色分配
function handleCancelAssignRole() {
  assignRoleDialogVisible.value = false;
  selectedRoleCodes.value = [];
  currentAssignUser.value = undefined;
}

// 删除用户
async function handleDelete(userId: number, userName: string) {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${userName}" 吗？`,
      '确认删除',
      {
        type: 'warning',
      },
    );

    await deleteUserApi({ userId });
    ElMessage.success('删除成功');
    loadUserList();
  } catch (error) {
    if (error !== 'cancel') {
      // ElMessage.error('删除失败');
      console.error('Delete user error:', error);
    }
  }
}

// 更新用户状态
async function handleStatusChange(userId: number, status: '0' | '8' | '9') {
  try {
    await updateUserStatusApi({ userId, status });
    ElMessage.success('状态更新成功');
    loadUserList();
  } catch (error) {
    // ElMessage.error('状态更新失败');
    console.error('Update user status error:', error);
  }
}

// 保存用户
async function handleSave() {
  const values = await userFormApi.getValues();
  try {
    if (isEdit.value && currentUserId.value) {
      // 更新用户 - 确保只发送允许的字段
      const updateData: UserApi.UpdateUserParams = {
        userId: currentUserId.value,
        displayName: values.displayName,
        email: values.email || undefined,
        phone: values.phone || undefined,
        departmentCodes: values.departmentCodes || [],
      };
      await updateUserApi(updateData);
      ElMessage.success('更新成功');
    } else {
      // 创建用户 - 确保只发送允许的字段
      const createData: UserApi.CreateUserParams = {
        userName: values.userName,
        displayName: values.displayName,
        email: values.email || undefined,
        phone: values.phone || undefined,
        departmentCodes: values.departmentCodes || [],
      };
      await createUserApi(createData);
      ElMessage.success('创建成功');
    }

    dialogVisible.value = false;
    loadUserList();
  } catch (error) {
    // ElMessage.error(isEdit.value ? '更新失败' : '创建失败');
    console.error('Save user error:', error);
    throw error; // 重新抛出错误，阻止表单关闭
  }
}

// 取消
function handleCancel() {
  dialogVisible.value = false;
  userFormApi.resetForm();
}

// 加载部门数据
async function loadDepartmentData() {
  try {
    const params: DepartmentApi.GetDepartmentFullTreeRequest = {
      includeDisabled: false,
      expandAll: true,
    };
    const response = await getDepartmentFullTreeApi(params);
    departmentTreeData.value = response || [];
  } catch (error) {
    console.error('Load department data error:', error);
    departmentTreeData.value = [];
  }
}

// 初始化
onMounted(() => {
  loadUserList();
  loadDepartmentData();
});
</script>

<template>
  <Page>
    <!-- 查询表单 -->
    <ElCard>
      <QueryForm />
    </ElCard>

    <!-- 主内容区域 -->
    <ElCard class="mt-3 w-full">
      <Grid>
        <template #toolbar-actions>
          <ElButton
            type="primary"
            @click="handleAdd"
            v-access:code="'USER_ADD'"
          >
            新增用户
          </ElButton>
        </template>

        <!-- 部门列插槽 -->
        <template #department="{ row }">
          <span v-if="row.departmentCodes && row.departmentCodes.length > 0">
            {{ row.departmentCodes.join(', ') }}
          </span>
          <span v-else class="text-muted-foreground">-</span>
        </template>

        <!-- 状态列插槽 -->
        <template #status="{ row }">
          <ElTag :type="getStatusTagType(row.status)">
            {{ getStatusText(row.status) }}
          </ElTag>
        </template>

        <!-- 创建时间列插槽 -->
        <template #createdTime="{ row }">
          <span>{{ formatDateTime(row.createdTime) }}</span>
        </template>

        <!-- 操作列插槽 -->
        <template #action="{ row }">
          <ElButton
            type="primary"
            link
            size="small"
            @click="handleEdit(row.userId)"
            v-access:code="'USER_EDIT'"
          >
            编辑
          </ElButton>
          <ElButton
            v-if="row.status === '0'"
            type="warning"
            link
            size="small"
            @click="handleStatusChange(row.userId, '8')"
            v-access:code="'USER_BAN'"
          >
            封禁
          </ElButton>
          <ElButton
            v-if="row.status === '8'"
            type="success"
            link
            size="small"
            @click="handleStatusChange(row.userId, '0')"
            v-access:code="'USER_BAN'"
          >
            启用
          </ElButton>
          <ElButton
            type="primary"
            link
            size="small"
            @click="handleAssignRole(row.userId, row.userName)"
            v-access:code="'USER_ASSIGN_ROLES'"
          >
            分配角色
          </ElButton>
          <ElButton
            type="danger"
            link
            size="small"
            @click="handleDelete(row.userId, row.userName)"
            v-access:code="'USER_DELETE'"
          >
            删除
          </ElButton>
        </template>
      </Grid>

      <!-- 分页组件 -->
      <ElRow class="mt-4" justify="end">
        <ElPagination
          v-model:current-page="pagination.pageNum"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </ElRow>
    </ElCard>

    <!-- 新增/编辑用户对话框 -->
    <ElDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
    >
      <UserForm :disabled="{ userName: isEdit }" />

      <template #footer>
        <ElButton @click="handleCancel">取消</ElButton>
        <ElButton type="primary" @click="handleSave">确定</ElButton>
      </template>
    </ElDialog>

    <!-- 角色分配对话框 -->
    <ElDialog
      v-model="assignRoleDialogVisible"
      title="分配角色"
      width="600px"
      @close="handleCancelAssignRole"
    >
      <div v-loading="loadingRoles" class="space-y-4">
        <div class="text-muted-foreground text-sm">
          为用户
          <span class="font-medium">{{ currentAssignUser?.userName }}</span>
          分配角色，选择的角色将覆盖用户现有角色
        </div>

        <div class="space-y-3">
          <div class="text-sm font-medium">选择角色：</div>
          <ElCheckboxGroup v-model="selectedRoleCodes" class="space-y-3">
            <div
              v-for="role in roleOptions"
              :key="role.roleCode"
              class="hover:bg-accent/50 flex items-start space-x-3 rounded-md border p-3"
            >
              <ElCheckbox
                :value="role.roleCode"
                :label="role.roleCode"
                class="mt-1"
              />
              <div class="min-w-0 flex-1">
                <div class="text-sm font-medium">{{ role.roleName }}</div>
                <div
                  class="text-muted-foreground mt-1 text-xs"
                  v-if="role.roleDesc"
                >
                  {{ role.roleDesc }}
                </div>
                <div class="text-muted-foreground mt-1 text-xs">
                  角色编码: {{ role.roleCode }}
                </div>
              </div>
            </div>
          </ElCheckboxGroup>

          <div
            v-if="roleOptions.length === 0 && !loadingRoles"
            class="text-muted-foreground py-4 text-center"
          >
            暂无可分配的角色
          </div>
        </div>
      </div>

      <template #footer>
        <ElButton @click="handleCancelAssignRole">取消</ElButton>
        <ElButton
          type="primary"
          :loading="loadingRoles"
          @click="handleConfirmAssignRole"
        >
          确定
        </ElButton>
      </template>
    </ElDialog>
  </Page>
</template>
