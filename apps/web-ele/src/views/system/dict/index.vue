<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { DictApi } from '#/api/system/dict';

import { onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import dayjs from 'dayjs';
import {
  ElButton,
  ElCard,
  ElCol,
  ElDialog,
  ElMessage,
  ElMessageBox,
  ElPagination,
  ElRow,
  ElTag,
  ElTree,
} from 'element-plus';

import { useVbenForm, z } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createDictApi,
  createDictTypeApi,
  createDictValueApi,
  deleteDictApi,
  deleteDictTypeApi,
  deleteDictValueApi,
  getDictDetailApi,
  getDictListApi,
  getDictTypeDetailApi,
  getDictTypeTreeApi,
  getDictValueDetailApi,
  getDictValueListApi,
  getDictValueTreeApi,
  updateDictApi,
  updateDictTypeApi,
  updateDictValueApi,
} from '#/api/system/dict';

defineOptions({ name: 'Dict' });

// 状态映射
const statusMap = {
  '0': { text: '启用', type: 'success' },
  '1': { text: '禁用', type: 'danger' },
} as const;

// 数据结构映射
const structMap = {
  '0': { text: '列表', type: 'primary' },
  '1': { text: '树状', type: 'primary' },
} as const;

// 数据类型映射
const dictTypeMap = {
  '0': { text: '字符串', type: 'primary' },
} as const;

// 系统内置映射
const isSystemMap = {
  '0': { text: '是', type: 'warning' },
  '1': { text: '否', type: 'success' },
} as const;

// 左侧树数据
const treeData = ref<DictApi.DictTypeTreeResponse[]>([]);
const treeLoading = ref(false);
const selectedTypeCode = ref<null | string>();
const selectedTypeName = ref<string>();
const currentDictTypeCode = ref<string>();
const currentDictTypeId = ref<number>();

// 右侧表格数据
const tableData = ref<DictApi.DictListResponse[]>([]);
const tableLoading = ref(false);
const pagination = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 10,
});

// 对话框状态
const typeDialogVisible = ref(false);
const dictDialogVisible = ref(false);
const dictValueDialogVisible = ref(false);
const typeDialogTitle = ref('');
const dictDialogTitle = ref('');
const dictValueDialogTitle = ref('');
const isTypeEdit = ref(false);
const isDictEdit = ref(false);
const isDictValueEdit = ref(false);

// 字典值相关状态
const dictValuesMap = ref(new Map<number, DictApi.DictValueListResponse[]>()); // 缓存字典值数据
const currentDictCode = ref<string>(); // 当前操作的字典编码
const currentDictValueId = ref<number>();
const currentDictStructType = ref<string>(); // 当前字典的数据结构
const currentParentId = ref<number>(); // 当前选择的父字典值ID

// 格式化时间
function formatDateTime(dateTime?: string): string {
  if (!dateTime) return '';
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
}

// VxeTable配置
const gridOptions: VxeGridProps<DictApi.DictListResponse> = {
  columns: [
    { type: 'checkbox', width: 60 },
    {
      type: 'expand',
      width: 50,
      title: '',
      slots: { content: 'expand' },
    },
    { type: 'seq', width: 70, title: '序号' },
    {
      field: 'dictCode',
      title: '字典编码',
      minWidth: 150,
      showOverflow: 'tooltip',
    },
    {
      field: 'dictName',
      title: '字典名称',
      minWidth: 150,
      showOverflow: 'tooltip',
    },
    {
      field: 'dictStructType',
      title: '数据结构',
      width: 120,
      showOverflow: 'tooltip',
      slots: { default: 'dictStructType' },
    },
    {
      field: 'dictType',
      title: '数据类型',
      width: 120,
      showOverflow: 'tooltip',
      slots: { default: 'dictType' },
    },
    // {
    //   field: 'dictTypeCode',
    //   title: '分类编码',
    //   minWidth: 120,
    //   showOverflow: 'tooltip',
    // },
    {
      field: 'isSystem',
      title: '系统内置',
      width: 80,
      showOverflow: 'tooltip',
      slots: { default: 'isSystem' },
    },
    {
      field: 'dictStatus',
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
      width: 180,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ],
  data: [],
  expandConfig: {
    lazy: true,
    loadMethod: ({ row }) => loadDictValues(row),
  },
  pagerConfig: {
    enabled: false,
  },
  loading: false,
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

// 选中的数据
const selectedRows = ref<DictApi.DictListResponse[]>([]);

// VbenForm 字典类型表单
const [DictTypeForm, dictTypeFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'vertical',
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入类型编码',
        disabled: isTypeEdit,
      },
      fieldName: 'dictTypeCode',
      label: '字典类型编码',
      rules: z
        .string()
        .min(2, { message: '字典类型编码至少2个字符' })
        .max(50, { message: '字典类型编码最多50个字符' })
        .regex(/^\w+$/, '字典类型编码只能包含字母、数字和下划线'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入字典类型名称',
      },
      fieldName: 'dictTypeName',
      label: '字典类型名称',
      rules: z
        .string()
        .min(2, { message: '类型名称至少2个字符' })
        .max(50, { message: '类型名称最多50个字符' }),
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
      help: '数字越小排序越靠前',
    },
    {
      component: 'TreeSelect',
      componentProps: () => ({
        placeholder: '请选择上级字典类型（留空为根级字典类型）',
        clearable: true,
        filterable: true,
        data: treeData.value,
        nodeKey: 'dictTypeCode',
        checkStrictly: true,
        showCheckbox: false,
        checkOnClickNode: true,
        props: {
          label: 'dictTypeName',
        },
      }),
      fieldName: 'parentDictTypeCode',
      label: '上级字典类型',
      rules: z
        .string()
        .optional()
        .refine(
          (value) => {
            // 编辑模式下不允许选择当前字典类型作为上级字典类型
            if (isTypeEdit.value && value === currentDictTypeCode.value) {
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

// VbenForm 字典基础信息表单
const [DictInfoForm, dictInfoFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'vertical',
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入字典编码',
      },
      fieldName: 'dictCode',
      label: '字典编码',
      rules: z
        .string()
        .min(2, { message: '字典编码至少2个字符' })
        .max(64, { message: '字典编码最多64个字符' }),
      help: '全局唯一，建议使用下划线分隔',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入字典名称',
      },
      fieldName: 'dictName',
      label: '字典名称',
      rules: z
        .string()
        .min(2, { message: '字典名称至少2个字符' })
        .max(64, { message: '字典名称最多64个字符' }),
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择字典数据结构',
        disabled: isDictEdit,
        options: [
          { label: '列表', value: '0' },
          { label: '树形', value: '1' },
        ],
      },
      fieldName: 'dictStructType',
      label: '字典数据结构',
      rules: z.string().min(1, { message: '请选择字典数据结构' }),
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择字典数据类型',
        disabled: isDictEdit,
        options: [{ label: '字符串', value: '0' }],
      },
      fieldName: 'dictType',
      label: '字典数据类型',
      rules: z.string().min(1, { message: '请选择字典数据类型' }),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入字典分类编码',
      },
      fieldName: 'dictTypeCode',
      label: '字典分类编码',
      rules: z
        .string()
        .min(2, { message: '字典分类编码至少2个字符' })
        .max(64, { message: '字典分类编码最多64个字符' }),
      help: '用于分组管理字典',
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择字典状态',
        options: [
          { label: '启用', value: '0' },
          { label: '禁用', value: '1' },
        ],
      },
      fieldName: 'dictStatus',
      label: '字典状态',
      defaultValue: '0',
      rules: z.string().min(1, { message: '请选择字典状态' }),
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

// VbenForm 字典值表单
const [DictValueForm, dictValueFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'vertical',
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '字典编码（自动填充）',
        disabled: true,
      },
      fieldName: 'dictCode',
      label: '字典编码',
      rules: z.string().min(1, { message: '字典编码不能为空' }),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入字典值标签',
      },
      fieldName: 'dictLabel',
      label: '字典标签',
      rules: z
        .string()
        .min(1, { message: '字典标签不能为空' })
        .max(64, { message: '字典标签最多64个字符' }),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入字典值',
      },
      fieldName: 'dictValue',
      label: '字典值',
      rules: z
        .string()
        .min(1, { message: '字典值不能为空' })
        .max(128, { message: '字典值最多128个字符' }),
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
      help: '数字越小排序越靠前',
    },
    {
      component: 'TreeSelect',
      componentProps: () => ({
        placeholder: '请选择上级字典值（留空为根级）',
        clearable: true,
        filterable: true,
        data: getParentDictValueOptions(),
        nodeKey: 'dictValueId',
        checkStrictly: true,
        showCheckbox: false,
        checkOnClickNode: true,
        props: {
          label: 'dictLabel',
          children: 'children',
        },
      }),
      fieldName: 'parentId',
      label: '上级字典值',
      dependencies: {
        triggerFields: ['dictCode'],
        show: () => currentDictStructType.value === '1', // 只在树形结构时显示
      },
      rules: z.number().optional(),
    },
  ],
  wrapperClass: 'grid-cols-1',
});

// 加载字典类型树
async function loadDictTypeTree() {
  treeLoading.value = true;
  try {
    const response = await getDictTypeTreeApi({});
    treeData.value = response;
  } catch (error) {
    // ElMessage.error('加载字典类型失败');
    console.error('Load dict type tree error:', error);
  } finally {
    treeLoading.value = false;
  }
}

// 加载字典数据列表
async function loadDictList() {
  if (!selectedTypeCode.value) {
    tableData.value = [];
    gridApi.setState({
      gridOptions: {
        data: [],
      },
    });
    return;
  }

  tableLoading.value = true;
  gridOptions.loading = true;
  try {
    const params: DictApi.GetDictListRequest = {
      dictTypeCode: selectedTypeCode.value,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
    };

    const response = await getDictListApi(params);

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
    // ElMessage.error('加载字典数据失败');
    console.error('Load dict list error:', error);
    // 错误时设置空数据
    gridApi.setState({
      gridOptions: {
        data: [],
      },
    });
  } finally {
    tableLoading.value = false;
    gridOptions.loading = false;
  }
}

// 加载所有字典数据列表
async function loadAllDictList() {
  tableLoading.value = true;
  gridOptions.loading = true;
  try {
    const params: DictApi.GetDictListRequest = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      // 不传dictTypeCode，查询所有字典
    };

    const response = await getDictListApi(params);

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
    // ElMessage.error('加载所有字典数据失败');
    console.error('Load all dict list error:', error);
    // 错误时设置空数据
    gridApi.setState({
      gridOptions: {
        data: [],
      },
    });
  } finally {
    tableLoading.value = false;
    gridOptions.loading = false;
  }
}

// 选择全部字典
function handleSelectAllDicts() {
  selectedTypeCode.value = null;
  selectedTypeName.value = '';
  pagination.pageNum = 1;
  loadAllDictList();
}

// 树节点点击
function handleNodeClick(data: DictApi.DictTypeTreeResponse) {
  selectedTypeCode.value = data.dictTypeCode;
  selectedTypeName.value = data.dictTypeName;
  pagination.pageNum = 1;
  loadDictList();
}

// 分页变化
function handlePageChange(page: number) {
  pagination.pageNum = page;
  if (selectedTypeCode.value === null) {
    loadAllDictList();
  } else {
    loadDictList();
  }
}

function handleSizeChange(size: number) {
  pagination.pageSize = size;
  pagination.pageNum = 1;
  if (selectedTypeCode.value === null) {
    loadAllDictList();
  } else {
    loadDictList();
  }
}

// 新增字典类型
function handleAddType() {
  typeDialogTitle.value = '新增字典类型';
  isTypeEdit.value = false;
  typeDialogVisible.value = true;

  // 重置表单
  dictTypeFormApi.resetForm();
  dictTypeFormApi.setValues({
    sort: 0,
    parentDictTypeCode: selectedTypeCode.value,
  });
}

// 编辑字典类型
async function handleEditType(node: DictApi.DictTypeTreeResponse) {
  try {
    typeDialogTitle.value = '编辑字典类型';
    isTypeEdit.value = true;
    currentDictTypeCode.value = node.dictTypeCode;
    currentDictTypeId.value = node.dictTypeId;

    // 获取详细信息
    const detail = await getDictTypeDetailApi({ dictTypeId: node.dictTypeId });
    dictTypeFormApi.setValues(detail);
    typeDialogVisible.value = true;
  } catch (error) {
    // ElMessage.error('获取字典类型详情失败');
    console.error('Get dict type detail error:', error);
  }
}

// 删除字典类型
async function handleDeleteType(node: DictApi.DictTypeTreeResponse) {
  try {
    await ElMessageBox.confirm(
      `确定要删除字典类型 "${node.dictTypeName}" 吗？`,
      '确认删除',
      { type: 'warning' },
    );

    await deleteDictTypeApi({ dictTypeId: node.dictTypeId });
    ElMessage.success('删除成功');
    loadDictTypeTree();
    if (selectedTypeCode.value === node.dictTypeCode) {
      selectedTypeCode.value = null;
      selectedTypeName.value = '';
      tableData.value = [];
      // 更新VxeTable数据
      gridApi.setState({
        gridOptions: {
          data: [],
        },
      });
    }
  } catch (error) {
    if (error !== 'cancel') {
      // ElMessage.error('删除失败');
      console.error('Delete dict type error:', error);
    }
  }
}

// 新增字典基础信息
function handleAddDict() {
  dictDialogTitle.value = '新增字典';
  isDictEdit.value = false;
  dictDialogVisible.value = true;

  // 重置表单
  dictInfoFormApi.resetForm();
  dictInfoFormApi.setValues({
    dictTypeCode: selectedTypeCode.value || '',
    dictStatus: '0',
    dictStructType: '0',
    dictType: '0',
  });
}

// 编辑字典基础信息
async function handleEditDict(row: DictApi.DictListResponse) {
  try {
    dictDialogTitle.value = '编辑字典';
    isDictEdit.value = true;

    // 获取详细信息
    const detail = await getDictDetailApi({ dictId: row.dictId });
    dictInfoFormApi.setValues(detail);
    dictDialogVisible.value = true;
  } catch (error) {
    // ElMessage.error('获取字典详情失败');
    console.error('Get dict detail error:', error);
  }
}

// 删除字典数据
async function handleDeleteDict(dictId: number, dictName: string) {
  try {
    await ElMessageBox.confirm(
      `确定要删除字典 "${dictName}" 吗？`,
      '确认删除',
      {
        type: 'warning',
      },
    );

    await deleteDictApi({ dictId });
    ElMessage.success('删除成功');
    if (selectedTypeCode.value === null) {
      loadAllDictList();
    } else {
      loadDictList();
    }
  } catch (error) {
    if (error !== 'cancel') {
      // ElMessage.error('删除失败');
      console.error('Delete dict error:', error);
    }
  }
}

// 保存字典类型
async function handleSaveType() {
  try {
    // 进行表单验证
    const validationResult = await dictTypeFormApi.validate();

    if (!validationResult.valid) {
      ElMessage.warning('请根据提示内容填写表单');
      return; // 验证失败，停止执行
    }

    // 验证通过后获取表单值
    const values = await dictTypeFormApi.getValues();

    if (isTypeEdit.value) {
      const tempValues = { dictTypeId: currentDictTypeId.value, ...values };
      await updateDictTypeApi(tempValues as DictApi.UpdateDictTypeRequest);
      ElMessage.success('更新成功');
    } else {
      await createDictTypeApi(values as DictApi.CreateDictTypeRequest);
      ElMessage.success('创建成功');
    }

    typeDialogVisible.value = false;
    loadDictTypeTree();
  } catch (error) {
    // ElMessage.error(isTypeEdit.value ? '更新失败' : '创建失败');
    console.error('Save dict type error:', error);
    throw error; // 重新抛出错误，阻止表单关闭
  }
}

// 保存字典数据
async function handleSaveDict() {
  try {
    // 进行表单验证
    const validationResult = await dictInfoFormApi.validate();

    if (!validationResult.valid) {
      ElMessage.warning('请根据提示内容填写表单');
      return; // 验证失败，停止执行
    }

    // 验证通过后获取表单值
    const values = await dictInfoFormApi.getValues();

    if (isDictEdit.value) {
      await updateDictApi(values as DictApi.UpdateDictRequest);
      ElMessage.success('更新成功');
    } else {
      await createDictApi(values as DictApi.CreateDictRequest);
      ElMessage.success('创建成功');
    }

    dictDialogVisible.value = false;
    loadDictList();
  } catch (error) {
    // ElMessage.error(isDictEdit.value ? '更新失败' : '创建失败');
    console.error('Save dict error:', error);
    throw error; // 重新抛出错误，阻止表单关闭
  }
}

// 取消
function handleCancelType() {
  typeDialogVisible.value = false;
  dictTypeFormApi.resetForm();
}

function handleCancelDict() {
  dictDialogVisible.value = false;
  dictInfoFormApi.resetForm();
}

// 获取系统内置文本
function getStructTypeText(status: string): string {
  return structMap[status as keyof typeof structMap]?.text || '未知';
}

// 获取系统内置文本
function getDictTypeText(status: string): string {
  return dictTypeMap[status as keyof typeof dictTypeMap]?.text || '未知';
}

// 获取系统内置标签类型
function getIsSystemTagType(status: string): 'success' | 'warning' {
  return isSystemMap[status as keyof typeof isSystemMap]?.type || 'success';
}

// 获取系统内置文本
function getIsSystemText(status: string): string {
  return isSystemMap[status as keyof typeof isSystemMap]?.text || '未知';
}

// 获取状态标签类型
function getStatusTagType(status: string): 'danger' | 'success' {
  return statusMap[status as keyof typeof statusMap]?.type || 'success';
}

// 获取状态文本
function getStatusText(status: string): string {
  return statusMap[status as keyof typeof statusMap]?.text || '未知';
}

// 表格选择变化 - VxeTable 版本
function handleSelectionChange(selection: {
  records: DictApi.DictListResponse[];
}) {
  selectedRows.value = selection.records;
}

// 获取父字典值选项（用于TreeSelect）
function getParentDictValueOptions() {
  if (!currentDictCode.value) return [];

  // 获取当前字典的字典值数据
  const dictValues = [...dictValuesMap.value.values()]
    .flat()
    .filter((item) => item.dictCode === currentDictCode.value);

  // 如果是树形结构，返回树形数据；否则返回平铺数据
  return dictValues;
}

// ===== 字典值相关方法 =====

// 加载字典值
async function loadDictValues(row: DictApi.DictListResponse): Promise<void> {
  try {
    const dictCode = row.dictCode;

    // 根据字典数据结构选择API
    const response:
      | DictApi.DictValueListResponse[]
      | DictApi.DictValueTreeResponse[] =
      row.dictStructType === '1'
        ? await getDictValueTreeApi({ dictCode }) // 树形结构
        : await getDictValueListApi({ dictCode }); // 列表结构

    // 缓存字典值数据
    dictValuesMap.value.set(
      row.dictId,
      response as DictApi.DictValueListResponse[],
    );
  } catch (error) {
    // ElMessage.error('加载字典值失败');
    console.error('Load dict values error:', error);
    // 设置空数组避免重复加载
    dictValuesMap.value.set(row.dictId, []);
  }
}

// 新增字典值
function handleAddDictValue(
  dictCode: string,
  dictStructType: string,
  parentId?: number,
) {
  dictValueDialogTitle.value = parentId ? '新增子级字典值' : '新增字典值';
  isDictValueEdit.value = false;
  currentDictCode.value = dictCode;
  currentDictStructType.value = dictStructType;
  currentDictValueId.value = undefined;
  currentParentId.value = parentId;
  dictValueDialogVisible.value = true;

  // 重置表单
  dictValueFormApi.resetForm();
  const defaultValues: any = {
    dictCode,
    sort: 0,
  };

  // 如果有父ID，设置父级字典值
  if (parentId) {
    defaultValues.parentId = parentId;
  }

  dictValueFormApi.setValues(defaultValues);
}

// 编辑字典值
async function handleEditDictValue(
  dictValueId: number,
  dictCode?: string,
  dictStructType?: string,
) {
  try {
    dictValueDialogTitle.value = '编辑字典值';
    isDictValueEdit.value = true;
    currentDictValueId.value = dictValueId;

    // 如果传入了dictCode则保存，否则从详情中获取
    if (dictCode) {
      currentDictCode.value = dictCode;
    }

    // 设置字典数据结构
    if (dictStructType) {
      currentDictStructType.value = dictStructType;
    }

    // 获取详细信息
    const detail = await getDictValueDetailApi({ dictValueId });

    // 确保dictCode被正确设置
    if (!currentDictCode.value) {
      currentDictCode.value = detail.dictCode;
    }

    dictValueFormApi.setValues({
      ...detail,
      dictCode: detail.dictCode, // 确保dictCode字段被正确设置
    });
    dictValueDialogVisible.value = true;
  } catch (error) {
    // ElMessage.error('获取字典值详情失败');
    console.error('Get dict value detail error:', error);
  }
}

// 删除字典值
async function handleDeleteDictValue(dictValueId: number, dictLabel: string) {
  try {
    await ElMessageBox.confirm(
      `确定要删除字典值 "${dictLabel}" 吗？`,
      '确认删除',
      { type: 'warning' },
    );

    await deleteDictValueApi({ dictValueId });
    ElMessage.success('删除成功');

    // 刷新对应字典的字典值
    refreshDictValuesCache();
  } catch (error) {
    if (error !== 'cancel') {
      // ElMessage.error('删除失败');
      console.error('Delete dict value error:', error);
    }
  }
}

// 保存字典值
async function handleSaveDictValue() {
  try {
    // 进行表单验证
    const validationResult = await dictValueFormApi.validate();

    if (!validationResult.valid) {
      ElMessage.warning('请根据提示内容填写表单');
      return;
    }

    // 验证通过后获取表单值
    const values = await dictValueFormApi.getValues();

    // 确保dictCode字段存在
    if (!values.dictCode) {
      values.dictCode = currentDictCode.value;
    }

    if (isDictValueEdit.value && currentDictValueId.value) {
      const updateData: DictApi.UpdateDictValueRequest = {
        dictValueId: currentDictValueId.value,
        dictLabel: values.dictLabel,
        dictValue: values.dictValue,
        sort: values.sort,
        parentId: values.parentId,
      };
      await updateDictValueApi(updateData);
      ElMessage.success('更新成功');
    } else {
      const createData: DictApi.CreateDictValueRequest = {
        dictCode: values.dictCode || currentDictCode.value!,
        dictLabel: values.dictLabel,
        dictValue: values.dictValue,
        sort: values.sort,
        parentId: values.parentId,
      };
      await createDictValueApi(createData);
      ElMessage.success('创建成功');
    }

    dictValueDialogVisible.value = false;

    // 刷新对应字典的字典值缓存
    refreshDictValuesCache();
  } catch (error) {
    // ElMessage.error(isDictValueEdit.value ? '更新失败' : '创建失败');
    console.error('Save dict value error:', error);
    throw error;
  }
}

// 取消字典值操作
function handleCancelDictValue() {
  dictValueDialogVisible.value = false;
  dictValueFormApi.resetForm();
}

// 刷新字典值缓存
function refreshDictValuesCache() {
  // 清空缓存，让下次展开时重新加载
  dictValuesMap.value.clear();
  // 触发表格重新加载以刷新展开内容
  if (selectedTypeCode.value === null) {
    loadAllDictList();
  } else {
    loadDictList();
  }
}

// 初始化
onMounted(() => {
  loadDictTypeTree();
  // 默认显示所有字典数据
  selectedTypeCode.value = null;
  selectedTypeName.value = '';
  loadAllDictList();
});
</script>

<template>
  <Page>
    <ElRow :gutter="16">
      <!-- 左侧字典类型树 -->
      <ElCol :span="6">
        <ElCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span>字典类型</span>
              <ElButton
                type="primary"
                size="small"
                @click="handleAddType"
                v-access:code="'DICT_TYPE_ADD'"
              >
                新增
              </ElButton>
            </div>
          </template>

          <!-- 全部字典选项 -->
          <div
            class="dict-type-item"
            :class="{ active: selectedTypeCode === null }"
            @click="handleSelectAllDicts"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">全部字典</span>
            </div>
          </div>

          <ElTree
            :data="treeData"
            :loading="treeLoading"
            node-key="dictTypeId"
            :props="{ children: 'children', label: 'dictTypeName' }"
            @node-click="handleNodeClick"
          >
            <template #default="{ data }">
              <div class="flex flex-1 items-center justify-between pr-2">
                <span>{{ data.dictTypeName }}</span>
                <ElTag v-if="data.isSystem === '0'" type="warning">内置</ElTag>
                <div class="flex space-x-1">
                  <ElButton
                    type="primary"
                    link
                    size="small"
                    @click.stop="handleEditType(data)"
                    v-if="data.isSystem !== '0'"
                    v-access:code="'DICT_TYPE_EDIT'"
                  >
                    编辑
                  </ElButton>
                  <ElButton
                    type="danger"
                    link
                    size="small"
                    @click.stop="handleDeleteType(data)"
                    v-if="data.isSystem !== '0'"
                    v-access:code="'DICT_TYPE_DELETE'"
                  >
                    删除
                  </ElButton>
                </div>
              </div>
            </template>
          </ElTree>
        </ElCard>
      </ElCol>

      <!-- 右侧字典数据表格 -->
      <ElCol :span="18">
        <ElCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span>
                字典管理{{ selectedTypeName ? `- ${selectedTypeName}` : '' }}
              </span>
              <div class="space-x-2">
                <ElButton
                  type="primary"
                  size="small"
                  @click="handleAddDict"
                  v-access:code="'DICT_ADD'"
                >
                  新增字典
                </ElButton>
              </div>
            </div>
          </template>

          <!-- 字典数据表格 -->
          <Grid
            @checkbox-change="handleSelectionChange"
            @checkbox-all="handleSelectionChange"
          >
            <!-- 数据结构列插槽 -->
            <template #dictStructType="{ row }">
              {{ getStructTypeText(row.dictStructType) }}
            </template>

            <!-- 字典类型列插槽 -->
            <template #dictType="{ row }">
              {{ getDictTypeText(row.dictType) }}
            </template>

            <!-- 系统内置列插槽 -->
            <template #isSystem="{ row }">
              <ElTag :type="getIsSystemTagType(row.isSystem)">
                {{ getIsSystemText(row.isSystem) }}
              </ElTag>
            </template>
            <!-- 状态列插槽 -->
            <template #status="{ row }">
              <ElTag :type="getStatusTagType(row.dictStatus)">
                {{ getStatusText(row.dictStatus) }}
              </ElTag>
            </template>

            <!-- 创建时间列插槽 -->
            <template #createdTime="{ row }">
              <span>{{ formatDateTime(row.createdTime) }}</span>
            </template>

            <!-- 操作列插槽 -->
            <template #action="{ row }">
              <ElButton
                type="success"
                link
                size="small"
                @click="handleAddDictValue(row.dictCode, row.dictStructType)"
                v-if="row.isSystem !== '0'"
                v-access:code="'DICT_VALUE_ADD'"
              >
                新增字典值
              </ElButton>
              <ElButton
                type="primary"
                link
                size="small"
                @click="handleEditDict(row)"
                v-if="row.isSystem !== '0'"
                v-access:code="'DICT_EDIT'"
              >
                编辑
              </ElButton>
              <ElButton
                type="danger"
                link
                size="small"
                @click="handleDeleteDict(row.dictId, row.dictName)"
                v-if="row.isSystem !== '0'"
                v-access:code="'DICT_DELETE'"
              >
                删除
              </ElButton>
            </template>

            <!-- 展开内容插槽 -->
            <template #expand="{ row }">
              <div class="dict-values-container">
                <div class="dict-values-header">
                  <h4 class="text-foreground text-sm font-medium">
                    字典值{{ row.dictStructType === '1' ? '树' : '列表' }} -
                    {{ row.dictName }} ({{ row.dictCode }})
                  </h4>
                  <ElButton
                    type="primary"
                    size="small"
                    @click="
                      handleAddDictValue(row.dictCode, row.dictStructType)
                    "
                    v-if="row.isSystem !== '0'"
                    v-access:code="'DICT_VALUE_ADD'"
                  >
                    新增{{ row.dictStructType === '1' ? '根级' : '' }}字典值
                  </ElButton>
                </div>

                <div class="dict-values-content mt-3">
                  <div
                    v-if="dictValuesMap.get(row.dictId)?.length === 0"
                    class="py-4 text-center text-gray-500"
                  >
                    暂无字典值数据
                  </div>

                  <!-- 树形结构显示 -->
                  <div
                    v-else-if="row.dictStructType === '1'"
                    class="dict-values-tree"
                  >
                    <ElTree
                      :data="dictValuesMap.get(row.dictId)"
                      node-key="dictValueId"
                      :props="{ children: 'children', label: 'dictLabel' }"
                      :default-expand-all="false"
                      class="dict-tree"
                    >
                      <template #default="{ data }">
                        <div class="tree-node-content">
                          <span class="node-label">{{ data.dictLabel }}</span>
                          <span class="node-value">({{ data.dictValue }})</span>
                          <div class="node-actions">
                            <ElButton
                              type="success"
                              link
                              size="small"
                              @click="
                                handleAddDictValue(
                                  row.dictCode,
                                  row.dictStructType,
                                  data.dictValueId,
                                )
                              "
                              v-if="row.isSystem !== '0'"
                              v-access:code="'DICT_VALUE_ADD'"
                            >
                              新增子级
                            </ElButton>
                            <ElButton
                              type="primary"
                              link
                              size="small"
                              @click="
                                handleEditDictValue(
                                  data.dictValueId,
                                  row.dictCode,
                                  row.dictStructType,
                                )
                              "
                              v-if="row.isSystem !== '0'"
                              v-access:code="'DICT_VALUE_EDIT'"
                            >
                              编辑
                            </ElButton>
                            <ElButton
                              type="danger"
                              link
                              size="small"
                              @click="
                                handleDeleteDictValue(
                                  data.dictValueId,
                                  data.dictLabel,
                                )
                              "
                              v-if="row.isSystem !== '0'"
                              v-access:code="'DICT_VALUE_DELETE'"
                            >
                              删除
                            </ElButton>
                          </div>
                        </div>
                      </template>
                    </ElTree>
                  </div>

                  <!-- 列表结构显示 -->
                  <div v-else class="dict-values-table">
                    <table class="w-full text-sm">
                      <thead>
                        <tr class="border-b border-gray-200 bg-gray-50">
                          <th class="px-4 py-2 text-left">序号</th>
                          <th class="px-4 py-2 text-left">字典标签</th>
                          <th class="px-4 py-2 text-left">字典值</th>
                          <th class="px-4 py-2 text-left">排序</th>
                          <th class="px-4 py-2 text-left">创建时间</th>
                          <th class="px-4 py-2 text-left">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(dictValue, index) in dictValuesMap.get(
                            row.dictId,
                          )"
                          :key="dictValue.dictValueId"
                          class="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td class="px-4 py-2">{{ index + 1 }}</td>
                          <td class="px-4 py-2">{{ dictValue.dictLabel }}</td>
                          <td class="px-4 py-2">{{ dictValue.dictValue }}</td>
                          <td class="px-4 py-2">{{ dictValue.sort }}</td>
                          <td class="px-4 py-2">
                            {{ formatDateTime(dictValue.createdTime) }}
                          </td>
                          <td class="px-4 py-2">
                            <ElButton
                              type="primary"
                              link
                              size="small"
                              @click="
                                handleEditDictValue(
                                  dictValue.dictValueId,
                                  row.dictCode,
                                  row.dictStructType,
                                )
                              "
                            >
                              编辑
                            </ElButton>
                            <ElButton
                              type="danger"
                              link
                              size="small"
                              @click="
                                handleDeleteDictValue(
                                  dictValue.dictValueId,
                                  dictValue.dictLabel,
                                )
                              "
                            >
                              删除
                            </ElButton>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
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

    <!-- 新增/编辑字典类型对话框 -->
    <ElDialog
      v-model="typeDialogVisible"
      :title="typeDialogTitle"
      width="500px"
      :close-on-click-modal="false"
    >
      <DictTypeForm :disabled="{ code: isTypeEdit }" />

      <template #footer>
        <ElButton @click="handleCancelType">取消</ElButton>
        <ElButton type="primary" @click="handleSaveType">确定</ElButton>
      </template>
    </ElDialog>

    <!-- 新增/编辑字典数据对话框 -->
    <ElDialog
      v-model="dictDialogVisible"
      :title="dictDialogTitle"
      width="500px"
      :close-on-click-modal="false"
    >
      <DictInfoForm :disabled="{ dictCode: isDictEdit }" />

      <template #footer>
        <ElButton @click="handleCancelDict">取消</ElButton>
        <ElButton type="primary" @click="handleSaveDict">确定</ElButton>
      </template>
    </ElDialog>

    <!-- 新增/编辑字典值对话框 -->
    <ElDialog
      v-model="dictValueDialogVisible"
      :title="dictValueDialogTitle"
      width="500px"
      :close-on-click-modal="false"
    >
      <DictValueForm />

      <template #footer>
        <ElButton @click="handleCancelDictValue">取消</ElButton>
        <ElButton type="primary" @click="handleSaveDictValue">确定</ElButton>
      </template>
    </ElDialog>
  </Page>
</template>

<style scoped>
.dict-type-item {
  padding: 12px;
  margin-bottom: 8px;
  color: hsl(var(--card-foreground));
  cursor: pointer;
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 6px;
  transition: all 0.2s;
}

.dict-type-item:hover {
  background-color: hsl(var(--accent-hover));
  border-color: hsl(var(--border));
}

.dict-type-item:hover:not(.active) {
  box-shadow: 0 2px 4px hsl(var(--foreground) / 5%);
  transform: translateY(-1px);
}

.dict-type-item.active {
  color: hsl(var(--primary-text));
  background-color: hsl(var(--primary-background-lightest));
  border-color: hsl(var(--primary-border));
  box-shadow: 0 0 0 1px hsl(var(--primary) / 10%);
}

/* 字典值展开内容样式 */
.dict-values-container {
  padding: 16px;
  margin: 8px 16px;
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 6px;
}

.dict-values-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid hsl(var(--border));
}

.dict-values-table table {
  border-collapse: collapse;
}

.dict-values-table th {
  font-weight: 500;
  color: hsl(var(--muted-foreground));
  background-color: hsl(var(--muted));
}

.dict-values-table td,
.dict-values-table th {
  border: 1px solid hsl(var(--border));
}

.dict-values-table tbody tr:hover {
  background-color: hsl(var(--accent));
}

/* 字典值树形结构样式 */
.dict-values-tree {
  padding: 8px;
  background-color: hsl(var(--muted));
  border-radius: 4px;
}

.dict-tree .el-tree-node__content {
  height: auto;
  padding: 8px 0;
}

.tree-node-content {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.node-label {
  font-weight: 500;
  color: hsl(var(--foreground));
}

.node-value {
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
}

.node-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.tree-node-content:hover .node-actions {
  opacity: 1;
}
</style>
