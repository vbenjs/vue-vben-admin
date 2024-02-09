import { ref, reactive, computed, createVNode } from 'vue';
import type { Ref } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

type Params = { page?: number; limit?: number; sortName?: string; sortOrder?: string };

type Data = { total: number; rows: Array<any> } | Array<any>;

/**
 * 参数类型
 */
type Parameter = {
  defaultPageSize?: number;
  paging: boolean;
  defaultSorter?: { sortName: string; sortOrder: string };
  // 搜索参数
  defaultParameter?: { [index: string]: any };
};

/**
 * VXE TABLE加载数据hook
 * @param service 加载数据服务
 * @param parameter hook 参数
 */
export const useVxeTable = (
  service: (params: Params, searchParameter: any) => Promise<Data>,
  parameter: Parameter = { paging: true },
) => {
  // 数据加载状态
  const loading = ref(false);
  // 表格数据
  const data = ref<Array<any>>([]);
  // 分页数据
  const tablePage: any = parameter.paging
    ? reactive({
        total: 0,
        currentPage: 1,
        pageSize: parameter.defaultPageSize || 500,
      })
    : {};
  const searchModel = ref<any>(Object.assign({}, parameter.defaultParameter || {}));
  // 排序数据
  const sortData: any = reactive(parameter.defaultSorter || {});
  const sortConfig: any = {
    remote: true,
  };
  if (parameter.defaultSorter) {
    sortConfig.defaultSort = {
      field: parameter.defaultSorter.sortName,
      order: parameter.defaultSorter.sortOrder,
    };
  }

  /**
   * 加载数据函数
   */
  const loadData = async () => {
    const allParameter: any = {
      ...sortData,
    };
    if (parameter.paging) {
      // 添加分页数据
      Object.assign(allParameter, {
        limit: tablePage.pageSize,
        page: tablePage.currentPage,
      });
    }
    loading.value = true;
    try {
      const result = await service(allParameter, searchModel.value);
      if (parameter.paging) {
        const { total, rows } = result as any;
        tablePage.total = total;
        data.value = rows;
      } else {
        data.value = result as Array<any>;
      }
    } catch (e) {
      // do nothing
    } finally {
      loading.value = false;
    }
  };
  /**
   * 重置擦欧总
   */
  const handleReset = () => {
    searchModel.value = Object.assign({}, parameter.defaultParameter || {});
    loadData();
  };

  /**
   * 重置分页页数
   */
  const handleResetPage = () => {
    tablePage.currentPage = 1;
  };

  /**
   * 排序变化时触发
   * @param property
   * @param order
   */
  const sortChange = ({ property, order }: any) => {
    sortData.sortName = property;
    sortData.sortOrder = order;
    loadData();
  };
  /**
   * 分页改变时触发
   * @param currentPage 当前页面
   * @param pageSize 页面大小
   */
  const handlePageChange = ({ currentPage, pageSize }: any) => {
    if (parameter.paging) {
      tablePage.currentPage = currentPage;
      tablePage.pageSize = pageSize;
      loadData();
    }
  };

  return {
    tableProps: computed(() => {
      return {
        loading: loading.value,
        data: data.value,
        onSortChange: sortChange,
        sortConfig: reactive(sortConfig),
      };
    }),
    loadData,
    handleReset,
    handleResetPage,
    searchModel,
    pageProps: computed(() => {
      return {
        currentPage: tablePage.currentPage,
        pageSize: tablePage.pageSize,
        total: tablePage.total,
        onPageChange: handlePageChange,
      };
    }),
  };
};

type AddEditParameter = {
  idField?: string;
  defaultModel?: any;
};

/**
 * 添加编辑操作
 * @param gridRef grid 引用
 * @param loadHandler 加载数据函数
 * @param listHandler 查询数据函数
 * @param saveHandler 保存函数
 * @param i18nRender 国际化函数
 * @param parameter 参数
 */
export const useAddEdit = (
  gridRef: Ref,
  loadHandler: (id: any) => Promise<any>,
  listHandler: Function | null,
  saveHandler: (model: any) => Promise<void>,
  i18nRender: Function,
  parameter: AddEditParameter = {},
) => {
  const formRef = ref();
  // 是否是加载状态
  const isAdd = ref(false);
  // 保存加载状态
  const saveLoading = ref(false);
  // 加载状态
  const getLoading = ref(false);
  // modal显示状态
  const modalVisible = ref(false);
  const addEditModel = ref(Object.assign({}, parameter.defaultModel || {}));
  // modal标题计算属性
  const computedTitle = computed(() => {
    return isAdd.value ? i18nRender('common.button.add') : i18nRender('common.button.edit');
  });

  /**
   * 添加编辑操作
   * @param add 是否是添加操作
   * @param id ID
   */
  const handleAddEdit = async (add: boolean, id: any | null) => {
    isAdd.value = add;
    // 显示弹窗
    modalVisible.value = true;
    if (add) {
      addEditModel.value = Object.assign({}, parameter.defaultModel || {});
    } else {
      try {
        getLoading.value = true;
        addEditModel.value = (await loadHandler(id)) || {};
      } catch (e) {
        // doNotiong
      } finally {
        getLoading.value = false;
      }
    }
  };

  /**
   * 设置model函数
   * @param model model
   */
  const handleSetModel = (model: any) => {
    addEditModel.value = model;
  };

  /**
   * 通过checkbox 获取需要编辑的数据
   */
  const handleEditByCheckbox = () => {
    // 获取选中行
    const selectRows = gridRef.value.getCheckboxRecords();
    if (selectRows.length !== 1) {
      message.error(i18nRender('common.notice.choseOne'));
      return false;
    }
    handleAddEdit(false, selectRows[0][parameter.idField!]);
  };

  /**
   * 保存修改操作
   */
  const handleSaveUpdate = async () => {
    try {
      await formRef.value.validate();
    } catch (e) {
      return false;
    }
    saveLoading.value = true;
    try {
      await saveHandler(addEditModel.value);
    } catch (e) {
      // do noting
      return false;
    } finally {
      saveLoading.value = false;
    }
    // 关闭弹窗
    modalVisible.value = false;
    if (listHandler) {
      listHandler();
    }
  };

  const handleCancel = () => {
    modalVisible.value = false;
  };
  return {
    modalProps: computed(() => {
      return {
        title: computedTitle.value,
        visible: modalVisible.value,
        confirmLoading: saveLoading.value,
        onOk: handleSaveUpdate,
        onCancel: handleCancel,
      };
    }),
    formProps: computed(() => {
      return {
        model: addEditModel.value,
        ref: 'formRef',
      };
    }),
    spinning: getLoading,
    handleAddEdit,
    handleEditByCheckbox,
    formRef,
    handleSetModel,
    formModel: addEditModel,
  };
};

type DeleteParameter = {
  idField: string;
  listHandler?: Function;
  afterDelete?: Function;
};

/**
 * 删除操作
 */
export const useVxeDelete = (
  gridRef: Ref | null,
  i18nRender: Function,
  deleteHandler: (idList: Array<any>) => Promise<void>,
  parameter: DeleteParameter,
) => {
  const doDelete = (idList: Array<any>) => {
    Modal.confirm({
      title: i18nRender('common.button.confirm'),
      icon: createVNode(ExclamationCircleOutlined),
      content: i18nRender('common.notice.deleteConfirm'),
      onOk: async () => {
        await deleteHandler(idList);
        message.success(i18nRender('common.message.deleteSuccess'));
        if (parameter.afterDelete) {
          parameter.afterDelete();
        }
      },
    });
  };

  /**
   * 删除checkbox选中
   */
  const handleDeleteByCheckbox = () => {
    // 获取选中行
    const selectRows = gridRef?.value.getCheckboxRecords();
    if (selectRows.length === 0) {
      message.error(i18nRender('common.notice.deleteChoose'));
      return false;
    }
    doDelete(selectRows.map((item: any) => item[parameter.idField]));
  };

  /**
   * 通过ID删除
   * @param id
   */
  const handleDeleteById = (id: any) => {
    doDelete([id]);
  };

  /**
   * 通过行删除
   * @param row
   */
  const handleDeleteByRow = (row: any) => {
    doDelete([row[parameter.idField]]);
  };

  return {
    handleDeleteByCheckbox,
    handleDeleteById,
    handleDeleteByRow,
  };
};
