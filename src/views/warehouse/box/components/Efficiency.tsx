import { defineComponent, ref, watch } from 'vue';
import { Icon } from '@/components/Icon';
import { Col, Form, Input, Row, Space } from 'ant-design-vue';
import { Description } from '@/components/Description';
import { ApiSelect } from '@/components/Form';
import './form.less';
import { getCustomerEfficiency } from '@/api/configuration/customer';
import { HxBaseEfficiency } from '@/ApiModel/configuration/efficiency';
import { Button } from '@/components/Button';
import { efficiencySchema } from '../../DescriptionSchema';

const prefixCls = 'box-code-from-efficiency';
export default defineComponent({
  name: 'BoxCodeFromEfficiency',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    field: {
      type: String,
      required: true,
    },
    field2: {
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

    const mockData = ref<HxBaseEfficiency>();

    const buttonText = ref('自动');

    const handelAuto = (model: any) => {
      model.timeCodeAuto = !model.timeCodeAuto;
      buttonText.value = model.timeCodeAuto ? '手动' : '自动';
      model[props.field2] = undefined;
    };

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

    return () => {
      return (
        <div class={prefixCls} ref={wrapElRef}>
          <div class="mb-2">
            <Icon icon="efficiency|svg" size="18" class="mr-1" />
            <span>效率</span>
          </div>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name={props.field} label="效率">
                <Space.Compact class="w-full">
                  <ApiSelect
                    api={getCustomerEfficiency}
                    params={{ id: props.model.customerId }}
                    showSearch={true}
                    labelField={'name'}
                    valueField={'id'}
                    placeholder={'效率'}
                    v-model:value={props.model[props.field]}
                    onSelect={(_, option: HxBaseEfficiency) => {
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
                name={props.field2}
                label="出料时间"
                tooltip="点击自动将会自动生成,无须输入"
              >
                <Space.Compact class="w-full">
                  <Input
                    class="w-[98%]"
                    v-model:value={props.model[props.field2]}
                    disabled={props.model['timeCodeAuto']}
                  />
                  <Button type="primary" onClick={() => handelAuto(props.model)}>
                    {buttonText.value}
                  </Button>
                </Space.Compact>
              </Form.Item>
            </Col>
          </Row>

          <Description
            column={4}
            bordered={false}
            data={mockData.value}
            schema={efficiencySchema}
            class="bg-[#f6f6f6] px-5 pt-3 pb-1 mb-4 mt-[-10px]"
          />
        </div>
      );
    };
  },
});
