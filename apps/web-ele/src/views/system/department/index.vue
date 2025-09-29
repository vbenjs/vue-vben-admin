<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { DepartmentApi } from '#/api/system/department';

import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

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
  createDepartmentApi,
  deleteDepartmentApi,
  getDepartmentDetailApi,
  getDepartmentFullTreeApi,
  updateDepartmentApi,
} from '#/api/system/department';

defineOptions({ name: 'Department' });

// 状态映射
const depStatusMap = {
  '1': { text: '禁用', type: 'danger' },
  '0': { text: '启用', type: 'success' },
} as const;

// 系统内置映射
const isSystemMap = {
  '0': { text: '是', type: 'warning' },
  '1': { text: '否', type: 'success' },
} as const;

// 数据权限映射
const dataPermTypeMap = {
  A: { text: '全部数据权限', desc: '可访问所有部门数据' },
  C: { text: '当前数据权限', desc: '只能访问当前部门数据' },
  I: { text: '当前及下级', desc: '可访问当前及其下级部门数据' },
  Z: { text: '自定义权限', desc: '通过配置表指定可访问的部门' },
} as const;

// 表格数据
const originalData = ref<DepartmentApi.DepartmentTreeTableNode[]>([]); // 保存原始完整数据
const loading = ref(false);

// 当前编辑的部门编码
const currentDepCode = ref<string>();

// 对话框状态
const dialogVisible = ref(false);
const dialogTitle = ref('');
const isEdit = ref(false);
const currentDepId = ref<number>();

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
  schema: [],
  showCollapseButton: false,
  submitButtonOptions: {
    content: '查询',
  },
  resetButtonOptions: {
    content: '重置',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-3',
});

// VbenForm 部门表单
const [DepartmentForm, departmentFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'horizontal',
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入部门编码',
        disabled: isEdit,
      },
      fieldName: 'depCode',
      label: '部门编码',
      rules: z
        .string()
        .min(2, { message: '部门编码至少2个字符' })
        .max(64, { message: '部门编码最多64个字符' }),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入部门名称',
      },
      fieldName: 'depName',
      label: '部门名称',
      rules: z
        .string()
        .min(2, { message: '部门名称至少2个字符' })
        .max(64, { message: '部门名称最多64个字符' }),
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择数据权限类型',
        options: [
          { label: '全部数据权限', value: 'A' },
          { label: '当前数据权限', value: 'C' },
          { label: '当前及下级', value: 'I' },
          { label: '自定义权限', value: 'Z' },
        ],
      },
      fieldName: 'dataPermType',
      label: '数据权限',
      rules: z.string().min(1, { message: '请选择数据权限类型' }),
      help: '控制部门可访问的数据范围',
    },
    {
      component: 'TreeSelect',
      componentProps: () => ({
        placeholder: '请选择可访问的部门',
        multiple: true,
        clearable: true,
        filterable: true,
        data: departmentTreeData.value,
        nodeKey: 'depCode',
        checkStrictly: false,
        showCheckbox: true,
        checkOnClickNode: false,
        props: {
          label: 'depName',
        },
      }),
      fieldName: 'customDataPermissions',
      label: '自定义权限部门',
      help: '选择该部门可以访问数据的其他部门',
      dependencies: {
        triggerFields: ['dataPermType'],
        show: (values) => values.dataPermType === 'Z',
        rules: (values) => {
          if (values.dataPermType === 'Z') {
            return z
              .array(z.string())
              .min(1, { message: '请至少选择一个部门' })
              .refine(
                (permissions) => {
                  // 编辑模式下不允许选择当前部门
                  if (
                    isEdit.value &&
                    currentDepCode.value &&
                    permissions?.includes(currentDepCode.value)
                  ) {
                    return false;
                  }
                  return true;
                },
                {
                  message: '不能选择当前部门作为自定义权限部门',
                },
              );
          }
          return z.array(z.string()).optional();
        },
      },
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
      fieldName: 'depStatus',
      label: '状态',
      defaultValue: '0',
      rules: 'required',
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
    {
      component: 'TreeSelect',
      componentProps: () => ({
        placeholder: '请选择上级部门（留空为根级部门）',
        clearable: true,
        filterable: true,
        data: departmentTreeData.value,
        nodeKey: 'depCode',
        checkStrictly: true,
        showCheckbox: false,
        checkOnClickNode: true,
        props: {
          label: 'depName',
        },
      }),
      fieldName: 'parentDepCode',
      label: '上级部门',
      rules: z
        .string()
        .optional()
        .refine(
          (value) => {
            // 编辑模式下不允许选择当前部门作为上级部门
            if (isEdit.value && value === currentDepCode.value) {
              return false;
            }
            return true;
          },
          {
            message: '不能选择当前部门作为上级部门',
          },
        ),
    },
  ],
  wrapperClass: 'grid-cols-1',
});

// VxeTable配置
const gridOptions: VxeGridProps<DepartmentApi.DepartmentTreeTableNode> = {
  columns: [
    { type: 'seq', width: 70, title: '序号' },
    {
      field: 'depCode',
      title: '部门编码',
      minWidth: 180,
      showOverflow: 'tooltip',
      align: 'left',
      treeNode: true,
    },
    {
      field: 'depName',
      title: '部门名称',
      minWidth: 200,
    },
    {
      field: 'level',
      title: '层级',
      width: 80,
      align: 'center',
    },
    {
      field: 'dataPermType',
      title: '数据权限',
      width: 130,
      slots: { default: 'dataPermType' },
    },
    {
      field: 'depStatus',
      title: '状态',
      width: 90,
      slots: { default: 'depStatus' },
    },
    {
      field: 'isSystem',
      title: '系统内置',
      width: 90,
      slots: { default: 'isSystem' },
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

// 创建响应式的树形数据 (方案3：computed wrapper)
const departmentTreeData = computed(() => {
  return originalData.value;
});

// 加载部门列表
async function loadDepartmentList() {
  loading.value = true;
  gridOptions.loading = true;
  try {
    const queryParams = queryForm.form.values;

    // 完整树模式
    const params: DepartmentApi.GetDepartmentFullTreeRequest = {
      depStatus: queryParams?.depStatus || undefined,
      keyword: queryParams?.keyword || undefined,
      includeDisabled: true,
      expandAll: true,
      includeUserCount: true,
    };

    const response = await getDepartmentFullTreeApi(params);

    originalData.value = response; // 保存原始数据供下拉选择使用
    // 通过 gridApi 更新状态（响应式）
    gridApi.setState({
      gridOptions: {
        data: response,
      },
    });
  } catch (error) {
    // ElMessage.error('加载部门列表失败');
    console.error('Load department list error:', error);
  } finally {
    loading.value = false;
    gridOptions.loading = false;
  }
}
// 处理查询表单提交
function onSubmit(_values: Record<string, any>) {
  // 树表模式直接重新加载数据
  loadDepartmentList();
}

// 新增部门
function handleAdd(depCode?: string) {
  dialogTitle.value = '新增部门';
  isEdit.value = false;
  currentDepId.value = undefined;
  currentDepCode.value = undefined; // 清空当前部门编码
  dialogVisible.value = true;

  // 重置表单
  departmentFormApi.resetForm();

  const defaultValues: Partial<DepartmentApi.CreateDepartmentRequest> = {
    depStatus: '0',
    dataPermType: 'I',
    sort: 0,
  };

  if (depCode) {
    defaultValues.parentDepCode = depCode;
  }

  // 设置默认值
  departmentFormApi.setValues(defaultValues);
}

// 编辑部门
async function handleEdit(depId: number) {
  try {
    dialogTitle.value = '编辑部门';
    isEdit.value = true;
    currentDepId.value = depId;
    const response = await getDepartmentDetailApi({ depId });

    // 保存当前部门编码，用于验证规则
    currentDepCode.value = response.depCode;

    // 设置表单值
    departmentFormApi.setValues(response);
    dialogVisible.value = true;
  } catch (error) {
    // ElMessage.error('获取部门详情失败');
    console.error('Get department detail error:', error);
  }
}

// 删除部门
async function handleDelete(depId: number, name: string) {
  try {
    await ElMessageBox.confirm(`确定要删除部门 "${name}" 吗？`, '确认删除', {
      type: 'warning',
    });

    await deleteDepartmentApi({ depId });
    ElMessage.success('删除成功');
    loadDepartmentList();
  } catch (error) {
    if (error !== 'cancel') {
      // ElMessage.error('删除失败');
      console.error('Delete department error:', error);
    }
  }
}

// 保存部门
async function handleSave() {
  try {
    // 进行表单验证
    const validationResult = await departmentFormApi.validate();

    if (!validationResult.valid) {
      ElMessage.warning('请根据提示内容填写表单');
      return; // 验证失败，停止执行
    }

    // 验证通过后获取表单值
    const values = await departmentFormApi.getValues();

    // 清理数据：当不是自定义权限时，清除customDataPermissions
    if (values.dataPermType !== 'Z') {
      values.customDataPermissions = undefined;
    }

    if (isEdit.value && currentDepId.value) {
      await updateDepartmentApi({
        ...values,
        depId: currentDepId.value,
      } as DepartmentApi.UpdateDepartmentRequest);
      ElMessage.success('更新成功');
    } else {
      await createDepartmentApi(
        values as DepartmentApi.CreateDepartmentRequest,
      );
      ElMessage.success('创建成功');
    }

    dialogVisible.value = false;
    loadDepartmentList();
  } catch (error) {
    // ElMessage.error(isEdit.value ? '更新失败' : '创建失败');
    console.error('Save department error:', error);
    throw error; // 重新抛出错误，阻止表单关闭
  }
}

// 取消
function handleCancel() {
  dialogVisible.value = false;
  departmentFormApi.resetForm();
}

// 获取状态标签类型
function getStatusTagType(depStatus: string): 'danger' | 'success' {
  return (
    depStatusMap[depStatus as keyof typeof depStatusMap]?.type || 'success'
  );
}

// 获取状态文本
function getStatusText(depStatus: string): string {
  return depStatusMap[depStatus as keyof typeof depStatusMap]?.text || '未知';
}

// 获取状态标签类型
function getIsSystemTagType(isSystem: string): 'success' | 'warning' {
  return isSystemMap[isSystem as keyof typeof isSystemMap]?.type || 'success';
}

// 获取状态文本
function getIsSystemText(isSystem: string): string {
  return isSystemMap[isSystem as keyof typeof isSystemMap]?.text || '未知';
}

// 获取数据权限文本
function getDataPermTypeText(dataPermType: string): string {
  return (
    dataPermTypeMap[dataPermType as keyof typeof dataPermTypeMap]?.text ||
    '未知'
  );
}

// 获取数据权限描述
function getDataPermTypeDesc(dataPermType: string): string {
  return (
    dataPermTypeMap[dataPermType as keyof typeof dataPermTypeMap]?.desc ||
    '未知'
  );
}
// 初始化
onMounted(() => {
  loadDepartmentList();
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
          v-access:code="'DEPARTMENT_ADD'"
        >
          新增部门
        </ElButton>
        <ElButton class="ml-2" @click="expandAll"> 展开全部 </ElButton>
        <ElButton class="ml-2" @click="collapseAll"> 折叠全部 </ElButton>
      </template>

      <!-- 数据权限列插槽 -->
      <template #dataPermType="{ row }">
        <span :title="getDataPermTypeDesc(row.dataPermType)">
          {{ getDataPermTypeText(row.dataPermType) }}
        </span>
      </template>

      <!-- 状态列插槽 -->
      <template #depStatus="{ row }">
        <ElTag :type="getStatusTagType(row.depStatus)">
          {{ getStatusText(row.depStatus) }}
        </ElTag>
      </template>

      <!-- 系统内置列插槽 -->
      <template #isSystem="{ row }">
        <ElTag :type="getIsSystemTagType(row.isSystem)">
          {{ getIsSystemText(row.isSystem) }}
        </ElTag>
      </template>

      <!-- 操作列插槽 -->
      <template #action="{ row }">
        <ElButton
          type="primary"
          link
          size="small"
          @click="handleAdd(row.depCode)"
          v-access:code="'DEPARTMENT_ADD'"
        >
          新增下级部门
        </ElButton>
        <ElButton
          type="primary"
          link
          size="small"
          @click="handleEdit(row.depId)"
          v-if="row.isSystem === '1'"
          v-access:code="'DEPARTMENT_EDIT'"
        >
          编辑
        </ElButton>
        <ElButton
          type="danger"
          link
          size="small"
          @click="handleDelete(row.depId, row.depName)"
          v-if="row.isSystem === '1'"
          v-access:code="'DEPARTMENT_DELETE'"
        >
          删除
        </ElButton>
      </template>
    </Grid>

    <!-- 新增/编辑部门对话框 -->
    <ElDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <DepartmentForm :disabled="{ depCode: isEdit }" />

      <template #footer>
        <ElButton @click="handleCancel">取消</ElButton>
        <ElButton type="primary" @click="handleSave"> 确定 </ElButton>
      </template>
    </ElDialog>
  </Page>
</template>
