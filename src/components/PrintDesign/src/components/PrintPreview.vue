<script lang="tsx">
  import { defineComponent, ref, watchEffect, computed, PropType } from 'vue';
  import { Card, InputNumber, Space, message } from 'ant-design-vue';
  import { Icon } from '../../../Icon';
  import { Button } from '../../../Button';
  import { scaleMin, scaleMax } from '../constant';

  const props = {
    show: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    width: {
      type: Number as PropType<number>,
      default: 210,
    },

    template: {
      type: Object as PropType<any>,
      required: true,
    },
    hiprintData: {
      type: Object as PropType<any>,
      default: () => ({}),
    },
    showPrintBtn: {
      type: Boolean,
      default: true,
    },
    showPdfBtn: {
      type: Boolean,
      default: true,
    },
  };

  const prefixCls = 'print-design-preview';
  export default defineComponent({
    name: 'PrintDesignPreview',
    props,
    setup(props, { expose }) {
      const wrapElRef = ref<HTMLDivElement | null>(null);
      const show = ref(false);
      const waitShowPrinter = ref(false);
      const scale = ref(1);

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

      const pageWidth = computed(() => {
        return props.width + 'mm';
      });

      const print = () => {
        waitShowPrinter.value = true;
        props.template.print(
          props.hiprintData,
          {},
          {
            callback: () => {
              console.log('callback');
              waitShowPrinter.value = false;
            },
          },
        );
      };
      const toPdf = () => {
        message.success('正在生成pdf,请稍候...');
        props.template.toPdf(props.hiprintData, '打印预览');
      };

      const changeScale = (big: boolean) => {
        console.log(big);
        if (big) {
          scale.value += 0.1;
          if (scale.value > scaleMax) scale.value = scaleMax;
        } else {
          scale.value -= 0.1;
          if (scale.value < scaleMin) scale.value = scaleMin;
        }
      };

      watchEffect(() => {
        if (props.show) {
          show.value = true;

          setTimeout(() => {
            // eslint-disable-next-line no-undef
            $('#preview_content').html(props.template.getHtml(props.hiprintData));
          }, 500);
        }
      });

      const handleMaskClick = (e: MouseEvent) => {
        if ((e?.target as HTMLDivElement).classList.contains(`${prefixCls}-content`)) {
          handleClose(e);
        }
      };

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
                  <Card
                    title="打印预览"
                    bodyStyle={{
                      width: scale.value <= 1 ? pageWidth.value : '800px',
                      height: scale.value <= 1 ? 'unset' : 'calc(100vh - 150px)',
                      minWidth: pageWidth.value,
                      overflow: 'auto',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      maxHeight: 'calc(100vh - 150px)',
                    }}
                    extra={
                      <Space>
                        <InputNumber
                          value={scale.value}
                          min={scaleMin}
                          max={scaleMax}
                          disabled
                          formatter={(value) => `${(Number(value) * 100).toFixed(0)}%`}
                          v-slots={{
                            addonBefore: () => (
                              <Icon
                                icon="ant-design:zoom-out-outlined"
                                onClick={() => changeScale(false)}
                                class="mx-[-11px] px-11px py-4px"
                              />
                            ),
                            addonAfter: () => (
                              <Icon
                                icon="ant-design:zoom-in-outlined"
                                class="mx-[-11px] px-11px py-4px"
                                onClick={() => changeScale(true)}
                              />
                            ),
                          }}
                        ></InputNumber>
                        {props.showPrintBtn && (
                          <Button
                            loading={waitShowPrinter.value}
                            type="primary"
                            preIcon="ant-design:printer-outlined"
                            onClick={print}
                          >
                            打印
                          </Button>
                        )}
                        {props.showPdfBtn && (
                          <Button
                            type="primary"
                            preIcon="ant-design:file-pdf-outlined"
                            onClick={toPdf}
                          >
                            pdf
                          </Button>
                        )}
                        <Icon
                          icon="ant-design:close-outlined"
                          size={20}
                          color="#333333"
                          onClick={handleClose}
                          class={'ml-2 cursor-pointer'}
                        />
                      </Space>
                    }
                  >
                    <div
                      id="preview_content"
                      style={{
                        scale: scale.value,
                        transform: `translate(${(scale.value - 1) * 50 + '%'},${
                          (scale.value - 1) * 50 + '%'
                        })`,
                      }}
                    ></div>
                  </Card>
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
  .print-design-preview {
    position: fixed;
    z-index: @preview-comp-z-index;
    inset: 0;
    background: rgb(0 0 0 / 50%);
    user-select: none;

    &-content {
      display: flex;
      justify-content: center;
      width: 100%;
      height: 100%;
      // overflow-y: auto;
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
        display: flex;
        justify-content: center;
        align-items: flex-start;
        z-index: @preview-comp-z-index;
        padding: 48px 16px;
        background-color: transparent;
      }

      .ant-card-body {
        padding: 0;
      }
      .ant-input-number-input-wrap {
        width: 60px;
      }
    }
  }
</style>
