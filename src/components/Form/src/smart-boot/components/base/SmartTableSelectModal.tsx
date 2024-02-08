import type { SmartTableProps } from '@/components/SmartTable';

import { computed, defineComponent, toRefs, unref, watch } from 'vue';
import { propTypes } from '@/utils/propTypes';
import { Col, Row } from 'ant-design-vue';

import { BasicModal, useModalInner } from '@/components/Modal';
import { SmartTable } from '@/components/SmartTable';

import { useSmartTableSelect } from '../../hooks/useSmartTableSelect';

export default defineComponent({
  name: 'SmartTableSelectModal',
  components: {
    BasicModal,
  },
  props: {
    tableProps: {
      type: Object as PropType<SmartTableProps>,
      required: true,
    },
    selectTableProps: {
      type: Object as PropType<Partial<SmartTableProps>>,
    },
    // 是否多选
    multiple: propTypes.bool.def(true),
    // 是否显示选中
    showSelect: propTypes.bool.def(false),
    // label字段
    labelField: propTypes.string.isRequired,
    // value字段
    valueField: propTypes.string.isRequired,
    selectValues: propTypes.array.def([]),
    listApi: {
      type: Function as PropType<(data: any) => Promise<any>>,
      required: true,
    },
    // 是否每次弹窗都加载数据
    alwaysLoad: propTypes.bool.def(false),
  },
  emits: ['register', 'select-data', 'option-change'],
  setup(props, { emit, slots }) {
    const { tableProps, selectTableProps, valueField, selectValues, alwaysLoad, multiple } =
      toRefs(props);

    const hasTableSlot = computed<boolean>(() => {
      return slots.table !== undefined;
    });

    const emitSelectData = () => {
      const selectOptions = getSelectOptions();
      closeModal();
      emit('option-change', selectOptions);
      emit('select-data', selectOptions, unref(selectRowsRef));
    };

    const getSelectOptions = (): LabelValueOptions => {
      return unref(selectRowsRef).map((item) => {
        return {
          label: item[props.labelField],
          value: item[props.valueField],
        };
      });
    };

    const {
      registerTable,
      handleCheckboxChange,
      registerSelectTable,
      selectRowsRef,
      setSelectData,
      addSelectData,
      removeSelectData,
      getSelectData,
      getTableCheckboxConfig,
      handleCheckboxAll,
      getHasSearchForm,
      query,
      getTableRadioConfig,
      handleRadioChange,
      handleSetSelect,
    } = useSmartTableSelect(
      tableProps,
      selectTableProps,
      props.showSelect,
      valueField,
      selectValues,
      hasTableSlot,
      props.listApi,
      alwaysLoad,
      multiple,
    );
    const [registerModal, { closeModal }] = useModalInner(async (_) => {
      if (unref(alwaysLoad)) {
        await query();
        await handleSetSelect();
      }
    });

    watch(selectRowsRef, () => {
      const selectOptions = getSelectOptions();
      emit('option-change', selectOptions);
    });

    const handleOk = () => {
      emitSelectData();
    };

    return {
      registerModal,
      registerTable,
      setSelectData,
      addSelectData,
      removeSelectData,
      getSelectData,
      handleCheckboxChange,
      registerSelectTable,
      selectRowsRef,
      handleOk,
      getTableCheckboxConfig,
      handleCheckboxAll,
      getHasSearchForm,
      getTableRadioConfig,
      handleRadioChange,
    };
  },
  render() {
    const {
      $attrs,
      registerModal,
      $slots,
      setSelectData,
      handleOk,
      addSelectData,
      removeSelectData,
      selectRowsRef,
    } = this;
    return (
      <BasicModal {...$attrs} onRegister={registerModal} onOk={handleOk}>
        {$slots.table
          ? $slots.table({
              setSelectData,
              addSelectData,
              removeSelectData,
              selectData: selectRowsRef,
            })
          : renderTable(this)}
      </BasicModal>
    );
  },
});

const renderTable = (instance) => {
  const {
    $attrs,
    showSelect,
    multiple,
    registerTable,
    handleCheckboxChange,
    registerSelectTable,
    selectRowsRef,
    getTableCheckboxConfig,
    handleCheckboxAll,
    getHasSearchForm,
    getTableRadioConfig,
    handleRadioChange,
  } = instance;
  let tableAttrs = {
    ...$attrs,
  };
  if (multiple) {
    tableAttrs = {
      ...tableAttrs,
      checkboxConfig: unref(getTableCheckboxConfig),
      onCheckboxChange: handleCheckboxChange,
      onCheckboxAll: handleCheckboxAll,
    };
  } else {
    tableAttrs = {
      ...tableAttrs,
      radioConfig: unref(getTableRadioConfig),
      onRadioChange: handleRadioChange,
    };
  }
  return (
    <Row>
      <Col span={showSelect ? 12 : 24}>
        <SmartTable
          onRegister={registerTable}
          checkboxConfig={getTableCheckboxConfig}
          onCheckboxChange={handleCheckboxChange}
          onCheckboxAll={handleCheckboxAll}
          {...tableAttrs}
        />
      </Col>
      {showSelect ? (
        <Col style={getHasSearchForm ? { marginTop: '58px' } : ''} span={12}>
          <SmartTable data={selectRowsRef} onRegister={registerSelectTable} />
        </Col>
      ) : (
        ''
      )}
    </Row>
  );
};
