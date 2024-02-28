import { defineComponent, ref, watch } from 'vue';
import { Icon } from '@/components/Icon';
import { Col, Form, InputNumber, Row, Space } from 'ant-design-vue';
import { Description } from '@/components/Description';
import { ApiSelect } from '@/components/Form';
import './form.less';
import { getCustomerProduct } from '@/api/configuration/customer';
import { HxBaseProduct } from '@/ApiModel/configuration/product';
import { productInfoSchema } from '../../DescriptionSchema';

const prefixCls = 'box-code-from-product';
export default defineComponent({
  name: 'BoxCodeFromProduct',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    field: {
      type: String,
      required: true,
    },
    model: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const wrapElRef = ref<HTMLDivElement | null>(null);

    const mockData = ref<HxBaseProduct>();

    // let options: any[] = [];
    const options = ref<any[]>([]);

    watch(
      () => [props.model[props.field], options.value],
      ([value, options]) => {
        const target = options.find((item) => item.value == value);
        mockData.value = target;
      },
      { immediate: true },
    );

    const custom_typeKey2typeValueRules = () => {
      return [
        {
          required: true,
          validator: async (a, b) => {
            if (!a) return Promise.reject('请选择类型');
            if (!b) return Promise.reject('请选择产品');
            Promise.resolve();
          },
        },
      ];
    };

    return () => {
      return (
        <div class={prefixCls} ref={wrapElRef}>
          <div class="mb-2">
            <Icon icon="tag|svg" size="18" class="mr-1" />
            <span>产品信息</span>
          </div>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name={props.field}
                label="产品编码"
                rules={custom_typeKey2typeValueRules()}
                validateTrigger={['blur']}
              >
                <Space.Compact class="w-full">
                  <ApiSelect
                    api={getCustomerProduct}
                    params={{ id: props.model.customerId }}
                    showSearch={true}
                    labelField={'code'}
                    valueField={'id'}
                    placeholder={'请选择产品'}
                    v-model:value={props.model[props.field]}
                    onSelect={(_, option: HxBaseProduct) => {
                      mockData.value = option;
                    }}
                    onOptions-change={(value) => {
                      options.value = value || [];
                      const needClean =
                        options.value.findIndex(
                          (item) => item.value == props.model[props.field],
                        ) === -1;
                      if (needClean) {
                        const model = props.model;
                        mockData.value = undefined;
                        model[props.field] = undefined;
                      }
                    }}
                  />
                  {/* <a-button class="ml-2 px-2.5">
                    <Icon icon="ant-design:plus-outlined" />
                  </a-button> */}
                </Space.Compact>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'pieceCount'}
                label="单包片数"
                rules={[{ required: true, message: '请输入单包片数' }]}
                validateTrigger={'blur'}
                // rules={custom_typeKey2typeValueRules(model)}
              >
                <InputNumber
                  v-model:value={props.model['pieceCount']}
                  min={1}
                  precision={0}
                  controls={false}
                  readonly={props.model.pieceModify === 'N'}
                />
              </Form.Item>
            </Col>
          </Row>

          <Description
            column={4}
            bordered={false}
            data={mockData.value}
            schema={productInfoSchema}
            class="bg-[#f6f6f6] px-5 pt-3 pb-1 mb-4 mt-[-10px]"
          />
        </div>
      );
    };
  },
});
