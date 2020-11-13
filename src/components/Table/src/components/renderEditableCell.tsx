import { defineComponent, PropType, ref, unref, nextTick } from 'vue';
import { injectTable } from '../hooks/useProvinceTable';
import ClickOutSide from '/@/components/ClickOutSide/index.vue';

import { RenderEditableCellParams } from '../types/table';
import { ComponentType } from '../types/componentType';

import { componentMap } from '../componentMap';
import '../style/editable-cell.less';
import { isString, isBoolean } from '/@/utils/is';
import { FormOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons-vue';

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
  },
  emits: ['submit', 'cancel'],
  setup(props, { attrs, emit }) {
    const table = injectTable();
    const elRef = ref<any>(null);

    const isEditRef = ref(false);
    const currentValueRef = ref<string | boolean>(props.value);

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
      emit('cancel');
    }

    function handleSubmit() {
      const { dataKey, dataIndex } = props;
      if (!dataKey || !dataIndex) {
        return;
      }
      isEditRef.value = false;

      const { getDataSource } = table;
      const dataSource = getDataSource();
      const target = dataSource.find((item) => item.key === dataKey);
      if (target) {
        target[dataIndex] = unref(currentValueRef);
        emit('submit', { dataKey, dataIndex, value: unref(currentValueRef) });
      }
    }

    function onClickOutside() {
      const { component } = props;

      if (component && component.includes('Input')) {
        handleCancel();
      }
    }
    return () => {
      const { value, component, componentProps = {} } = props;

      const Comp = componentMap.get(component!) as any;
      // const propsData: any = {};
      return (
        <div class={prefixCls}>
          {unref(isEditRef) && (
            <ClickOutSide onClickOutside={onClickOutside}>
              {() => (
                <div class={`${prefixCls}__wrapper`}>
                  <Comp
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
                  <div class={`${prefixCls}__action`}>
                    <CheckOutlined class={[`${prefixCls}__icon`, 'mx-2']} onClick={handleSubmit} />
                    <CloseOutlined class={[`${prefixCls}__icon `]} onClick={handleCancel} />
                  </div>
                </div>
              )}
            </ClickOutSide>
          )}

          {!unref(isEditRef) && (
            <div class={`${prefixCls}__normal`} onClick={handleEdit}>
              {value}
              <FormOutlined class={`${prefixCls}__normal-icon`} />
            </div>
          )}
        </div>
      );
    };
  },
});

export function renderEditableCell({
  dataIndex,
  component,
  componentOn = {},
  componentProps = {},
}: RenderEditableCellParams) {
  return ({ text, record }: { text: string; record: any }) => {
    return (
      <EditableCell
        {...componentOn}
        {...componentProps}
        value={text}
        dataKey={record.key}
        dataIndex={dataIndex}
        component={component}
      />
    );
  };
}
