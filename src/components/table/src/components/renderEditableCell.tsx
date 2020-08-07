import { defineComponent, PropOptions, ref, unref, nextTick } from 'compatible-vue';
import { useDesign } from '@/hooks/core/useDesign';
import { injectTable } from '../hooks/useProvinceTable';
import { ClickOutSide } from '@/components/click-out-side/index';
import { Icon } from '@/components/icon/index';

import { RenderEditableCellParams } from '../types/table';
import { ComponentType } from '../types/componentType';

import { componentMap } from '../componentMap';
import '../style/renderEditableCell.less';
import { isString, isBoolean } from '@/utils/is';
const EditableCell = defineComponent({
  name: 'EditableCell',
  props: {
    value: {
      type: String,
      default: '',
    } as PropOptions<string>,
    componentProps: {
      type: Object,
      default: null,
    } as PropOptions<any>,

    dataKey: {
      type: String,
      default: '',
    } as PropOptions<string>,

    dataIndex: {
      type: String,
      default: '',
    } as PropOptions<string>,

    component: {
      type: String,
      default: 'Input',
    } as PropOptions<ComponentType>,
  },
  setup(props, { listeners, attrs }) {
    const { prefixCls } = useDesign('editable-cell');
    const table = injectTable();
    const elRef = ref<any>(null);

    const isEditRef = ref(false);
    const currentValueRef = ref<string | boolean>('');

    function handleChange(e: ChangeEvent | string | boolean) {
      if ((e as ChangeEvent).target && Reflect.has((e as ChangeEvent).target, 'value')) {
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
        el && el.focus && el.focus();
      });
    }

    function handleCancel() {
      isEditRef.value = false;
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
      }
    }

    function onClickOutside() {
      const { component } = props;

      if (component?.includes('Input')) {
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
              <div class={`${prefixCls}__wrapper`}>
                <Comp
                  {...{
                    props: {
                      ...attrs,
                      ...componentProps,
                    },
                  }}
                  on={listeners}
                  style={{ width: 'calc(100% - 48px)' }}
                  ref={elRef}
                  value={value}
                  size="small"
                  onChange={handleChange}
                  onPressEnter={handleSubmit}
                />
                <div class={`${prefixCls}__action`}>
                  <Icon
                    type="check"
                    class={[`${prefixCls}__icon`, 'mx-2']}
                    onClick={handleSubmit}
                  />
                  <Icon type="close" class={[`${prefixCls}__icon`]} onClick={handleCancel} />
                </div>
              </div>
            </ClickOutSide>
          )}

          {!unref(isEditRef) && (
            <div class={`${prefixCls}__normal`} onClick={handleEdit}>
              {value}
              <Icon type="form" class={`${prefixCls}__normal-icon`} />
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
  return (text: string, record: any) => {
    return (
      <EditableCell
        value={text}
        dataKey={record.key}
        dataIndex={dataIndex}
        component={component}
        on={componentOn}
        componentProps={componentProps}
      />
    );
  };
}
