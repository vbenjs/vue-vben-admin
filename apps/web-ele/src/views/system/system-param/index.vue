<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SystemParamApi } from '#/api/system/system-param';

import { onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import dayjs from 'dayjs';
import {
  ElButton,
  ElCard,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElPagination,
  ElRow,
  ElTag,
} from 'element-plus';

import { useVbenForm, z } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createSystemParamApi,
  deleteSystemParamApi,
  getSystemParamDetailApi,
  getSystemParamListApi,
  refreshSystemParamCacheApi,
  updateSystemParamApi,
} from '#/api/system/system-param';

defineOptions({ name: 'SystemParam' });

// 参数类型映射
const paramTypeMap = {
  '0': { text: '字符串', type: 'primary' },
  '1': { text: '数字', type: 'success' },
  '2': { text: '布尔值', type: 'warning' },
  '3': { text: 'JSON对象', type: 'danger' },
} as const;

// 系统参数映射
const isSystemMap = {
  '0': { text: '是', type: 'warning' },
  '1': { text: '否', type: 'success' },
} as const;

// 表格数据
const tableData = ref<SystemParamApi.SystemParamListResponse[]>([]);
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
const currentParamId = ref<number>();

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
        placeholder: '请输入参数编码',
        clearable: true,
      },
      fieldName: 'paramCode',
      label: '参数编码',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入参数名称',
        clearable: true,
      },
      fieldName: 'paramName',
      label: '参数名称',
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择参数类型',
        clearable: true,
        options: [
          { label: '字符串', value: '0' },
          { label: '数字', value: '1' },
          { label: '布尔值', value: '2' },
          { label: 'JSON对象', value: '3' },
        ],
      },
      fieldName: 'paramType',
      label: '参数类型',
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

// VbenForm 系统参数表单
const [SystemParamForm, systemParamFormApi] = useVbenForm({
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
        placeholder: '请输入参数编码，如：sys.system.name',
      },
      fieldName: 'paramCode',
      label: '参数编码',
      rules: z
        .string()
        .min(2, { message: '参数编码至少2个字符' })
        .max(64, { message: '参数编码最多64个字符' })
        .regex(/^\w+$/, '参数编码只能包含字母、数字和下划线'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入参数名称',
      },
      fieldName: 'paramName',
      label: '参数名称',
      rules: z
        .string()
        .min(2, { message: '参数名称至少2个字符' })
        .max(100, { message: '参数名称最多100个字符' }),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入参数值',
      },
      fieldName: 'paramValue',
      label: '参数值',
      rules: z
        .string()
        .min(1, { message: '参数值至少1个字符' })
        .max(64, { message: '参数值最多64个字符' }),
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择参数类型',
        options: [
          { label: '字符串', value: '0' },
          { label: '数字', value: '1' },
          { label: '布尔值', value: '2' },
          { label: 'JSON对象', value: '3' },
        ],
      },
      fieldName: 'paramType',
      label: '参数类型',
      rules: z.string().min(1, { message: '请选择参数类型' }),
      defaultValue: 'STRING',
    },
    {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入参数描述',
        rows: 3,
      },
      fieldName: 'paramDesc',
      label: '参数描述',
      rules: z
        .string()
        .max(255, { message: '参数描述最多255个字符' })
        .optional(),
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
const gridOptions: VxeGridProps<SystemParamApi.SystemParamListResponse> = {
  columns: [
    { type: 'seq', width: 70, title: '序号' },
    {
      field: 'paramCode',
      title: '参数编码',
      minWidth: 150,
      showOverflow: 'tooltip',
    },
    {
      field: 'paramName',
      title: '参数名称',
      minWidth: 150,
      showOverflow: 'tooltip',
    },
    {
      field: 'paramValue',
      title: '参数值',
      minWidth: 180,
      showOverflow: 'tooltip',
    },
    {
      field: 'paramType',
      title: '参数类型',
      width: 100,
      slots: { default: 'paramType' },
    },
    {
      field: 'isSystem',
      title: '系统参数',
      width: 100,
      slots: { default: 'isSystem' },
    },
    {
      field: 'createdTime',
      title: '创建时间',
      width: 160,
      slots: { default: 'createdTime' },
    },
    {
      title: '操作',
      width: 150,
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

// 加载系统参数列表
async function loadSystemParamList() {
  loading.value = true;
  gridOptions.loading = true;
  try {
    const queryParams = queryForm.form.values;
    const params: SystemParamApi.GetSystemParamListRequest = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      keyword: queryParams?.keyword || undefined,
      paramName: queryParams?.paramName || undefined,
      paramCode: queryParams?.paramCode || undefined,
      paramType: queryParams?.paramType || undefined,
      isSystem: queryParams?.isSystem || undefined,
    };

    const response = await getSystemParamListApi(params);

    tableData.value = response.list;
    pagination.total = response.total;
    pagination.pageNum = response.pageNum;

    // 更新VxeTable数据
    gridApi.setState({
      gridOptions: {
        data: response.list,
      },
    });
  } catch (error) {
    // ElMessage.error('加载系统参数列表失败');
    console.error('Load system param list error:', error);
  } finally {
    loading.value = false;
    gridOptions.loading = false;
  }
}

// 处理查询表单提交
function onSubmit(_values: Record<string, any>) {
  pagination.pageNum = 1;
  loadSystemParamList();
}

// 分页变化
function handlePageChange(page: number) {
  pagination.pageNum = page;
  loadSystemParamList();
}

function handleSizeChange(size: number) {
  pagination.pageSize = size;
  pagination.pageNum = 1;
  loadSystemParamList();
}

// 新增参数
function handleAdd() {
  dialogTitle.value = '新增系统参数';
  isEdit.value = false;
  currentParamId.value = undefined;
  dialogVisible.value = true;

  // 重置表单并设置默认值
  systemParamFormApi.resetForm();
  systemParamFormApi.setValues({
    paramType: '0',
  });
}

// 编辑参数
async function handleEdit(param: SystemParamApi.SystemParamListResponse) {
  try {
    dialogTitle.value = '编辑系统参数';
    isEdit.value = true;
    currentParamId.value = param.paramId;

    // 获取详情数据
    const response = await getSystemParamDetailApi({ paramId: param.paramId });

    // 设置表单值
    systemParamFormApi.setValues({
      paramCode: response.paramCode,
      paramName: response.paramName,
      paramValue: response.paramValue,
      paramType: response.paramType,
      isSystem: response.isSystem,
      paramDesc: response.paramDesc,
    });
    dialogVisible.value = true;
  } catch (error) {
    // ElMessage.error('获取参数详情失败');
    console.error('Get param detail error:', error);
  }
}

// 删除参数
async function handleDelete(paramId: number, paramName: string) {
  try {
    await ElMessageBox.confirm(
      `确定要删除参数 "${paramName}" 吗？`,
      '确认删除',
      {
        type: 'warning',
      },
    );

    await deleteSystemParamApi({ paramId });
    ElMessage.success('删除成功');
    loadSystemParamList();
  } catch (error) {
    if (error !== 'cancel') {
      // ElMessage.error('删除失败');
      console.error('Delete param error:', error);
    }
  }
}

// 刷新缓存
async function handleRefreshCache() {
  try {
    await refreshSystemParamCacheApi();
    ElMessage.success('缓存刷新成功');
  } catch (error) {
    // ElMessage.error('缓存刷新失败');
    console.error('Refresh cache error:', error);
  }
}

// 保存参数
async function handleSave() {
  try {
    // 进行表单验证
    const validationResult = await systemParamFormApi.validate();

    if (!validationResult.valid) {
      ElMessage.warning('请根据提示内容填写表单');
      return; // 验证失败，停止执行
    }
    const values = await systemParamFormApi.getValues();

    if (isEdit.value && currentParamId.value) {
      await updateSystemParamApi({
        ...values,
        paramId: currentParamId.value,
      } as SystemParamApi.UpdateSystemParamRequest);
      ElMessage.success('更新成功');
    } else {
      await createSystemParamApi(
        values as SystemParamApi.CreateSystemParamRequest,
      );
      ElMessage.success('创建成功');
    }

    dialogVisible.value = false;
    loadSystemParamList();
  } catch (error) {
    // ElMessage.error(isEdit.value ? '更新失败' : '创建失败');
    console.error('Save param error:', error);
    throw error; // 重新抛出错误，阻止表单关闭
  }
}

// 取消
function handleCancel() {
  dialogVisible.value = false;
  systemParamFormApi.resetForm();
}

// 获取参数类型标签类型
function getParamTypeTagType(
  paramType: string,
): 'danger' | 'primary' | 'success' | 'warning' {
  return (
    paramTypeMap[paramType as keyof typeof paramTypeMap]?.type || 'primary'
  );
}

// 获取参数类型文本
function getParamTypeText(paramType: string): string {
  return paramTypeMap[paramType as keyof typeof paramTypeMap]?.text || '未知';
}

// 获取系统参数标签类型
function getIsSystemTagType(isSystem: string): 'success' | 'warning' {
  return isSystemMap[isSystem as keyof typeof isSystemMap]?.type || 'primary';
}

// 获取系统参数文本
function getIsSystemText(isSystem: string): string {
  return isSystemMap[isSystem as keyof typeof isSystemMap]?.text || '未知';
}

// 初始化
onMounted(() => {
  loadSystemParamList();
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
            v-access:code="'PARAM_ADD'"
          >
            新增参数
          </ElButton>
          <ElButton type="success" @click="handleRefreshCache">
            刷新缓存
          </ElButton>
        </template>

        <!-- 参数类型列插槽 -->
        <template #paramType="{ row }">
          <ElTag :type="getParamTypeTagType(row.paramType)">
            {{ getParamTypeText(row.paramType) }}
          </ElTag>
        </template>

        <!-- 系统参数列插槽 -->
        <template #isSystem="{ row }">
          <ElTag :type="getIsSystemTagType(row.isSystem)">
            {{ getIsSystemText(row.isSystem) }}
          </ElTag>
        </template>

        <!-- 创建时间列插槽 -->
        <template #createdTime="{ row }">
          <span>{{ formatDateTime(row.createdTime) }}</span>
        </template>

        <!-- 操作列插槽 -->
        <template #action="{ row }">
          <ElButton
            v-if="row.isSystem !== '0'"
            type="primary"
            link
            size="small"
            @click="handleEdit(row)"
            v-access:code="'PARAM_EDIT'"
          >
            编辑
          </ElButton>
          <ElButton
            v-if="row.isSystem !== '0'"
            type="danger"
            link
            size="small"
            @click="handleDelete(row.paramId, row.paramName)"
            v-access:code="'PARAM_DELETE'"
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

    <!-- 新增/编辑参数对话框 -->
    <ElDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <SystemParamForm :disabled="{ paramCode: isEdit }" />

      <template #footer>
        <ElButton @click="handleCancel"> 取消 </ElButton>
        <ElButton type="primary" @click="handleSave"> 确定 </ElButton>
      </template>
    </ElDialog>
  </Page>
</template>
