<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { MenuApi } from '#/api/system/menu';

import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import dayjs from 'dayjs';
import {
  ElButton,
  ElCard,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElTag,
} from 'element-plus';

import { useVbenForm, z } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createMenuApi,
  deleteMenuApi,
  getMenuDetailApi,
  getMenuTreeTableApi,
  updateMenuApi,
} from '#/api/system/menu';

defineOptions({ name: 'Menu' });

// 是否显示
const isShowMap = {
  '0': { text: '是', type: 'success' },
  '1': { text: '否', type: 'danger' },
} as const;

// 是否显示
const isSystemMap = {
  '0': { text: '是', type: 'warning' },
  '1': { text: '否', type: 'success' },
} as const;

// 菜单类型映射
const menuTypeMap = {
  '0': { text: '目录', type: 'info' },
  '1': { text: '菜单', type: 'primary' },
  '2': { text: '按钮', type: 'warning' },
} as const;

// 表格数据
const originalData = ref<MenuApi.MenuTreeTableResponse[]>([]); // 存储原始树形数据
const loading = ref(false);

// 对话框状态
const dialogVisible = ref(false);
const dialogTitle = ref('');
const isEdit = ref(false);
const currentMenuId = ref<number>();
const currentMenuCode = ref<string>();

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
    // {
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '请输入菜单名称或标题',
    //     clearable: true,
    //   },
    //   fieldName: 'keyword',
    //   label: '关键词',
    // },
    // {
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择菜单类型',
    //     clearable: true,
    //     options: [
    //       { label: '菜单', value: 'MENU' },
    //       { label: '按钮', value: 'BUTTON' },
    //     ],
    //   },
    //   fieldName: 'menuType',
    //   label: '菜单类型',
    // },
    // {
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择状态',
    //     clearable: true,
    //     options: [
    //       { label: '启用', value: 'ENABLED' },
    //       { label: '禁用', value: 'DISABLED' },
    //     ],
    //   },
    //   fieldName: 'status',
    //   label: '状态',
    // },
  ],
  showCollapseButton: false,
  submitButtonOptions: {
    content: '查询',
  },
  resetButtonOptions: {
    content: '重置',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-4',
});

// VbenForm 表单
const [MenuForm, menuFormApi] = useVbenForm({
  // 所有表单项共用配置
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  // 垂直布局
  layout: 'vertical',
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入菜单编码',
        disabled: isEdit,
      },
      fieldName: 'menuCode',
      label: '菜单编码',
      rules: z
        .string()
        .min(2, { message: '菜单编码至少2个字符' })
        .max(64, { message: '菜单编码最多64个字符' }),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入菜单名称',
      },
      fieldName: 'menuName',
      label: '菜单名称',
      rules: z
        .string()
        .min(2, { message: '菜单名称至少2个字符' })
        .max(64, { message: '菜单名称最多64个字符' }),
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择菜单类型',
        options: [
          { label: '目录', value: '0' },
          { label: '菜单', value: '1' },
          { label: '按钮', value: '2' },
        ],
      },
      fieldName: 'menuType',
      label: '菜单类型',
      rules: z.string().min(1, { message: '请选择菜单类型' }),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入Vue路由名称',
      },
      fieldName: 'routerName',
      label: '路由名称',
      rules: z
        .string()
        .min(1, { message: '请输入路由名称' })
        .max(64, { message: '路由名称最多64个字符' }),
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) =>
          values.menuType === '0' ||
          values.menuType === '1' ||
          values.menuType === '2',
      },
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入路由路径，如：/system/user',
      },
      fieldName: 'routerPath',
      label: '路由路径',
      rules: z
        .string()
        .min(1, { message: '请输入路由路径' })
        .max(128, { message: '路由路径最多128个字符' }),
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) =>
          values.menuType === '0' ||
          values.menuType === '1' ||
          values.menuType === '2',
      },
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入路由查询参数，如：tab=list&mode=edit',
      },
      fieldName: 'routerQuery',
      label: '路由参数',
      rules: z.string().optional(),
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType === '1',
      },
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入Vue组件名称',
      },
      fieldName: 'componentName',
      label: '组件名称',
      rules: z
        .string()
        .min(1, { message: '请输入组件名称' })
        .max(64, { message: '组件名称最多64个字符' }),
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType === '1',
      },
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入组件文件名，如：UserManagement.vue',
      },
      fieldName: 'componentFileName',
      label: '组件文件名',
      rules: z
        .string()
        .min(1, { message: '请输入组件文件名' })
        .max(64, { message: '组件文件名最多64个字符' }),
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType === '1',
      },
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入组件路径，如：/system/user/index',
      },
      fieldName: 'componentPath',
      label: '组件路径',
      rules: z
        .string()
        .min(1, { message: '请输入组件路径' })
        .max(128, { message: '组件路径最多128个字符' }),
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType === '1',
      },
    },
    {
      component: 'IconPicker',
      componentProps: {
        placeholder: '请选择菜单图标',
        prefix: 'ant-design',
        contentProps: {
          style: { zIndex: 3000 },
        },
      },
      fieldName: 'icon',
      label: '菜单图标',
      rules: z.string().optional(),
      dependencies: {
        triggerFields: ['menuType'],
        show: (values) => values.menuType === '0' || values.menuType === '1',
      },
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
      rules: z
        .number()
        .min(0, { message: '排序号不能小于0' })
        .max(9999, { message: '排序号不能大于9999' })
        .optional(),
      help: '数字越小排序越靠前，留空将使用默认排序',
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择显示状态',
        options: [
          { label: '显示', value: '0' },
          { label: '隐藏', value: '1' },
        ],
      },
      fieldName: 'isShow',
      label: '显示状态',
      defaultValue: '0',
      rules: z.string().min(1, { message: '请选择显示状态' }),
    },
    {
      component: 'TreeSelect',
      componentProps: () => ({
        placeholder: '请选择上级菜单（留空为根级菜单）',
        clearable: true,
        filterable: true,
        data: menuTreeData.value,
        nodeKey: 'value',
        checkStrictly: true,
        showCheckbox: false,
        checkOnClickNode: true,
        props: {
          label: 'label',
        },
      }),
      fieldName: 'parentMenuCode',
      label: '上级菜单',
      rules: z
        .string()
        .optional()
        .refine(
          (value) => {
            // 编辑模式下不允许选择当前部门作为上级部门
            if (isEdit.value && value === currentMenuCode.value) {
              return false;
            }
            return true;
          },
          {
            message: '不能选择当前菜单作为上级菜单',
          },
        ),
    },
  ],
  // 一行显示1个
  wrapperClass: 'grid-cols-1',
});

// 加载菜单列表
async function loadMenuList() {
  loading.value = true;
  gridOptions.loading = true;
  try {
    const queryParams = queryForm.form.values;
    const params: MenuApi.GetMenuTreeTableRequest = {
      menuCode: queryParams?.keyword || undefined,
      menuName: queryParams?.keyword || undefined,
      menuType: queryParams?.menuType || undefined,
    };

    const response = await getMenuTreeTableApi(params);

    originalData.value = response; // 保存原始数据供下拉选择使用
    // 通过 gridApi 更新状态（响应式）
    gridApi.setState({
      gridOptions: {
        data: response,
      },
    });
  } catch (error) {
    // ElMessage.error('加载菜单列表失败');
    console.error('Load menu list error:', error);
  } finally {
    loading.value = false;
    gridOptions.loading = false;
  }
}

// 处理查询表单提交
function onSubmit(_values: Record<string, any>) {
  loadMenuList();
}

// 新增菜单
function handleAdd(parentId?: number, parentMenuType?: string) {
  dialogTitle.value = '新增菜单';
  isEdit.value = false;
  currentMenuId.value = undefined;
  dialogVisible.value = true;

  // 重置表单
  menuFormApi.resetForm();

  let menuType = '1';
  if (parentMenuType === '0') {
    menuType = '1';
  }
  if (parentMenuType === '1') {
    menuType = '2';
  }

  const defaultValues: Partial<MenuApi.CreateMenuRequest> = {
    menuType, // 默认为菜单
    isShow: '0', // 默认显示
  };

  if (parentId) {
    // 根据 parentId 查找对应的 menuCode
    const parentMenu = findMenuByIdInTree(originalData.value, parentId);
    if (parentMenu) {
      defaultValues.parentMenuCode = parentMenu.menuCode;
    }
  }

  // 设置默认值
  menuFormApi.setValues(defaultValues);
}

// 编辑菜单
async function handleEdit(id: number, code: string) {
  try {
    dialogTitle.value = '编辑菜单';
    isEdit.value = true;
    currentMenuId.value = id;
    currentMenuCode.value = code;
    const response = await getMenuDetailApi({ menuId: id });

    // 设置表单值
    menuFormApi.setValues(response);
    dialogVisible.value = true;
  } catch (error) {
    // ElMessage.error('获取菜单详情失败');
    console.error('Get menu detail error:', error);
  }
}

// 删除菜单
async function handleDelete(id: number, title: string) {
  try {
    await ElMessageBox.confirm(`确定要删除菜单 "${title}" 吗？`, '确认删除', {
      type: 'warning',
    });

    await deleteMenuApi({ menuId: id });
    ElMessage.success('删除成功');
    loadMenuList();
  } catch (error) {
    if (error !== 'cancel') {
      // ElMessage.error('删除失败');
      console.error('Delete menu error:', error);
    }
  }
}

// 保存菜单
async function handleSave() {
  try {
    // 进行表单验证
    const validationResult = await menuFormApi.validate();

    if (!validationResult.valid) {
      ElMessage.warning('请根据提示内容填写表单');
      return; // 验证失败，停止执行
    }

    const values = await menuFormApi.getValues();

    // 进行动态验证
    // const dynamicValidationError = validateMenuForm(values);
    // if (dynamicValidationError) {
    //   ElMessage.warning(dynamicValidationError);
    //   return;
    // }

    if (isEdit.value && currentMenuId.value) {
      await updateMenuApi({
        ...values,
        menuId: currentMenuId.value,
      } as MenuApi.UpdateMenuRequest);
      ElMessage.success('更新成功');
    } else {
      await createMenuApi(values as MenuApi.CreateMenuRequest);
      ElMessage.success('创建成功');
    }

    dialogVisible.value = false;
    loadMenuList();
  } catch (error) {
    // ElMessage.error(isEdit.value ? '更新失败' : '创建失败');
    console.error('Save menu error:', error);
    throw error; // 重新抛出错误，阻止表单关闭
  }
}

// 取消
function handleCancel() {
  dialogVisible.value = false;
  menuFormApi.resetForm();
}

// 获取是否显示
function getIsShowTagType(status: string): 'danger' | 'success' {
  return isShowMap[status as keyof typeof isShowMap]?.type || 'success';
}

// 获取是否显示文本
function getIsShowText(status: string): string {
  return isShowMap[status as keyof typeof isShowMap]?.text || '未知';
}

// 获取是否显示
function getIsSystemTagType(isSystem: string): 'success' | 'warning' {
  return isSystemMap[isSystem as keyof typeof isSystemMap]?.type || 'success';
}

// 获取是否显示文本
function getIsSystemText(isSystem: string): string {
  return isSystemMap[isSystem as keyof typeof isSystemMap]?.text || '未知';
}

// 获取菜单类型标签类型
function getMenuTypeTagType(menuType: string): 'info' | 'primary' | 'warning' {
  return menuTypeMap[menuType as keyof typeof menuTypeMap]?.type || 'primary';
}

// 获取菜单类型文本
function getMenuTypeText(menuType: string): string {
  return menuTypeMap[menuType as keyof typeof menuTypeMap]?.text || '未知';
}

// 格式化时间
function formatDateTime(dateTime?: string): string {
  if (!dateTime) return '';
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
}

// VxeTable配置
const gridOptions: VxeGridProps<MenuApi.MenuTreeTableResponse> = {
  columns: [
    { type: 'seq', width: 70, title: '序号' },
    {
      field: 'menuCode',
      title: '菜单编码',
      minWidth: 180,
      showOverflow: 'tooltip',
      treeNode: true,
    },
    {
      field: 'menuName',
      title: '菜单名称',
      minWidth: 200,
    },
    {
      field: 'icon',
      title: '图标',
      width: 80,
      slots: { default: 'icon' },
    },
    {
      field: 'menuType',
      title: '菜单类型',
      width: 100,
      slots: { default: 'menuType' },
    },
    {
      field: 'isSystem',
      title: '系统内置',
      minWidth: 90,
      showOverflow: 'tooltip',
      slots: { default: 'isSystem' },
    },
    {
      field: 'sort',
      title: '排序',
      width: 80,
    },
    {
      field: 'isShow',
      title: '是否显示',
      width: 90,
      slots: { default: 'isShow' },
    },
    {
      title: '操作',
      width: 280,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ],
  treeConfig: {
    transform: false, // 直接使用嵌套数据，不进行转换
    expandAll: false, // 默认不展开所有节点
    childrenField: 'children', // 子节点字段名
  },
  pagerConfig: {
    enabled: false,
  },
  loading: false,
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

// 展开所有节点
function expandAll() {
  gridApi.grid?.setAllTreeExpand(true);
}

// 折叠所有节点
function collapseAll() {
  gridApi.grid?.setAllTreeExpand(false);
}

// 递归查找菜单项
function findMenuByIdInTree(
  menus: MenuApi.MenuTreeTableResponse[],
  menuId: number,
): MenuApi.MenuTreeTableResponse | null {
  for (const menu of menus) {
    if (menu.menuId === menuId) {
      return menu;
    }
    if (menu.children && menu.children.length > 0) {
      const found = findMenuByIdInTree(menu.children, menuId);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

// 递归获取菜单树数据（用于TreeSelect组件）
function getMenuTreeForSelect(): Array<{
  children?: any[];
  label: string;
  value: string;
}> {
  // 检查数据是否存在
  if (!originalData.value || originalData.value.length === 0) {
    return [];
  }

  const convertToTreeData = (
    items: MenuApi.MenuTreeTableResponse[],
  ): Array<{
    children?: any[];
    label: string;
    value: string;
  }> => {
    return items
      .filter((item) => item.menuType === '0' || item.menuType === '1') // 只包含目录和菜单
      .map((item) => {
        const node = {
          label: item.menuName,
          value: item.menuCode,
        };

        // 处理子节点，注意 children 可能是 null
        if (
          item.children &&
          Array.isArray(item.children) &&
          item.children.length > 0
        ) {
          const children = convertToTreeData(item.children);
          if (children.length > 0) {
            return { ...node, children };
          }
        }

        return node;
      });
  };

  return convertToTreeData(originalData.value);
}

// 创建响应式的树形数据
const menuTreeData = computed(() => {
  return getMenuTreeForSelect();
});

// 初始化
onMounted(() => {
  loadMenuList();
});
</script>

<template>
  <Page>
    <!-- 查询表单 -->
    <ElCard>
      <QueryForm />
    </ElCard>

    <!-- 主内容区域 -->
    <Grid class="mt-5">
      <template #toolbar-actions>
        <ElButton
          type="primary"
          @click="handleAdd()"
          v-access:code="'MENU_ADD'"
        >
          新增菜单
        </ElButton>
        <ElButton class="ml-2" @click="expandAll"> 展开全部 </ElButton>
        <ElButton class="ml-2" @click="collapseAll"> 折叠全部 </ElButton>
      </template>

      <!-- 图标列插槽 -->
      <template #icon="{ row }">
        <div class="flex items-center justify-center">
          <IconifyIcon
            v-if="
              row.icon &&
              row.icon.trim() &&
              (row.menuType === '0' || row.menuType === '1')
            "
            :icon="row.icon"
            class="size-5"
          />
          <span v-else class="text-muted-foreground">-</span>
        </div>
      </template>

      <!-- 菜单类型列插槽 -->
      <template #menuType="{ row }">
        <ElTag :type="getMenuTypeTagType(row.menuType)">
          {{ getMenuTypeText(row.menuType) }}
        </ElTag>
      </template>

      <!-- 是否显示列插槽 -->
      <template #isSystem="{ row }">
        <ElTag :type="getIsSystemTagType(row.isSystem)">
          {{ getIsSystemText(row.isSystem) }}
        </ElTag>
      </template>

      <!-- 是否显示列插槽 -->
      <template #isShow="{ row }">
        <ElTag :type="getIsShowTagType(row.isShow)">
          {{ getIsShowText(row.isShow) }}
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
          @click="handleAdd(row.menuId, row.menuType)"
          v-access:code="'MENU_ADD'"
        >
          新增子菜单
        </ElButton>
        <ElButton
          type="primary"
          link
          size="small"
          @click="handleEdit(row.menuId, row.menuCode)"
          v-access:code="'MENU_EDIT'"
        >
          编辑
        </ElButton>
        <ElButton
          type="danger"
          link
          size="small"
          @click="handleDelete(row.menuId, row.menuName)"
          v-access:code="'MENU_DELETE'"
        >
          删除
        </ElButton>
      </template>
    </Grid>

    <!-- 新增/编辑菜单对话框 -->
    <ElDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
    >
      <MenuForm :disabled="{ menuCode: isEdit }" />

      <template #footer>
        <ElButton @click="handleCancel">取消</ElButton>
        <ElButton type="primary" @click="handleSave"> 确定 </ElButton>
      </template>
    </ElDialog>
  </Page>
</template>
