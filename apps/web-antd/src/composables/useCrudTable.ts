import type { Ref } from 'vue';

/**
 * useCrudTable - 通用 CRUD 表格组合式函数
 *
 * 抽象各管理页面中重复的：
 * - loading / dataSource / pagination / formState / isModalVisible 状态
 * - fetchList / openModal / handleSubmit / handleDelete 操作
 * - 批量选择、搜索重置等辅助逻辑
 *
 * 用法:
 * const { loading, dataSource, pagination, openModal, ... } = useCrudTable({
 *   api: sysPostApi,
 *   rowKey: 'postId',
 *   defaultFormState: { postName: '', status: '0' },
 * });
 */
import { ref } from 'vue';

import { message } from 'ant-design-vue';

/** API 适配器接口 - 各 API 模块需实现的最小方法集 */
export interface CrudApi<T = any> {
  getList: (params?: any) => Promise<any>;
  create: (data: T) => Promise<any>;
  update: (id: number | string, data: T) => Promise<any>;
  remove: (id: number | string) => Promise<any>;
}

export interface UseCrudTableOptions<T = any> {
  /** API 适配器 */
  api: CrudApi<T>;
  /** 行主键字段名 */
  rowKey: string;
  /** 表单默认状态 (用于新增时重置) */
  defaultFormState: T;
  /** 数据获取后的回调 (可用于转换数据) */
  afterFetch?: (data: any[]) => any[];
  /** 成功提示文案 */
  messages?: {
    createSuccess?: string;
    deleteSuccess?: string;
    updateSuccess?: string;
  };
}

export function useCrudTable<T extends Record<string, any>>(
  options: UseCrudTableOptions<T>,
) {
  const {
    api,
    rowKey,
    defaultFormState,
    afterFetch,
    messages: msgs = {},
  } = options;

  // 表格状态
  const loading = ref(false);
  const dataSource = ref<any[]>([]) as Ref<any[]>;
  const pagination = ref({ current: 1, pageSize: 10, total: 0 });
  const lastQueryParams = ref<Record<string, any>>({});

  // 弹窗 & 表单状态
  const isModalVisible = ref(false);
  const submitting = ref(false);
  const formRef = ref();
  const formState = ref<any>({ ...defaultFormState }) as Ref<any>;
  const isEditing = ref(false);

  /**
   * 获取列表数据
   * @param page 页码 (默认当前页)
   * @param extraParams 额外查询参数 (搜索条件)
   */
  async function fetchList(
    page = pagination.value.current,
    extraParams: Record<string, any> = {},
  ) {
    try {
      loading.value = true;
      lastQueryParams.value = { ...extraParams };
      const response = await api.getList({
        page,
        pageSize: pagination.value.pageSize,
        ...extraParams,
      });

      // 兼容分页和非分页两种 API 返回格式
      if (Array.isArray(response)) {
        dataSource.value = afterFetch ? afterFetch(response) : response;
        pagination.value.total = response.length;
      } else {
        const items = response?.items || response?.rows || response || [];
        dataSource.value = afterFetch ? afterFetch(items) : items;
        pagination.value.total = response?.total ?? items.length;
      }
      pagination.value.current = page;
    } finally {
      loading.value = false;
    }
  }

  /**
   * 打开新增/编辑弹窗
   * @param record 编辑时传入已有记录，新增时不传
   */
  function openModal(record?: any) {
    if (record) {
      formState.value = { ...record };
      isEditing.value = true;
    } else {
      formState.value = { ...defaultFormState };
      isEditing.value = false;
    }
    isModalVisible.value = true;
  }

  /**
   * 提交表单 (新增 or 编辑)
   * @param extraParams 表单外的附加参数
   */
  async function handleSubmit(extraParams: Record<string, any> = {}) {
    try {
      await formRef.value?.validate();
      submitting.value = true;
      const payload = { ...formState.value, ...extraParams };
      const id = formState.value[rowKey];

      if (id) {
        await api.update(id, payload);
        message.success(msgs.updateSuccess || '修改成功');
      } else {
        await api.create(payload);
        message.success(msgs.createSuccess || '新增成功');
      }

      isModalVisible.value = false;
      await fetchList(pagination.value.current, lastQueryParams.value);
    } catch (error: any) {
      // 表单验证失败时不显示错误提示
      if (error?.errorFields) return;
      message.error(error?.message || '操作失败');
    } finally {
      submitting.value = false;
    }
  }

  /**
   * 删除记录
   */
  async function handleDelete(id: number | string) {
    try {
      await api.remove(id);
      message.success(msgs.deleteSuccess || '删除成功');
      await fetchList(pagination.value.current, lastQueryParams.value);
    } catch (error: any) {
      message.error(error?.message || '删除失败');
    }
  }

  /**
   * 表格分页变化处理
   */
  function onTableChange(pag: any, _filters?: any, _sorter?: any) {
    fetchList(pag.current || 1, lastQueryParams.value);
  }

  return {
    // 表格状态
    loading,
    dataSource,
    pagination,

    // 弹窗 & 表单状态
    isModalVisible,
    submitting,
    formRef,
    formState,
    isEditing,

    // 操作方法
    fetchList,
    openModal,
    handleSubmit,
    handleDelete,
    onTableChange,
  };
}
