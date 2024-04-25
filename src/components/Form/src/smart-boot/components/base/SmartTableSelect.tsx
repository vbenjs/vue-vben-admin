import type { SmartTableProps } from '@/components/SmartTable';

import { computed, defineComponent, ref, toRefs, unref } from 'vue';
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
    value: propTypes.oneOfType([propTypes.string, propTypes.array, propTypes.number]),
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
    const { value: valueRef, multiple: multipleRef } = toRefs(props);
    const [registerModal, { openModal }] = useModal();
    const optionsRef = ref<Array<any>>([]);

    const handleOptionChange = (options) => {
      optionsRef.value = options;
    };
    const handleSelectData = (options: any[]) => {
      handleEmit(options.map((item) => item.value));
    };
    const handleDeselect = (value) => {
      const data = (props.value as any[]).filter((item) => item !== value);
      handleEmit(data);
    };
    const handleEmit = (data: any[]) => {
      let value: any | undefined = undefined;
      if (data && data.length > 0) {
        value = data;
      }
      if (value && !props.multiple) {
        value = value[0];
      }
      emit('update:value', value);
      emit('change', value);
    };
    const computedSelectValue = computed(() => {
      const value = unref(valueRef);
      return value ? (unref(multipleRef) ? value : [value]) : value;
    });
    return {
      registerModal,
      openModal,
      handleSelectData,
      optionsRef,
      handleDeselect,
      handleOptionChange,
      computedSelectValue,
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
      computedSelectValue,
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
          selectValues={computedSelectValue}
          multiple={multiple}
          tableProps={tableProps}
        >
          {modalSlots}
        </SmartTableSelectModal>
      </div>
    );
  },
});
