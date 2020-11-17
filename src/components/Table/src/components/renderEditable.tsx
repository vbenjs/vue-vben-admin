import { defineComponent, PropType, ref, unref, nextTick, watchEffect } from 'vue';
import ClickOutSide from '/@/components/ClickOutSide/index.vue';

import { RenderEditableCellParams } from '../types/table';
import { ComponentType } from '../types/componentType';

import { componentMap } from '../componentMap';
import { isString, isBoolean } from '/@/utils/is';
import { FormOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons-vue';

import '../style/editable-cell.less';

const prefixCls = 'editable-cell';
const EditableCell = defineComponent({
  name: 'EditableCell',
  props: {
    value: {
      type: String as PropType<string>,
      default: '',
    },
    componentProps: {
      type: Object as PropType<any>,
      default: null,
    },

    dataKey: {
      type: String as PropType<string>,
      default: '',
    },

    dataIndex: {
      type: String as PropType<string>,
      default: '',
    },

    component: {
      type: String as PropType<ComponentType>,
      default: 'Input',
    },
    editable: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    editRow: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    record: {
      type: Object as PropType<EditRecordRow>,
    },
    placeholder: {
      type: String as PropType<string>,
    },
  },
  emits: ['submit', 'cancel'],
  setup(props, { attrs, emit }) {
    const elRef = ref<any>(null);

    const isEditRef = ref(false);
    const currentValueRef = ref<string | boolean>(props.value);
    const defaultValueRef = ref<string | boolean>(props.value);

    watchEffect(() => {
      defaultValueRef.value = props.value;
      if (isBoolean(props.editable)) {
        isEditRef.value = props.editable;
      }
    });

    function handleChange(e: any) {
      if (e && e.target && Reflect.has(e.target, 'value')) {
        currentValueRef.value = (e as ChangeEvent).target.value;
      }
      if (isString(e) || isBoolean(e)) {
        currentValueRef.value = e;
      }
    }

    function handleEdit() {
      isEditRef.value = true;
      nextTick(() => {
        const el = unref(elRef);
        el && el.focus();
      });
    }

    function handleCancel() {
      isEditRef.value = false;
      currentValueRef.value = defaultValueRef.value;
      emit('cancel');
    }

    if (props.record) {
      /* eslint-disable  */
      props.record.onCancel = handleCancel;
      /* eslint-disable */
      props.record.onSubmit = handleSubmit;
    }

    function handleSubmit() {
      const { dataKey, dataIndex } = props;
      if (!dataKey || !dataIndex) return;

      if (props.record) {
        /* eslint-disable */
        props.record[dataIndex] = unref(currentValueRef) as string;
      }
      isEditRef.value = false;
    }

    function onClickOutside() {
      if (props.editRow) return;
      const { component } = props;

      if (component && component.includes('Input')) {
        handleCancel();
      }
    }

    function renderValue() {
      const { value } = props;
      if (props.editRow) {
        return !unref(isEditRef) ? value : null;
      }
      return (
        !unref(isEditRef) && (
          <div class={`${prefixCls}__normal`} onClick={handleEdit}>
            {value}
            <FormOutlined class={`${prefixCls}__normal-icon`} />
          </div>
        )
      );
    }
    return () => {
      const { component, componentProps = {} } = props;

      const Comp = componentMap.get(component!) as any;
      return (
        <div class={prefixCls}>
          {unref(isEditRef) && (
            <ClickOutSide onClickOutside={onClickOutside}>
              {() => (
                <div class={`${prefixCls}__wrapper`}>
                  <Comp
                    placeholder={props.placeholder}
                    {...{
                      ...attrs,
                      ...componentProps,
                    }}
                    style={{ width: 'calc(100% - 48px)' }}
                    ref={elRef}
                    value={unref(currentValueRef)}
                    size="small"
                    onChange={handleChange}
                    onPressEnter={handleSubmit}
                  />
                  {!props.editRow && (
                    <div class={`${prefixCls}__action`}>
                      <CheckOutlined
                        class={[`${prefixCls}__icon`, 'mx-2']}
                        onClick={handleSubmit}
                      />
                      <CloseOutlined class={[`${prefixCls}__icon `]} onClick={handleCancel} />
                    </div>
                  )}
                </div>
              )}
            </ClickOutSide>
          )}
          {renderValue()}
        </div>
      );
    };
  },
});

export function renderEditableCell({
  dataIndex,
  component,
  componentProps = {},
  placeholder,
}: RenderEditableCellParams) {
  return ({ text, record }: { text: string; record: EditRecordRow }) => {
    return (
      <EditableCell
        {...componentProps}
        placeholder={placeholder}
        value={text}
        record={record}
        dataKey={record.key}
        dataIndex={dataIndex}
        component={component}
      />
    );
  };
}

export function renderEditableRow({
  dataIndex,
  component,
  componentProps = {},
  placeholder,
}: RenderEditableCellParams) {
  return ({ text, record }: { text: string; record: EditRecordRow }) => {
    return (
      <EditableCell
        {...componentProps}
        value={text}
        placeholder={placeholder}
        editRow={true}
        editable={record.editable}
        dataKey={record.key}
        record={record}
        dataIndex={dataIndex}
        component={component}
      />
    );
  };
}

export type EditRecordRow<T = { [key: string]: any }> = {
  editable: boolean;
  onCancel: Fn;
  onSubmit: Fn;
} & T;
