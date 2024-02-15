import type { SmartTableProps } from '@/components/SmartTable';

import { defineComponent, ref } from 'vue';
import { Row, Col } from 'ant-design-vue';

import { propTypes } from '@/utils/propTypes';
import { useModal } from '@/components/Modal';

import SmartTableSelectModal from './SmartTableSelectModal';

import './SmartTableSelect.less';

export default defineComponent({
  name: 'SmartTableSelect',
  components: {
    Row,
    Col,
  },
  props: {
    // 是否支持多选
    multiple: propTypes.bool.def(true),
    value: propTypes.oneOfType([propTypes.string, propTypes.array]),
    // label字段
    labelField: propTypes.string.isRequired,
    // value字段
    valueField: propTypes.string.isRequired,
    tableProps: {
      type: Object as PropType<SmartTableProps>,
      required: true,
    },
    disabled: propTypes.bool.def(false),
    size: String as PropType<string>,
  },
  emits: ['update:value', 'change'],
  setup(props, { emit }) {
    const [registerModal, { openModal }] = useModal();
    const optionsRef = ref<Array<any>>([]);

    const handleOptionChange = (options) => {
      optionsRef.value = options;
    };
    const handleSelectData = (options: any[]) => {
      emit(
        'update:value',
        options.map((item) => item.value),
      );
      emit(
        'change',
        options.map((item) => item.value),
      );
    };
    const handleDeselect = (value) => {
      const data = (props.value as any[]).filter((item) => item !== value);
      emit('update:value', data);
      emit('change', data);
    };
    return {
      registerModal,
      openModal,
      handleSelectData,
      optionsRef,
      handleDeselect,
      handleOptionChange,
    };
  },
  render() {
    const {
      $attrs,
      multiple,
      tableProps,
      $slots,
      disabled,
      $t,
      openModal,
      registerModal,
      labelField,
      valueField,
      handleSelectData,
      optionsRef,
      value,
      handleDeselect,
      handleOptionChange,
      size,
    } = this;
    const modalSlots: any = {
      table: $slots.table,
    };
    return (
      <div class="smart-table-select">
        <Row type="flex" gutter={8}>
          <Col class="select">
            <a-select
              {...$attrs}
              size={size}
              disabled={disabled}
              style={{ width: '100%' }}
              options={optionsRef}
              open={false}
              value={value}
              onDeselect={handleDeselect}
              mode={multiple ? 'multiple' : 'combobox'}
            ></a-select>
          </Col>
          <Col class="button">
            <a-button
              disabled={disabled}
              size={size}
              type="primary"
              onClick={() => openModal(true, value || {})}
            >
              {$t('common.button.choose')}
            </a-button>
          </Col>
        </Row>
        <SmartTableSelectModal
          {...$attrs}
          onRegister={registerModal}
          labelField={labelField}
          onOptionChange={handleOptionChange}
          onSelectData={handleSelectData}
          valueField={valueField}
          // @ts-ignore
          selectValues={value}
          multiple={multiple}
          tableProps={tableProps}
        >
          {modalSlots}
        </SmartTableSelectModal>
      </div>
    );
  },
});
