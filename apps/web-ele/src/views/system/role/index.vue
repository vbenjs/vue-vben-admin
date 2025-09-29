<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { RoleApi } from '#/api/system/role';

import { computed, onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import dayjs from 'dayjs';
import {
  ElButton,
  ElCard,
  ElCheckbox,
  ElCheckboxGroup,
  ElCollapse,
  ElCollapseItem,
  ElDialog,
  ElInput,
  ElMessage,
  ElMessageBox,
  ElPagination,
  ElRow,
  ElTag,
  ElTree,
} from 'element-plus';

import { useVbenForm, z } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getMenuTreeTableApi } from '#/api/system/menu';
import { getAllPermissionsApi } from '#/api/system/permission';
import {
  assignRoleMenusApi,
  assignRolePermissionsApi,
  createRoleApi,
  deleteRoleApi,
  getRoleDetailApi,
  getRoleListApi,
  getRoleMenusApi,
  getRolePermissionsApi,
  updateRoleApi,
} from '#/api/system/role';

defineOptions({ name: 'Role' });

// 状态映射
const roleStatusMap = {
  '0': { text: '启用', type: 'success' },
  '1': { text: '禁用', type: 'danger' },
} as const;

// 系统角色映射
const isSystemMap = {
  '0': { text: '是', type: 'warning' },
  '1': { text: '否', type: 'primary' },
} as const;

// 表格数据
const tableData = ref<RoleApi.RoleListResponse[]>([]);
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
const currentRoleId = ref<number>();

// 权限分配对话框
const permissionDialogVisible = ref(false);
const currentRole = ref<{ roleId: number; roleName: string }>();
const groupedPermissions = ref<{
  permissionGroups: any[];
  ungroupedPermissions: any[];
}>({ permissionGroups: [], ungroupedPermissions: [] });
const selectedPermissions = ref<string[]>([]);
const loadingPermissions = ref(false);
const searchKeyword = ref('');
const expandedGroups = ref<string[]>([]);

// 菜单分配对话框
const menuDialogVisible = ref(false);
const currentMenuRole = ref<{ roleCode: string; roleName: string }>();
const menuTreeData = ref<any[]>([]);
const selectedMenus = ref<string[]>([]);
const loadingMenus = ref(false);
const menuTreeRef = ref();

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
        placeholder: '请输入角色编码',
        clearable: true,
      },
      fieldName: 'roleCode',
      label: '角色编码',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入角色名称',
        clearable: true,
      },
      fieldName: 'roleName',
      label: '角色名称',
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
      fieldName: 'roleStatus',
      label: '状态',
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择是否系统内置',
        clearable: true,
        options: [
          { label: '是', value: '0' },
          { label: '否', value: '1' },
        ],
      },
      fieldName: 'isSystem',
      label: '系统内置',
    },
  ],
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
  resetButtonOptions: {
    content: '重置',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-3',
});

// VbenForm 角色表单
const [RoleForm, roleFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: handleSave,
  layout: 'vertical',
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入角色编码',
        disabled: isEdit,
      },
      fieldName: 'roleCode',
      label: '角色编码',
      rules: z
        .string()
        .min(2, { message: '角色编码至少2个字符' })
        .max(64, { message: '角色编码最多64个字符' }),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入角色名称',
      },
      fieldName: 'roleName',
      label: '角色名称',
      rules: z
        .string()
        .min(2, { message: '角色名称至少2个字符' })
        .max(64, { message: '角色名称最多64个字符' }),
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
      fieldName: 'roleStatus',
      label: '状态',
      defaultValue: '0',
      rules: z.string().min(1, { message: '请选择状态' }),
    },
    {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入角色描述',
        rows: 3,
      },
      fieldName: 'roleDesc',
      label: '角色描述',
      rules: z.string().optional(),
    },
  ],
  wrapperClass: 'grid-cols-1',
});

// 格式化时间
function formatDateTime(dateTime?: string): string {
  if (!dateTime) return '';
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
}

// VxeTable配置
const gridOptions: VxeGridProps<RoleApi.RoleListResponse> = {
  columns: [
    { type: 'seq', width: 70, title: '序号' },
    {
      field: 'roleId',
      title: '角色ID',
      width: 80,
      align: 'center',
    },
    {
      field: 'roleCode',
      title: '角色编码',
      minWidth: 150,
      showOverflow: 'tooltip',
    },
    {
      field: 'roleName',
      title: '角色名称',
      minWidth: 150,
      showOverflow: 'tooltip',
    },
    {
      field: 'roleStatus',
      title: '状态',
      width: 90,
      slots: { default: 'roleStatus' },
    },
    {
      field: 'isSystem',
      title: '是否系统',
      width: 100,
      slots: { default: 'isSystem' },
    },
    {
      field: 'roleDesc',
      title: '描述',
      minWidth: 150,
      showOverflow: 'tooltip',
    },
    {
      field: 'createdTime',
      title: '创建时间',
      width: 160,
      slots: { default: 'createdTime' },
    },
    {
      field: 'updatedTime',
      title: '更新时间',
      width: 160,
      slots: { default: 'updatedTime' },
    },
    {
      title: '操作',
      width: 280,
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

// 加载角色列表
async function loadRoleList() {
  loading.value = true;
  gridOptions.loading = true;
  try {
    const queryParams = queryForm.form.values;
    const params: RoleApi.GetRoleListRequest = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      keyword: queryParams?.keyword || undefined,
      roleStatus: queryParams?.roleStatus || undefined,
      isSystem: queryParams?.isSystem || undefined,
    };

    const response = await getRoleListApi(params);

    tableData.value = response.list;
    pagination.total = response.total;
    pagination.pageNum = response.pageNum;

    // 更新VxeTable数据（参照department方式）
    gridApi.setState({
      gridOptions: {
        data: response.list,
      },
    });
  } catch (error) {
    // ElMessage.error('加载角色列表失败');
    console.error('Load role list error:', error);
  } finally {
    loading.value = false;
    gridOptions.loading = false;
  }
}

// 处理查询表单提交
function onSubmit(_values: Record<string, any>) {
  pagination.pageNum = 1;
  loadRoleList();
}

// 分页变化
function handlePageChange(page: number) {
  pagination.pageNum = page;
  loadRoleList();
}

function handleSizeChange(size: number) {
  pagination.pageSize = size;
  pagination.pageNum = 1;
  loadRoleList();
}

// 新增角色
function handleAdd() {
  dialogTitle.value = '新增角色';
  isEdit.value = false;
  currentRoleId.value = undefined;
  dialogVisible.value = true;

  // 重置表单并设置默认值
  roleFormApi.resetForm();
  roleFormApi.setValues({
    roleStatus: '0',
  });
}

// 编辑角色
async function handleEdit(id: number) {
  try {
    dialogTitle.value = '编辑角色';
    isEdit.value = true;
    currentRoleId.value = id;
    const response = await getRoleDetailApi({ roleId: id });

    // 设置表单值
    roleFormApi.setValues(response);
    dialogVisible.value = true;
  } catch (error) {
    // ElMessage.error('获取角色详情失败');
    console.error('Get role detail error:', error);
  }
}

// 权限分配
async function handleAssignPermissions(roleId: number, roleName: string) {
  try {
    currentRole.value = { roleId, roleName };
    loadingPermissions.value = true;

    // 并行加载所有权限和角色已有权限
    const [, rolePerms] = await Promise.all([
      loadAllPermissions(),
      loadRolePermissions(roleId),
    ]);

    // 设置角色已有的权限为选中状态
    selectedPermissions.value = rolePerms.permissions.map(
      (perm) => perm.permCode,
    );

    permissionDialogVisible.value = true;
  } catch (error) {
    // ElMessage.error('加载权限信息失败');
    console.error('Load permissions error:', error);
  } finally {
    loadingPermissions.value = false;
  }
}

// 加载所有严格权限
async function loadAllPermissions() {
  try {
    const response = await getAllPermissionsApi({
      // 只获取严格鉴权的权限
      permType: '2',
    });
    groupedPermissions.value = response || {
      permissionGroups: [],
      ungroupedPermissions: [],
    };

    // 默认展开所有权限组
    expandedGroups.value = response.permissionGroups.map(
      (group) => group.permGroupCode,
    );

    return response;
  } catch (error) {
    console.error('Load all permissions error:', error);
    throw error;
  }
}

// 加载角色权限
async function loadRolePermissions(roleId: number) {
  try {
    const response = await getRolePermissionsApi({ roleId });
    return response;
  } catch (error) {
    console.error('Load role permissions error:', error);
    throw error;
  }
}

// 确认分配权限
async function handleConfirmAssignPermissions() {
  if (!currentRole.value) return;

  try {
    await assignRolePermissionsApi({
      roleId: currentRole.value.roleId,
      permissionCodes: selectedPermissions.value,
    });

    ElMessage.success('权限分配成功');
    permissionDialogVisible.value = false;
  } catch (error) {
    // ElMessage.error('权限分配失败');
    console.error('Assign permissions error:', error);
  }
}

// 权限组全选/取消全选
function handleGroupSelectAll(groupCode: string, checked: boolean) {
  const group = groupedPermissions.value.permissionGroups.find(
    (g) => g.permGroupCode === groupCode,
  );
  if (!group) return;

  const groupPermCodes = group.permissions.map((perm: any) => perm.permCode);

  selectedPermissions.value = checked
    ? // 添加该组所有权限
      [...new Set([...groupPermCodes, ...selectedPermissions.value])]
    : // 移除该组所有权限
      selectedPermissions.value.filter(
        (code: string) => !groupPermCodes.includes(code),
      );
}

// 检查权限组是否全选
function isGroupAllSelected(groupCode: string): boolean {
  const group = groupedPermissions.value.permissionGroups.find(
    (g) => g.permGroupCode === groupCode,
  );
  if (!group) return false;

  const groupPermCodes = group.permissions.map((perm: any) => perm.permCode);
  // 如果权限组为空，返回 false
  if (groupPermCodes.length === 0) return false;

  return groupPermCodes.every((code: string) =>
    selectedPermissions.value.includes(code),
  );
}

// 检查权限组是否部分选中
function isGroupIndeterminate(groupCode: string): boolean {
  const group = groupedPermissions.value.permissionGroups.find(
    (g) => g.permGroupCode === groupCode,
  );
  if (!group) return false;

  const groupPermCodes = group.permissions.map((perm: any) => perm.permCode);
  // 如果权限组为空，返回 false
  if (groupPermCodes.length === 0) return false;

  const selectedCount = groupPermCodes.filter((code: string) =>
    selectedPermissions.value.includes(code),
  ).length;
  return selectedCount > 0 && selectedCount < groupPermCodes.length;
}

// 权限搜索过滤
const filteredPermissions = computed(() => {
  if (!searchKeyword.value.trim()) return groupedPermissions.value;

  const keyword = searchKeyword.value.toLowerCase();

  return {
    permissionGroups: groupedPermissions.value.permissionGroups
      .map((group) => ({
        ...group,
        permissions: group.permissions.filter(
          (perm: any) =>
            perm.permName.toLowerCase().includes(keyword) ||
            perm.permCode.toLowerCase().includes(keyword) ||
            (perm.permDesc && perm.permDesc.toLowerCase().includes(keyword)),
        ),
      }))
      .filter((group) => group.permissions.length > 0),
    ungroupedPermissions: groupedPermissions.value.ungroupedPermissions.filter(
      (perm: any) =>
        perm.permName.toLowerCase().includes(keyword) ||
        perm.permCode.toLowerCase().includes(keyword) ||
        (perm.permDesc && perm.permDesc.toLowerCase().includes(keyword)),
    ),
  };
});

// 取消权限分配
function handleCancelAssignPermissions() {
  permissionDialogVisible.value = false;
  selectedPermissions.value = [];
  currentRole.value = undefined;
  searchKeyword.value = '';
  expandedGroups.value = [];
}

// 菜单分配
async function handleAssignMenus(
  _roleId: number,
  roleName: string,
  roleCode: string,
) {
  try {
    currentMenuRole.value = { roleCode, roleName };
    loadingMenus.value = true;

    // 并行加载所有菜单和角色已有菜单
    const [, roleMenus] = await Promise.all([
      loadAllMenus(),
      loadRoleMenus(roleCode),
    ]);

    // 设置角色已有的菜单为选中状态
    const menuCodes = roleMenus.map((menu) => menu.menuCode);
    selectedMenus.value = menuCodes;

    menuDialogVisible.value = true;

    // 等待对话框打开后再设置树组件的选中状态
    setTimeout(() => {
      if (menuTreeRef.value) {
        menuTreeRef.value.setCheckedKeys(menuCodes);
      }
    }, 100);
  } catch (error) {
    // ElMessage.error('加载菜单信息失败');
    console.error('Load menus error:', error);
  } finally {
    loadingMenus.value = false;
  }
}

// 加载所有菜单
async function loadAllMenus() {
  try {
    const response = await getMenuTreeTableApi({});
    menuTreeData.value = response || [];
    return response;
  } catch (error) {
    console.error('Load all menus error:', error);
    throw error;
  }
}

// 加载角色菜单
async function loadRoleMenus(roleCode: string) {
  try {
    const response = await getRoleMenusApi({ roleCode });
    return response;
  } catch (error) {
    console.error('Load role menus error:', error);
    throw error;
  }
}

// 确认分配菜单
async function handleConfirmAssignMenus() {
  if (!currentMenuRole.value) return;

  try {
    await assignRoleMenusApi({
      roleCode: currentMenuRole.value.roleCode,
      menuCodes: selectedMenus.value,
    });

    ElMessage.success('菜单分配成功');
    menuDialogVisible.value = false;
  } catch (error) {
    // ElMessage.error('菜单分配失败');
    console.error('Assign menus error:', error);
  }
}

// 取消菜单分配
function handleCancelAssignMenus() {
  menuDialogVisible.value = false;
  selectedMenus.value = [];
  currentMenuRole.value = undefined;

  // 清除树组件的选中状态
  if (menuTreeRef.value) {
    menuTreeRef.value.setCheckedKeys([]);
  }
}

// 处理菜单选择变化
function handleMenuCheck(_data: any, checkedInfo: any) {
  selectedMenus.value = checkedInfo.checkedKeys;
}

// 递归获取所有菜单编码（用于全选功能）
function getAllMenuCodes(menus: any[]): string[] {
  const codes: string[] = [];

  function traverse(menuList: any[]) {
    menuList.forEach((menu) => {
      codes.push(menu.menuCode);
      if (menu.children && menu.children.length > 0) {
        traverse(menu.children);
      }
    });
  }

  traverse(menus);
  return codes;
}

// 全选菜单
function handleSelectAllMenus() {
  const allCodes = getAllMenuCodes(menuTreeData.value);
  selectedMenus.value = allCodes;

  // 更新树组件的选中状态
  if (menuTreeRef.value) {
    menuTreeRef.value.setCheckedKeys(allCodes);
  }
}

// 取消全选菜单
function handleClearAllMenus() {
  selectedMenus.value = [];

  // 更新树组件的选中状态
  if (menuTreeRef.value) {
    menuTreeRef.value.setCheckedKeys([]);
  }
}

// 删除角色
async function handleDelete(id: number, roleName: string) {
  try {
    await ElMessageBox.confirm(
      `确定要删除角色 "${roleName}" 吗？`,
      '确认删除',
      {
        type: 'warning',
      },
    );

    await deleteRoleApi({ roleId: id });
    ElMessage.success('删除成功');
    loadRoleList();
  } catch (error) {
    if (error !== 'cancel') {
      // ElMessage.error('删除失败');
      console.error('Delete role error:', error);
    }
  }
}

// 保存角色
async function handleSave() {
  try {
    // 进行表单验证
    const validationResult = await roleFormApi.validate();

    if (!validationResult.valid) {
      ElMessage.warning('请根据提示内容填写表单');
      return; // 验证失败，停止执行
    }

    // 验证通过后获取表单值
    const values = await roleFormApi.getValues();

    if (isEdit.value && currentRoleId.value) {
      await updateRoleApi({
        ...values,
        roleId: currentRoleId.value,
      } as RoleApi.UpdateRoleRequest);
      ElMessage.success('更新成功');
    } else {
      await createRoleApi(values as RoleApi.CreateRoleRequest);
      ElMessage.success('创建成功');
    }

    dialogVisible.value = false;
    loadRoleList();
  } catch (error) {
    // ElMessage.error(isEdit.value ? '更新失败' : '创建失败');
    console.error('Save role error:', error);
    throw error; // 重新抛出错误，阻止表单关闭
  }
}

// 取消
function handleCancel() {
  dialogVisible.value = false;
  roleFormApi.resetForm();
}

// 获取状态标签类型
function getRoleStatusTagType(roleStatus: string): 'danger' | 'success' {
  return (
    roleStatusMap[roleStatus as keyof typeof roleStatusMap]?.type || 'success'
  );
}

// 获取状态文本
function getRoleStatusText(roleStatus: string): string {
  return (
    roleStatusMap[roleStatus as keyof typeof roleStatusMap]?.text || '未知'
  );
}

// 获取系统角色标签类型
function getIsSystemTagType(isSystem: string): 'primary' | 'warning' {
  return isSystemMap[isSystem as keyof typeof isSystemMap]?.type || 'primary';
}

// 获取系统角色文本
function getIsSystemText(isSystem: string): string {
  return isSystemMap[isSystem as keyof typeof isSystemMap]?.text || '未知';
}

// 初始化
onMounted(() => {
  loadRoleList();
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
            @click="handleAdd()"
            v-access:code="'ROLE_ADD'"
          >
            新增角色
          </ElButton>
        </template>

        <!-- 状态列插槽 -->
        <template #roleStatus="{ row }">
          <ElTag :type="getRoleStatusTagType(row.roleStatus)">
            {{ getRoleStatusText(row.roleStatus) }}
          </ElTag>
        </template>

        <!-- 系统角色列插槽 -->
        <template #isSystem="{ row }">
          <ElTag :type="getIsSystemTagType(row.isSystem)">
            {{ getIsSystemText(row.isSystem) }}
          </ElTag>
        </template>

        <!-- 创建时间列插槽 -->
        <template #createdTime="{ row }">
          <span>{{ formatDateTime(row.createdTime) }}</span>
        </template>

        <!-- 更新时间列插槽 -->
        <template #updatedTime="{ row }">
          <span>{{ formatDateTime(row.updatedTime) }}</span>
        </template>

        <!-- 操作列插槽 -->
        <template #action="{ row }">
          <ElButton
            type="primary"
            link
            size="small"
            @click="handleEdit(row.roleId)"
            v-if="row.isSystem !== '0'"
            v-access:code="'ROLE_EDIT'"
          >
            编辑
          </ElButton>
          <ElButton
            type="success"
            link
            size="small"
            @click="handleAssignPermissions(row.roleId, row.roleName)"
            v-if="row.isSystem !== '0'"
            v-access:code="'ROLE_ASSIGN_PERM'"
          >
            权限分配
          </ElButton>
          <ElButton
            type="warning"
            link
            size="small"
            @click="handleAssignMenus(row.roleId, row.roleName, row.roleCode)"
            v-if="row.isSystem !== '0'"
            v-access:code="'ROLE_ASSIGN_MENU'"
          >
            菜单分配
          </ElButton>
          <ElButton
            type="danger"
            link
            size="small"
            @click="handleDelete(row.roleId, row.roleName)"
            v-if="row.isSystem !== '0'"
            v-access:code="'ROLE_DELETE'"
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

    <!-- 新增/编辑角色对话框 -->
    <ElDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <RoleForm :disabled="{ roleCode: isEdit }" />

      <template #footer>
        <ElButton @click="handleCancel">取消</ElButton>
        <ElButton type="primary" @click="handleSave">确定</ElButton>
      </template>
    </ElDialog>

    <!-- 权限分配对话框 -->
    <ElDialog
      v-model="permissionDialogVisible"
      title="分配权限"
      width="900px"
      @close="handleCancelAssignPermissions"
    >
      <div v-loading="loadingPermissions" class="space-y-4">
        <div class="text-muted-foreground text-sm">
          为角色
          <span class="font-medium">{{ currentRole?.roleName }}</span>
          分配权限，选择的权限将覆盖角色现有权限
        </div>

        <!-- 搜索框 -->
        <div class="space-y-2">
          <ElInput
            v-model="searchKeyword"
            placeholder="搜索权限名称或编码..."
            clearable
            class="w-full"
          >
            <template #prefix>
              <i class="el-icon-search"></i>
            </template>
          </ElInput>
        </div>

        <div class="space-y-3">
          <div class="text-sm font-medium">选择权限：</div>

          <!-- 权限组展示 -->
          <ElCollapse v-model="expandedGroups" class="space-y-2">
            <!-- 有分组的权限 -->
            <ElCollapseItem
              v-for="group in filteredPermissions.permissionGroups"
              :key="group.permGroupCode"
              :name="group.permGroupCode"
            >
              <template #title>
                <div class="flex items-center space-x-2">
                  <ElCheckbox
                    :model-value="isGroupAllSelected(group.permGroupCode)"
                    :indeterminate="isGroupIndeterminate(group.permGroupCode)"
                    @change="
                      (val: any) =>
                        handleGroupSelectAll(group.permGroupCode, !!val)
                    "
                  />
                  <span class="font-medium">{{ group.permGroupName }}</span>
                  <span class="text-muted-foreground text-xs">
                    ({{ group.permissions.length }} 个权限)
                  </span>
                </div>
              </template>

              <div class="space-y-2 pl-6">
                <ElCheckboxGroup v-model="selectedPermissions">
                  <div
                    v-for="permission in group.permissions"
                    :key="permission.permCode"
                    class="hover:bg-accent/50 flex items-start space-x-3 rounded-md border p-3"
                  >
                    <ElCheckbox
                      :value="permission.permCode"
                      :label="permission.permCode"
                      class="mt-1"
                    />
                    <div class="min-w-0 flex-1">
                      <div class="text-sm font-medium">
                        {{ permission.permName }}
                      </div>
                      <div
                        v-if="permission.permDesc"
                        class="text-muted-foreground mt-1 text-xs"
                      >
                        {{ permission.permDesc }}
                      </div>
                      <div
                        class="text-muted-foreground mt-1 flex space-x-4 text-xs"
                      >
                        <span>权限编码: {{ permission.permCode }}</span>
                        <span v-if="permission.permMethod">
                          方法: {{ permission.permMethod }}
                        </span>
                        <span v-if="permission.service">
                          服务: {{ permission.service }}
                        </span>
                      </div>
                    </div>
                  </div>
                </ElCheckboxGroup>
              </div>
            </ElCollapseItem>

            <!-- 未分组权限 -->
            <ElCollapseItem
              v-if="filteredPermissions.ungroupedPermissions.length > 0"
              name="ungrouped"
            >
              <template #title>
                <div class="flex items-center space-x-2">
                  <span class="font-medium">未分组权限</span>
                  <span class="text-muted-foreground text-xs">
                    ({{ filteredPermissions.ungroupedPermissions.length }}
                    个权限)
                  </span>
                </div>
              </template>

              <div class="space-y-2 pl-6">
                <ElCheckboxGroup v-model="selectedPermissions">
                  <div
                    v-for="permission in filteredPermissions.ungroupedPermissions"
                    :key="permission.permCode"
                    class="hover:bg-accent/50 flex items-start space-x-3 rounded-md border p-3"
                  >
                    <ElCheckbox
                      :value="permission.permCode"
                      :label="permission.permCode"
                      class="mt-1"
                    />
                    <div class="min-w-0 flex-1">
                      <div class="text-sm font-medium">
                        {{ permission.permName }}
                      </div>
                      <div
                        v-if="permission.permDesc"
                        class="text-muted-foreground mt-1 text-xs"
                      >
                        {{ permission.permDesc }}
                      </div>
                      <div
                        class="text-muted-foreground mt-1 flex space-x-4 text-xs"
                      >
                        <span>权限编码: {{ permission.permCode }}</span>
                        <span v-if="permission.permMethod">
                          方法: {{ permission.permMethod }}
                        </span>
                        <span v-if="permission.service">
                          服务: {{ permission.service }}
                        </span>
                      </div>
                    </div>
                  </div>
                </ElCheckboxGroup>
              </div>
            </ElCollapseItem>
          </ElCollapse>

          <!-- 空状态 -->
          <div
            v-if="
              filteredPermissions.permissionGroups.length === 0 &&
              filteredPermissions.ungroupedPermissions.length === 0 &&
              !loadingPermissions
            "
            class="text-muted-foreground py-8 text-center"
          >
            <div v-if="searchKeyword.trim()">未找到匹配的权限</div>
            <div v-else>暂无可分配的权限</div>
          </div>

          <!-- 权限统计 -->
          <div class="text-muted-foreground text-right text-sm">
            已选择 {{ selectedPermissions.length }} 个权限
          </div>
        </div>
      </div>

      <template #footer>
        <ElButton @click="handleCancelAssignPermissions">取消</ElButton>
        <ElButton
          type="primary"
          :loading="loadingPermissions"
          @click="handleConfirmAssignPermissions"
        >
          确定
        </ElButton>
      </template>
    </ElDialog>

    <!-- 菜单分配对话框 -->
    <ElDialog
      v-model="menuDialogVisible"
      title="分配菜单"
      width="700px"
      @close="handleCancelAssignMenus"
    >
      <div v-loading="loadingMenus" class="space-y-4">
        <div class="text-muted-foreground text-sm">
          为角色
          <span class="font-medium">{{ currentMenuRole?.roleName }}</span>
          分配菜单，选择的菜单将覆盖角色现有菜单权限
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="text-sm font-medium">选择菜单：</div>
            <div class="space-x-2">
              <ElButton
                type="primary"
                size="small"
                @click="handleSelectAllMenus"
              >
                全选
              </ElButton>
              <ElButton size="small" @click="handleClearAllMenus">
                取消全选
              </ElButton>
            </div>
          </div>

          <!-- 菜单树 -->
          <div class="max-h-96 overflow-y-auto rounded border">
            <ElTree
              ref="menuTreeRef"
              :data="menuTreeData"
              show-checkbox
              node-key="menuCode"
              check-strictly
              :props="{
                children: 'children',
                label: 'menuName',
              }"
              :default-checked-keys="selectedMenus"
              @check="handleMenuCheck"
              class="p-2"
            >
              <template #default="{ data }">
                <div class="flex w-full items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium">{{ data.menuName }}</span>
                    <ElTag
                      :type="
                        data.menuType === '0'
                          ? 'primary'
                          : data.menuType === '1'
                            ? 'success'
                            : 'warning'
                      "
                      size="small"
                    >
                      {{
                        data.menuType === '0'
                          ? '目录'
                          : data.menuType === '1'
                            ? '菜单'
                            : '按钮'
                      }}
                    </ElTag>
                  </div>
                  <div class="text-muted-foreground text-xs">
                    {{ data.menuCode }}
                  </div>
                </div>
              </template>
            </ElTree>
          </div>

          <!-- 菜单统计 -->
          <div class="text-muted-foreground text-right text-sm">
            已选择 {{ selectedMenus.length }} 个菜单
          </div>
        </div>
      </div>

      <template #footer>
        <ElButton @click="handleCancelAssignMenus">取消</ElButton>
        <ElButton
          type="primary"
          :loading="loadingMenus"
          @click="handleConfirmAssignMenus"
        >
          确定
        </ElButton>
      </template>
    </ElDialog>
  </Page>
</template>
