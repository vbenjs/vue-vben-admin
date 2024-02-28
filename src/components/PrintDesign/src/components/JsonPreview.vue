<script lang="tsx">
  import { PropType, defineComponent, ref, watchEffect } from 'vue';
  import { Icon } from '../../../Icon';
  import { CodeEditor } from '../../../CodeEditor';
  import { Button, Card, Space } from 'ant-design-vue';
  import { toRaw } from 'vue';
  import { useMessage } from '@/hooks/web/useMessage';

  const props = {
    show: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    template: {
      type: Object as PropType<any>,
      required: true,
    },
    showUpdate: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  };
  const { createMessage: msg } = useMessage();

  const prefixCls = 'print-design-json-preview';
  export default defineComponent({
    name: 'PrintDesignJsonPreview',
    props,
    setup(props, { expose }) {
      const wrapElRef = ref<HTMLDivElement | null>(null);
      const show = ref(false);
      const json = ref('');

      // 关闭
      function handleClose(e: MouseEvent) {
        e && e.stopPropagation();
        close();
      }

      function close() {
        show.value = false;
      }

      const onModeChange = () => {
        json.value = props.template.getJson();
      };

      expose({
        close,
      });

      watchEffect(() => {
        if (props.show) {
          show.value = true;

          onModeChange();
        }
      });

      const handleMaskClick = (e: MouseEvent) => {
        if ((e?.target as HTMLDivElement).classList.contains(`${prefixCls}-content`)) {
          handleClose(e);
        }
      };

      const handleUpdate = () => {
        try {
          const value = toRaw(json.value);
          const data = typeof value === 'string' ? JSON.parse(value) : value;
          props.template.update(data);
          msg.success('更新成功');
        } catch (e) {
          //
          console.error(e);
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
                    title="查看模板Json"
                    extra={
                      <Space>
                        {props.showUpdate && (
                          <Button size="small" onClick={handleUpdate}>
                            更新
                          </Button>
                        )}

                        <Icon
                          icon="ant-design:close-outlined"
                          size={20}
                          color="#333333"
                          onClick={handleClose}
                          class={'ml-20 cursor-pointer'}
                        />
                      </Space>
                    }
                  >
                    <CodeEditor v-model:value={json.value} />
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
  .print-design-json-preview {
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
        padding: 16px;
        background-color: transparent;
      }

      .ant-card-body {
        height: 600px;
      }
    }
  }
</style>
