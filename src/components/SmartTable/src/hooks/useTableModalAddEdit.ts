import type { ComputedRef, Ref, Slots } from 'vue';
import type { SmartAddEditModalCallbackData, SmartTableProps } from '@/components/SmartTable';
import type { FormProps } from '@/components/Form';
import type { ModalProps } from '@/components/Modal';

import { computed, nextTick, ref, Slot, unref } from 'vue';
import { useI18n } from '@/hooks/web/useI18n';
import { message } from 'ant-design-vue';
import { error } from '@/utils/log';

interface TableAction {
  getCheckboxRecords: (isFull: boolean) => Array<any>;
  openAddEditModal: <T = any>(props?: boolean, data?: T, openOnSet?: boolean) => void;
  query: (parameter?) => Promise<void>;
}

const SizeMap: { [index: string]: 'default' | 'small' | 'large' } = {
  midum: 'default',
  small: 'small',
  mini: 'small',
  tiny: 'small',
};

export const useTableModalAddEditConfig = (
  emit: Function,
  tableProps: ComputedRef<SmartTableProps>,
  slots: Slots,
  { getCheckboxRecords, openAddEditModal, query }: TableAction,
) => {
  const { t } = useI18n();
  const isAddRef = ref(true);

  /**
   * 是否有添加修改弹窗
   */
  const getHasAddEdit = computed<boolean>(() => {
    return unref(tableProps).addEditConfig !== undefined;
  });

  /**
   * 添加修改弹窗props
   */
  const getAddEditFormProps = computed<FormProps>(() => {
    const { size, addEditConfig } = unref(tableProps);
    const formConfig = addEditConfig?.formConfig;
    if (!formConfig) {
      return {};
    }
    const props: FormProps = {
      ...getDefaultFormConfig(),
      ...formConfig,
    };
    if (size) {
      props.size = formConfig.size || SizeMap[size];
    }
    return props;
  });

  function replaceFormSlotKey(key: string) {
    if (!key) return '';
    return key?.replace?.(/addEditForm-/, '') ?? '';
  }
  /**
   * 添加修改表单form插槽
   */
  const getAddEditFormSlots: ComputedRef<Slots> = computed(() => {
    // 获取form插槽
    const formSlots: { [name: string]: Slot | undefined } = {};
    Object.keys(slots)
      .map((item) => (item.startsWith('addEditForm-') ? item : null))
      .filter((item) => !!item)
      .forEach((item) => {
        const formKey = replaceFormSlotKey(item as string);
        formSlots[formKey] = slots[item as string];
      });
    // 获取column插槽
    const columnSlots: { [name: string]: Slot | undefined } = {};
    const schemas = unref(tableProps).addEditConfig?.formConfig?.schemas || [];
    schemas
      .map((item: any) => item.slot)
      .filter((item) => !!item)
      .forEach((item) => {
        columnSlots[item as string] = slots[item as string];
      });
    const result = {
      ...formSlots,
      ...columnSlots,
    };
    if (
      Object.keys(formSlots).length + Object.keys(columnSlots).length >
      Object.keys(result).length
    ) {
      error('添加修改表单插槽命名重复');
    }
    return result;
  });

  /**
   * 添加修改弹窗props
   */
  const getAddEditModalProps = computed<Partial<ModalProps>>(() => {
    const { addEditConfig, proxyConfig } = unref(tableProps);
    if (!addEditConfig) {
      return {};
    }
    const { modalConfig, beforeSave, afterSave } = addEditConfig!;
    const saveFunction = proxyConfig?.ajax?.save;
    return {
      ...getDefaultModalConfig(isAddRef, t),
      ...(modalConfig || {}),
      beforeSave,
      saveFunction,
      afterSave:
        afterSave ||
        (() => {
          query();
          return true;
        }),
    };
  });

  const showAddModal = (formData?: Recordable, selectData?: Recordable) => {
    if (!unref(getHasAddEdit)) {
      throw new Error('addEditConfig未定义');
    }
    isAddRef.value = true;
    nextTick(() => {
      emit('add-edit-modal-show', { isAdd: true });
    });
    openAddEditModal(true, getCallbackData(true, selectData, formData));
  };

  const editByRowModal = (row, formData?: Recordable) => {
    return doEdit(row, formData);
  };

  const editByCheckbox = () => {
    const selectRows = getCheckboxRecords(false);
    if (selectRows.length !== 1) {
      message.warn(t('common.notice.choseOne'));
      return false;
    }
    const editRow = selectRows[0];
    return doEdit(editRow);
  };

  const doEdit = async (row, formData?: Recordable) => {
    if (!unref(getHasAddEdit)) {
      throw new Error('addEditConfig未定义');
    }
    isAddRef.value = false;
    nextTick(() => {
      emit('add-edit-modal-show', { isAdd: false, row, formData });
    });
    if (unref(tableProps).addEditConfig?.openModalHandler) {
      unref(tableProps).addEditConfig?.openModalHandler?.(row, formData);
    } else {
      openAddEditModal(true, getCallbackData(false, row, formData));
    }
    return true;
  };

  const getCallbackData = (
    isAdd: boolean,
    selectData?: Recordable,
    formData?: Recordable,
  ): SmartAddEditModalCallbackData => {
    const getByIdFunction = unref(tableProps)?.proxyConfig?.ajax?.getById;
    if (!getByIdFunction) {
      throw new Error('proxyConfig.ajax.getById未设置');
    }
    return {
      getFunction: getByIdFunction,
      isAdd,
      selectData,
      formData,
      validateFunction: unref(tableProps)?.addEditConfig?.afterLoadData,
    };
  };

  return {
    showAddModal,
    editByCheckbox,
    getHasAddEdit,
    getAddEditFormProps,
    getAddEditModalProps,
    editByRowModal,
    getAddEditFormSlots,
  };
};

const getDefaultFormConfig = (): Partial<FormProps> => {
  return {
    showActionButtonGroup: false,
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 19,
    },
    baseColProps: {
      span: 24,
      xxl: 12,
    },
  };
};

const getDefaultModalConfig = (isAddRef: Ref<boolean>, t: Function): Partial<ModalProps> => {
  const title = unref(isAddRef) ? t('common.title.add') : t('common.title.edit');
  return {
    title,
  };
};
