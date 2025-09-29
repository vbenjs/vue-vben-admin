<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { PermissionApi } from '#/api/system/permission';
import type { PermissionGroupApi } from '#/api/system/permissionGroup';

import { onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import dayjs from 'dayjs';
import {
  ElButton,
  ElCard,
  ElCol,
  ElDialog,
  ElInput,
  ElMessage,
  ElMessageBox,
  ElPagination,
  ElRow,
  ElTag,
} from 'element-plus';

import { useVbenForm, z } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createPermApi,
  deletePermApi,
  getPermDetailApi,
  getPermListApi,
  updatePermApi,
} from '#/api/system/permission';
import {
  createPermGroupApi,
  deletePermGroupApi,
  getPermGroupListApi,
  updatePermGroupApi,
} from '#/api/system/permissionGroup';

defineOptions({ name: 'Permission' });

// 状态映射
const statusMap = {
  '0': { text: '启用', type: 'success' },
  '1': { text: '禁用', type: 'danger' },
} as const;

// 权限类型映射
const permTypeMap = {
  '0': { text: '无需鉴权', type: 'warning' },
  '1': { text: '需要登录', type: 'warning' },
  '2': { text: '严格鉴权', type: 'success' },
} as const;

// 服务模块映射
const serviceModuleMap = {
  AUTH: { text: '鉴权服务', type: 'primary' },
} as const;

// HTTP方法映射
const httpMethodMap = {
  GET: { text: 'GET', type: 'success' },
  POST: { text: 'POST', type: 'primary' },
  PUT: { text: 'PUT', type: 'warning' },
  DELETE: { text: 'DELETE', type: 'danger' },
} as const;

// ===== 权限组相关状态 =====
const permGroupList = ref<PermissionGroupApi.PermGroupListResponse[]>([]);
const filteredPermGroupList = ref<PermissionGroupApi.PermGroupListResponse[]>(
  [],
);
const selectedGroupId = ref<null | number>(null);
const groupLoading = ref(false);
const groupSearchKeyword = ref('');

// 权限组对话框
const groupDialogVisible = ref(false);
const groupDialogTitle = ref('');
const isEditGroup = ref(false);
const currentPermGroupId = ref<number>();

// ===== 权限相关状态 =====
const tableData = ref<PermissionApi.PermListResponse[]>([]);
const loading = ref(false);
const pagination = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 10,
});

// 权限对话框状态
const dialogVisible = ref(false);
const dialogTitle = ref('');
const isEdit = ref(false);
const currentPermId = ref<number>();

// 权限查询表单
const [QueryForm, queryForm] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: onSubmit,
  handleReset: onReset,
  layout: 'horizontal',
  schema: [
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择权限类型',
        clearable: true,
        options: [
          { label: '无需权限', value: '0' },
          { label: '需要登录', value: '1' },
          { label: '严格鉴权', value: '2' },
        ],
      },
      fieldName: 'permType',
      label: '权限类型',
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        clearable: true,
        options: [
          { label: '启用', value: '0' },
          { label: '禁用', value: '1' },
        ],
      },
      fieldName: 'permStatus',
      label: '状态',
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

// VbenForm 权限表单
const [PermissionForm, permissionFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'vertical',
  showDefaultActions: false,
  schema: [
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属服务',
        options: [{ label: '鉴权服务', value: 'AUTH' }],
      },
      fieldName: 'service',
      label: '所属服务',
      rules: z.string().min(1, { message: '请选择所属服务' }),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入权限前缀，如：/auth',
      },
      fieldName: 'permPrefix',
      label: '权限前缀',
      rules: z
        .string()
        .min(2, { message: '权限前缀至少2个字符' })
        .max(64, { message: '权限前缀最多64个字符' })
        .regex(
          /^\/[\w-]+(?:\/[\w-]+)*$/,
          '权限前缀格式错误，应为：/xx或/xx/xx类似格式',
        ),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入权限编码',
      },
      fieldName: 'permCode',
      label: '权限编码',
      rules: z
        .string()
        .min(2, { message: '权限编码至少2个字符' })
        .max(64, { message: '权限编码最多64个字符' }),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入权限名称',
      },
      fieldName: 'permName',
      label: '权限名称',
      rules: z
        .string()
        .min(2, { message: '权限名称至少2个字符' })
        .max(64, { message: '权限名称最多64个字符' }),
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择权限类型',
        options: [
          { label: '无需权限', value: '0' },
          { label: '需要登录', value: '1' },
          { label: '严格鉴权', value: '2' },
        ],
      },
      fieldName: 'permType',
      label: '权限类型',
      rules: z.string().min(1, { message: '请选择权限类型' }),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入权限路径，如：/auth/login',
      },
      fieldName: 'permPath',
      label: '权限路径',
      rules: z
        .string()
        .min(2, { message: '权限路径至少2个字符' })
        .max(255, { message: '权限路径最多255个字符' })
        .regex(
          /^\/[\w-]+(?:\/[\w-]+)*$/,
          '权限路径格式错误，应为：/xx/xxx类似格式',
        ),
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择权限方法',
        options: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'DELETE', value: 'DELETE' },
        ],
      },
      fieldName: 'permMethod',
      label: '权限方法',
      rules: z.string().min(1, { message: '请选择权限方法' }),
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '启用', value: '0' },
          { label: '禁用', value: '1' },
        ],
      },
      fieldName: 'permStatus',
      label: '状态',
      defaultValue: '0',
      rules: z.string().min(1, { message: '请选择状态' }),
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择权限组(为空为全部权限分组)',
        options: permGroupList,
        props: {
          label: 'permGroupName',
          value: 'permGroupCode',
        },
        clearable: true,
      },
      fieldName: 'permGroupCode',
      label: '权限组',
      rules: z.string().optional(),
    },
    {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入权限说明',
        rows: 3,
      },
      fieldName: 'permDesc',
      label: '权限说明',
      rules: z.string().optional(),
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

// VbenForm 权限组表单
const [PermissionGroupForm, permissionGroupFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: handleSaveGroup,
  layout: 'vertical',
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入权限组编码，如：auth.user',
      },
      fieldName: 'permGroupCode',
      label: '权限组编码',
      rules: z
        .string()
        .min(2, { message: '权限组编码至少2个字符' })
        .max(64, { message: '权限组编码最多64个字符' })
        .regex(
          /^[a-z][\w.]*$/i,
          '权限组编码只能包含字母、数字、下划线和点号，且以字母开头',
        ),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入权限组名称',
      },
      fieldName: 'permGroupName',
      label: '权限组名称',
      rules: z
        .string()
        .min(2, { message: '权限组名称至少2个字符' })
        .max(64, { message: '权限组名称最多64个字符' }),
    },
    {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入权限组描述',
        rows: 3,
      },
      fieldName: 'permGroupDesc',
      label: '权限组描述',
      rules: z
        .string()
        .max(255, { message: '权限组描述最多255个字符' })
        .optional(),
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入排序号',
        min: 0,
        max: 9999,
        precision: 0,
        style: { width: '100%' },
      },
      defaultValue: 0,
      fieldName: 'sort',
      label: '排序',
      help: '数字越小排序越靠前，留空将使用默认排序',
    },
  ],
  wrapperClass: 'grid-cols-1',
});

// 格式化时间
function formatDateTime(dateTime?: string): string {
  if (!dateTime) return '';
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
}

// 获取状态标签类型
function getStatusTagType(status: string): 'danger' | 'success' {
  return statusMap[status as keyof typeof statusMap]?.type || 'success';
}

// 获取状态文本
function getStatusText(status: string): string {
  return statusMap[status as keyof typeof statusMap]?.text || '未知';
}

// 获取权限类型标签类型
function getPermTypeTagType(
  permType: string,
): 'primary' | 'success' | 'warning' {
  return permTypeMap[permType as keyof typeof permTypeMap]?.type || 'primary';
}

// 获取权限类型文本
function getPermTypeText(permType: string): string {
  return permTypeMap[permType as keyof typeof permTypeMap]?.text || '未知';
}

// 获取服务模块文本
function getServiceModuleText(serviceModule: string): string {
  return (
    serviceModuleMap[serviceModule as keyof typeof serviceModuleMap]?.text ||
    '未知'
  );
}

// 获取HTTP方法文本
function getHttpMethodText(httpMethod: string): string {
  return (
    httpMethodMap[httpMethod as keyof typeof httpMethodMap]?.text || httpMethod
  );
}

// VxeTable配置
const gridOptions: VxeGridProps<PermissionApi.PermListResponse> = {
  columns: [
    { type: 'seq', width: 70, title: '序号' },
    {
      field: 'service',
      title: '所属服务',
      width: 120,
      slots: { default: 'service' },
    },
    {
      field: 'permPrefix',
      title: '权限前缀',
      minWidth: 100,
      showOverflow: 'tooltip',
    },
    {
      field: 'permPath',
      title: '权限路径',
      minWidth: 160,
      showOverflow: 'tooltip',
    },
    {
      field: 'permCode',
      title: '权限编码',
      minWidth: 180,
      showOverflow: 'tooltip',
    },
    {
      field: 'permName',
      title: '权限名称',
      minWidth: 150,
      showOverflow: 'tooltip',
    },
    {
      field: 'permType',
      title: '权限类型',
      width: 100,
      slots: { default: 'permType' },
    },
    {
      field: 'permMethod',
      title: '权限方法',
      width: 100,
      slots: { default: 'permMethod' },
    },
    {
      field: 'status',
      title: '状态',
      width: 80,
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
      width: 200,
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

// ===== 权限组相关方法 =====
// 加载权限组列表
async function loadPermGroupList() {
  groupLoading.value = true;
  try {
    const response = await getPermGroupListApi();
    permGroupList.value = response || [];
    // 加载完成后执行搜索过滤
    handleGroupSearch();
  } catch (error) {
    // ElMessage.error('加载权限组列表失败');
    console.error('Load permission group list error:', error);
  } finally {
    groupLoading.value = false;
  }
}

// 选择权限组
function selectPermGroup(groupId: null | number) {
  selectedGroupId.value = groupId;
  pagination.pageNum = 1;
  loadPermissionList();
}

// 新增权限组
function handleAddGroup() {
  groupDialogTitle.value = '新增权限组';
  isEditGroup.value = false;
  currentPermGroupId.value = undefined;
  groupDialogVisible.value = true;

  // 重置表单
  permissionGroupFormApi.resetForm();
}

// 编辑权限组
function handleEditGroup(group: PermissionGroupApi.PermGroupListResponse) {
  groupDialogTitle.value = '编辑权限组';
  isEditGroup.value = true;
  currentPermGroupId.value = group.permGroupId;

  // 设置表单值
  permissionGroupFormApi.setValues({
    permGroupCode: group.permGroupCode,
    permGroupName: group.permGroupName,
    permGroupDesc: group.permGroupDesc,
  });
  groupDialogVisible.value = true;
}

// 删除权限组
async function handleDeleteGroup(
  group: PermissionGroupApi.PermGroupListResponse,
) {
  try {
    await ElMessageBox.confirm(
      `确定要删除权限组 "${group.permGroupName}" 吗？`,
      '确认删除',
      {
        type: 'warning',
      },
    );

    await deletePermGroupApi({ permGroupId: group.permGroupId });
    ElMessage.success('删除成功');
    loadPermGroupList();
    // 如果删除的是当前选中的权限组，清空选择
    if (selectedGroupId.value === group.permGroupId) {
      selectedGroupId.value = null;
      tableData.value = [];
    }
  } catch (error) {
    if (error !== 'cancel') {
      // ElMessage.error('删除失败');
      console.error('Delete permission group error:', error);
    }
  }
}

// 保存权限组
async function handleSaveGroup() {
  try {
    // 进行表单验证
    const validationResult = await permissionGroupFormApi.validate();

    if (!validationResult.valid) {
      ElMessage.warning('请根据提示内容填写表单');
      return; // 验证失败，停止执行
    }

    // 验证通过后获取表单值
    const values = await permissionGroupFormApi.getValues();

    if (isEditGroup.value && currentPermGroupId.value) {
      await updatePermGroupApi({
        ...values,
        permGroupId: currentPermGroupId.value,
      } as PermissionGroupApi.UpdatePermGroupRequest);
      ElMessage.success('更新成功');
    } else {
      await createPermGroupApi(
        values as PermissionGroupApi.CreatePermGroupRequest,
      );
      ElMessage.success('创建成功');
    }

    groupDialogVisible.value = false;
    loadPermGroupList();
  } catch (error) {
    // ElMessage.error(isEditGroup.value ? '更新失败' : '创建失败');
    console.error('Save permission group error:', error);
    throw error; // 重新抛出错误，阻止表单关闭
  }
}

// 权限组搜索
function handleGroupSearch(keyword?: string) {
  const searchKeyword =
    keyword === undefined ? groupSearchKeyword.value : keyword;
  groupSearchKeyword.value = searchKeyword;

  const trimmedKeyword = searchKeyword.trim();
  if (trimmedKeyword) {
    // 根据权限组名称和编码进行前端过滤
    const lowerKeyword = trimmedKeyword.toLowerCase();
    filteredPermGroupList.value = permGroupList.value.filter(
      (group) =>
        group.permGroupName.toLowerCase().includes(lowerKeyword) ||
        group.permGroupCode.toLowerCase().includes(lowerKeyword),
    );
    return;
  }
  // 如果搜索关键词为空，显示所有权限组
  filteredPermGroupList.value = permGroupList.value;
}

// ===== 权限相关方法 =====
// 加载权限列表
async function loadPermissionList() {
  loading.value = true;
  gridOptions.loading = true;
  try {
    const queryParams = queryForm.form.values;
    const params: PermissionApi.GetPermListRequest = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      keyword: queryParams?.keyword || undefined,
      permType: queryParams?.permType || undefined,
      permStatus: queryParams?.permStatus || undefined,
      // 如果选择了权限组，添加权限组过滤
      permGroupCode: selectedGroupId.value
        ? permGroupList.value.find(
            (g) => g.permGroupId === selectedGroupId.value,
          )?.permGroupCode
        : undefined,
    };

    const response = await getPermListApi(params);
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
    // ElMessage.error('加载权限列表失败');
    console.error('Load permission list error:', error);
  } finally {
    loading.value = false;
    gridOptions.loading = false;
  }
}

// 处理查询表单提交
function onSubmit(_values: Record<string, any>) {
  pagination.pageNum = 1;
  loadPermissionList();
}

// 处理查询表单重置
function onReset() {
  // 清除权限组选择
  selectedGroupId.value = null;
  // 重置分页
  pagination.pageNum = 1;
  // 重新加载权限列表
  loadPermissionList();
}

// 分页变化
function handlePageChange(page: number) {
  pagination.pageNum = page;
  loadPermissionList();
}

function handleSizeChange(size: number) {
  pagination.pageSize = size;
  pagination.pageNum = 1;
  loadPermissionList();
}

// 新增权限
function handleAdd() {
  dialogTitle.value = '新增权限';
  isEdit.value = false;
  currentPermId.value = undefined;
  dialogVisible.value = true;

  // 重置表单并设置默认值
  permissionFormApi.resetForm();
  const defaultValues: any = {
    permType: '2',
    service: 'AUTH',
    status: '0',
  };

  // 如果选择了权限组，自动填入权限组编码
  if (selectedGroupId.value) {
    const selectedGroup = permGroupList.value.find(
      (g) => g.permGroupId === selectedGroupId.value,
    );
    if (selectedGroup) {
      defaultValues.permGroupCode = selectedGroup.permGroupCode;
    }
  }

  permissionFormApi.setValues(defaultValues);
}

// 编辑权限
async function handleEdit(permId: number) {
  try {
    dialogTitle.value = '编辑权限';
    isEdit.value = true;
    currentPermId.value = permId;
    const response = await getPermDetailApi({ permId });

    // 设置表单值
    permissionFormApi.setValues(response);
    dialogVisible.value = true;
  } catch (error) {
    // ElMessage.error('获取权限详情失败');
    console.error('Get permission detail error:', error);
  }
}

// 删除权限
async function handleDelete(permId: number, permName: string) {
  try {
    await ElMessageBox.confirm(
      `确定要删除权限 "${permName}" 吗？`,
      '确认删除',
      {
        type: 'warning',
      },
    );

    await deletePermApi({ permId });
    ElMessage.success('删除成功');
    loadPermissionList();
  } catch (error) {
    if (error !== 'cancel') {
      // ElMessage.error('删除失败');
      console.error('Delete permission error:', error);
    }
  }
}

// 保存权限
async function handleSave() {
  try {
    // 进行表单验证
    const validationResult = await permissionFormApi.validate();

    if (!validationResult.valid) {
      ElMessage.warning('请根据提示内容填写表单');
      return; // 验证失败，停止执行
    }

    // 验证通过后获取表单值
    const values = await permissionFormApi.getValues();

    if (isEdit.value && currentPermId.value) {
      await updatePermApi({
        ...values,
        permId: currentPermId.value,
      } as PermissionApi.UpdatePermRequest);
      ElMessage.success('更新成功');
    } else {
      await createPermApi(values as PermissionApi.CreatePermRequest);
      ElMessage.success('创建成功');
    }

    dialogVisible.value = false;
    loadPermissionList();
  } catch (error) {
    // ElMessage.error(isEdit.value ? '更新失败' : '创建失败');
    console.error('Save permission error:', error);
    throw error; // 重新抛出错误，阻止表单关闭
  }
}

// 取消
function handleCancel() {
  dialogVisible.value = false;
  permissionFormApi.resetForm();
}

function handleCancelGroup() {
  groupDialogVisible.value = false;
  permissionGroupFormApi.resetForm();
}

// 初始化
onMounted(() => {
  loadPermGroupList();
  // 默认不选择任何权限组，显示全部权限
  loadPermissionList();
});
</script>

<template>
  <Page>
    <ElRow :gutter="16">
      <!-- 左侧权限组列表 -->
      <ElCol :span="6">
        <ElCard class="h-full">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-medium">权限组</span>
              <ElButton
                type="primary"
                size="small"
                @click="handleAddGroup()"
                v-access:code="'PERM_GROUP_ADD'"
              >
                新增
              </ElButton>
            </div>
          </template>

          <!-- 权限组搜索框 -->
          <div class="mb-3">
            <ElInput
              v-model="groupSearchKeyword"
              placeholder="搜索权限组..."
              clearable
              @input="handleGroupSearch"
              @clear="handleGroupSearch"
            >
              <template #prefix>
                <IconifyIcon
                  icon="lucide:search"
                  class="text-muted-foreground"
                />
              </template>
            </ElInput>
          </div>

          <!-- 全部权限选项 -->
          <div
            class="group-item"
            :class="{ active: selectedGroupId === null }"
            @click="selectPermGroup(null)"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm">全部权限</span>
            </div>
          </div>

          <!-- 权限组列表 -->
          <div v-loading="groupLoading" class="group-list">
            <!-- 搜索结果为空提示 -->
            <div
              v-if="
                groupSearchKeyword.trim() && filteredPermGroupList.length === 0
              "
              class="py-4 text-center text-sm text-gray-500"
            >
              未找到匹配的权限组
            </div>
            <div
              v-for="group in filteredPermGroupList"
              :key="group.permGroupId"
              class="group-item"
              :class="{ active: selectedGroupId === group.permGroupId }"
              @click="selectPermGroup(group.permGroupId)"
            >
              <div class="flex items-center justify-between">
                <div class="min-w-0 flex-1">
                  <div class="truncate text-sm font-medium">
                    {{ group.permGroupName }}
                  </div>
                  <div class="truncate text-xs text-gray-500">
                    {{ group.permGroupCode }}
                  </div>
                </div>
                <div class="ml-2 flex space-x-1">
                  <ElButton
                    type="primary"
                    link
                    size="small"
                    @click.stop="handleEditGroup(group)"
                    v-access:code="'PERM_GROUP_EDIT'"
                  >
                    编辑
                  </ElButton>
                  <ElButton
                    type="danger"
                    link
                    size="small"
                    @click.stop="handleDeleteGroup(group)"
                    v-access:code="'PERM_GROUP_DELETE'"
                  >
                    删除
                  </ElButton>
                </div>
              </div>
            </div>
          </div>
        </ElCard>
      </ElCol>

      <!-- 右侧权限列表 -->
      <ElCol :span="18">
        <!-- 查询表单 -->
        <ElCard>
          <QueryForm />
        </ElCard>

        <!-- 主内容区域 -->
        <ElCard class="mt-3 w-full">
          <!-- 权限表格 -->
          <Grid>
            <template #toolbar-actions>
              <ElButton
                type="primary"
                @click="handleAdd()"
                v-access:code="'PERM_ADD'"
              >
                新增权限
              </ElButton>
              <div class="ml-auto text-sm text-gray-500">
                <span v-if="selectedGroupId">
                  当前权限组：{{
                    permGroupList.find((g) => g.permGroupId === selectedGroupId)
                      ?.permGroupName
                  }}
                </span>
                <span v-else>显示全部权限</span>
              </div>
            </template>

            <!-- 所属服务列插槽 -->
            <template #service="{ row }">
              <span>{{ getServiceModuleText(row.service) }}</span>
            </template>

            <!-- 权限类型列插槽 -->
            <template #permType="{ row }">
              <ElTag :type="getPermTypeTagType(row.permType)">
                {{ getPermTypeText(row.permType) }}
              </ElTag>
            </template>

            <!-- 权限方法列插槽 -->
            <template #permMethod="{ row }">
              <span>{{ getHttpMethodText(row.permMethod) }}</span>
            </template>

            <!-- 状态列插槽 -->
            <template #status="{ row }">
              <ElTag :type="getStatusTagType(row.permStatus)">
                {{ getStatusText(row.permStatus) }}
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
                @click="handleEdit(row.permId)"
                v-access:code="'PERM_EDIT'"
              >
                编辑
              </ElButton>
              <ElButton
                type="danger"
                link
                size="small"
                @click="handleDelete(row.permId, row.permName)"
                v-access:code="'PERM_DELETE'"
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
      </ElCol>
    </ElRow>

    <!-- 权限组新增/编辑对话框 -->
    <ElDialog
      v-model="groupDialogVisible"
      :title="groupDialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <PermissionGroupForm :disabled="{ permGroupCode: isEditGroup }" />

      <template #footer>
        <ElButton @click="handleCancelGroup">取消</ElButton>
        <ElButton type="primary" @click="handleSaveGroup">确定</ElButton>
      </template>
    </ElDialog>

    <!-- 权限新增/编辑对话框 -->
    <ElDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
    >
      <PermissionForm :disabled="{ permPrefix: isEdit }" />

      <template #footer>
        <ElButton @click="handleCancel">取消</ElButton>
        <ElButton type="primary" @click="handleSave">确定</ElButton>
      </template>
    </ElDialog>
  </Page>
</template>

<style scoped>
.group-list {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}

.group-item {
  padding: 12px;
  margin-bottom: 8px;
  color: hsl(var(--card-foreground));
  cursor: pointer;
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 6px;
  transition: all 0.2s;
}

.group-item:hover {
  background-color: hsl(var(--accent-hover));
  border-color: hsl(var(--border));
}

.group-item:hover:not(.active) {
  box-shadow: 0 2px 4px hsl(var(--foreground) / 5%);
  transform: translateY(-1px);
}

.group-item.active {
  color: hsl(var(--primary-text));
  background-color: hsl(var(--primary-background-lightest));
  border-color: hsl(var(--primary-border));
  box-shadow: 0 0 0 1px hsl(var(--primary) / 10%);
}

.group-item.active .text-xs.text-gray-500 {
  color: hsl(var(--muted-foreground)) !important;
}

.group-item.active .text-xs.text-blue-500 {
  font-weight: 500;
  color: hsl(var(--primary-text-hover)) !important;
}
</style>
