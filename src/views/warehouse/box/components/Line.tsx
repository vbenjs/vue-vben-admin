import { defineComponent, ref, watch } from 'vue';
import { Form, Space } from 'ant-design-vue';
import { DescItem, Description } from '@/components/Description';
import { ApiSelect } from '@/components/Form';
import './form.less';
import { getCustomerBase } from '@/api/configuration/customer';
import { OtherDataType } from '@/enums/baseDataType';
import { HxBaseData } from '@/ApiModel/configuration/base';
import { isArray } from 'xe-utils';

const prefixCls = 'box-code-form-line';
export default defineComponent({
  name: 'BoxCodeFormLine',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
    field: {
      type: String,
      required: true,
    },
    model: {
      type: Object,
      required: true,
    },
    showDesc: {
      type: Boolean,
      default: true,
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
    dataType: {
      type: String as PropType<OtherDataType>,
      required: true,
    },
    selectOptions: {
      type: Object as PropType<Recordable>,
      default: () => [],
    },
  },
  emits: ['update:model'],
  setup(props) {
    const wrapElRef = ref<HTMLDivElement | null>(null);

    const mockData = ref<HxBaseData>();
    const schema: DescItem[] = [{ field: 'code', label: '编码' }];

    const options = ref<any[]>([]);

    const modelValue = ref<(string | number)[]>([]);

    watch(
      () => props.model[props.field],
      (value) => {
        if (!value) modelValue.value = [];
        else modelValue.value = isArray(value) ? value : [value];
      },
      { immediate: true },
    );

    watch(
      () => [modelValue.value, options.value],
      ([values, options]) => {
        if (!values?.length) {
          mockData.value = undefined;
          props.model.lineId = undefined;
        } else {
          const target = options.find((item) => values.includes(item.value));
          mockData.value = target;
        }
      },
      { immediate: true },
    );

    return () => {
      return (
        <div class={prefixCls} ref={wrapElRef}>
          <Form.Item name={props.field} label={props.showLabel ? props.label : undefined}>
            <Space.Compact class="w-full">
              <ApiSelect
                api={(where) => getCustomerBase(where, props.dataType)}
                params={{ id: props.model.customerId }}
                showSearch={true}
                labelField={'name'}
                valueField={'id'}
                placeholder={props.label}
                v-model:value={props.model[props.field]}
                onSelect={(value, option: HxBaseData) => {
                  if (!mockData.value) {
                    mockData.value = option;
                    props.model.lineId = value;
                  }
                }}
                onOptions-change={(value) => {
                  options.value = value || [];
                }}
                {...props.selectOptions}
              />
            </Space.Compact>
          </Form.Item>

          {props.showDesc && (
            <Description
              column={1}
              bordered={false}
              data={mockData.value}
              schema={schema}
              class="bg-[#f6f6f6] px-5 pt-3 pb-1 mb-4 mt-[-10px]"
            />
          )}
        </div>
      );
    };
  },
});
