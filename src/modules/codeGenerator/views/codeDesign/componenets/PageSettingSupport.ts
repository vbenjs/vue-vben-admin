import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import { useModal } from '@/components/Modal';

/**
 * 空间列表
 */
export const controlList = [
  {
    key: 'INPUT',
    value: 'generator.views.code.title.controlList.input',
  },
  {
    key: 'TEXTAREA',
    value: 'generator.views.code.title.controlList.textarea',
  },
  {
    key: 'NUMBER',
    value: 'generator.views.code.title.controlList.number',
  },
  {
    key: 'PASSWORD',
    value: 'generator.views.code.title.controlList.password',
  },
  {
    key: 'SELECT',
    value: 'generator.views.code.title.controlList.select',
  },
  {
    key: 'TRANSFER',
    value: 'generator.views.code.title.controlList.transfer',
  },
  {
    key: 'SELECT_TABLE',
    value: 'generator.views.code.title.controlList.selectTable',
  },
  {
    key: 'RADIO',
    value: 'generator.views.code.title.controlList.radio',
  },
  {
    key: 'CHECKBOX',
    value: 'generator.views.code.title.controlList.checkbox',
  },
  {
    key: 'SWITCH_TYPE',
    value: 'generator.views.code.title.controlList.switch_type',
  },
  {
    key: 'DATE',
    value: 'generator.views.code.title.controlList.date',
  },
  {
    key: 'TIME',
    value: 'generator.views.code.title.controlList.time',
  },
  {
    key: 'DATETIME',
    value: 'generator.views.code.title.controlList.datetime',
  },
  {
    key: 'FILE',
    value: 'generator.views.code.title.controlList.file',
  },
  {
    key: 'DATA_DICT',
    value: 'generator.views.design.title.controlList.dataDict',
  },
  {
    key: 'CATEGORY_DICT',
    value: 'generator.views.design.title.controlList.categoryDict',
  },
];

/**
 * rule列表
 */
const ruleList = [
  {
    value: 'NOT_EMPTY',
    label: 'generator.views.code.title.ruleList.notEmpty',
  },
  {
    value: 'PHONE',
    label: 'generator.views.code.title.ruleList.PHONE',
  },
  {
    value: 'EMAIL',
    label: 'generator.views.code.title.ruleList.EMAIL',
  },
  {
    value: 'NUMBER',
    label: 'generator.views.code.title.ruleList.NUMBER',
  },
  {
    value: 'REGEXP',
    label: 'generator.views.code.title.ruleList.REGEXP',
  },
];

export const getRuleList = (t: Function): Recordable[] => {
  return ruleList.map((item) => {
    return {
      ...item,
      label: t(item.label),
    };
  });
};

/**
 * 查询标识列表
 */
export const searchSymbolList = [
  '=',
  'like',
  '>',
  '>=',
  '<',
  '<=',
  'in',
  'notIn',
  'notLike',
  'likeLeft',
  'likeRight',
];

/**
 * table header checkbox
 * @param tableData
 * @param field
 * @param defaultValue
 */
export const vueTableHeaderCheckboxSupport = (
  tableData: Ref,
  field: string,
  defaultValue = true,
) => {
  const checked = ref(defaultValue);
  watch(checked, () => {
    tableData.value.forEach((item: any) => {
      item[field] = checked.value;
    });
  });
  return {
    checked,
  };
};

/**
 * 下拉表格支持
 */
export const vueChoseSelectTableSupport = (currentRow: Ref) => {
  const [registerSelectTableModal, { openModal: openSelectTableModal }] = useModal();
  /**
   * 显示列选择
   * @param row
   */
  const handleShowChoseSelectTable = (row: any) => {
    currentRow.value = row;
    openSelectTableModal(true, {});
  };
  /**
   * 选择表格后
   * @param tableList
   */
  const handleChoseTable = (tableList: Array<any>) => {
    currentRow.value.selectTableList = tableList;
  };
  return {
    registerSelectTableModal,
    handleShowChoseSelectTable,
    handleChoseTable,
  };
};
