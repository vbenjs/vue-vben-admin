<script lang="tsx">
  import { defineComponent, ref, watchEffect } from 'vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { Tabs } from 'ant-design-vue';
  import { DayPicker } from '@/components/DatePicker';
  import { getEquipmentAttributes } from '@/api/equipment';
  import { DefaultOptionType } from 'ant-design-vue/lib/select';
  import Chart from './Chart.vue';
  import { EquipmentAttributeResult } from '@/api/model/equipmentModel';
  import { useFormat } from '@/utils/format';
  import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';

  const props = {
    show: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    title: {
      type: String,
    },
    equipmentIds: {
      type: Array as PropType<number[]>,
      default: () => [],
    },
  };

  const attrOptions = ref<DefaultOptionType[]>([]);
  const attributes = ref<EquipmentAttributeResult[]>([]);

  const { formatAttribute } = useFormat();
  const groupAttrs: string[] = ['ELECTRIC', 'WORKING_HOURS'];
  const createAttrOptions = async (id: number) => {
    const attrs = await getEquipmentAttributes(id);
    attributes.value = attrs;
    attrOptions.value = attrs.map((item) => {
      return {
        label: formatAttribute(item.attributeType, item.sensor),
        value: item.id,
      };
    });
    if (attrs.findIndex((item) => item.attributeType === 'ELECTRIC') > -1) {
      attrOptions.value.splice(0, 0, {
        label: '总能耗',
        value: 'total',
      });
    }
  };

  const getAttributesType = (select?: number | 'total' | string) => {
    if (typeof select === 'number') return;
    if (select === 'total') return;
    return select;
  };

  const prefixCls = 'equipment-statistics';
  export default defineComponent({
    name: 'EquipmentStatistics',
    props,
    setup(props, { expose }) {
      const wrapElRef = ref<HTMLDivElement | null>(null);
      const show = ref(false);

      const date = ref();
      // 关闭
      function handleClose(e: MouseEvent) {
        e && e.stopPropagation();
        close();
      }

      function close() {
        show.value = false;
      }

      expose({
        close,
      });

      watchEffect(() => {
        if (props.show) {
          show.value = true;
          if (props.equipmentIds.length === 1) createAttrOptions(props.equipmentIds[0]);
          else {
            attrOptions.value = groupAttrs.map((key) => {
              return {
                label: formatAttribute(key),
                value: key,
              };
            });
          }
        }
      });

      const handleMaskClick = (e: MouseEvent) => {
        if ((e?.target as HTMLDivElement).classList.contains(`${prefixCls}-content`)) {
          handleClose(e);
        }
      };

      // tab点击事件
      const handleClick = () => {};

      return () => {
        return (
          show.value && (
            <div class={prefixCls} ref={wrapElRef} onClick={handleMaskClick}>
              <div class={`${prefixCls}-content`}>
                <div
                  class={`${prefixCls}-content-form`}
                  onContextmenu={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Tabs type="card" tabPosition="top" onChange={handleClick}>
                    {{
                      default: () => {
                        return attrOptions.value.map((item) => {
                          return (
                            <Tabs.TabPane tab={item.label} key={item.label + item.value}>
                              <Chart
                                attributes={attributes.value}
                                selectAttr={item.value as any}
                                date={date.value}
                                equipmentIds={props.equipmentIds}
                                attributeType={getAttributesType(item.value as any)}
                              />
                            </Tabs.TabPane>
                          );
                        });
                      },
                      rightExtra: () => (
                        <div class="flex justify-center items-center">
                          <DayPicker v-model:modelValue={date.value} locale={locale} />
                          <Icon
                            icon="ant-design:close-outlined"
                            size={20}
                            color="#333333"
                            onClick={() => close()}
                            class={'ml-2 cursor-pointer'}
                          />
                        </div>
                      ),
                      leftExtra: () => <div class="px-4">{props.title}</div>,
                    }}
                  </Tabs>
                </div>
              </div>
            </div>
          )
        );
      };
    },
  });
</script>
<style lang="less">
  [data-theme='dark'] .equipment-statistics {
    &-content-form {
      background-color: #1f1f1f;
    }
  }

  .equipment-statistics {
    position: fixed;
    z-index: @preview-comp-z-index;
    inset: 0;
    background: rgb(0 0 0 / 50%);
    user-select: none;

    &-content {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: @white;

      .form-close-btn {
        position: absolute;
        z-index: @preview-comp-z-index + 1;
        top: 20px;
        right: 10px;
        cursor: pointer;
      }

      &-form {
        position: relative;
        z-index: @preview-comp-z-index;
        width: 1000px;
        height: 650px;
        padding: 16px;
        background-color: white;
      }
    }

    .ant-card-bordered {
      border: 0;
    }
  }
</style>
