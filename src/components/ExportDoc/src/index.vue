<script lang="tsx">
  import { defineComponent, ref, unref, watchEffect } from 'vue';
  import { TemplateEnum, exportTemplate } from '@/api/export';
  import { debounce } from 'lodash-es';
  import { DocTemplateResult } from '@/api/system/model/docTempModel';
  import { downloadBlob } from '@/utils/file/file';
  import { FIcon } from '@/components/Business';

  const props = {
    show: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    templateType: {
      type: String as PropType<TemplateEnum>,
      required: true,
    },
    where: {
      type: Object as PropType<Recordable>,
      default: () => {},
    },
    ids: {
      type: Array as PropType<number[]>,
      default: () => [],
    },
    templateList: {
      type: Array as PropType<DocTemplateResult[]>,
      default: () => [],
    },
  };

  const prefixCls = 'export-doc';
  export default defineComponent({
    name: 'ExportDoc',
    props,
    setup(props, { expose }) {
      const wrapElRef = ref<HTMLDivElement | null>(null);
      const show = ref(false);
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
        }
      });

      const handleMaskClick = (e: MouseEvent) => {
        if ((e?.target as HTMLDivElement).classList.contains(`${prefixCls}-content`)) {
          handleClose(e);
        }
      };

      const loading = ref(false);

      const onCancel = () => {
        show.value = false;
      };
      const onClick = debounce(function ({ id }) {
        const { ids, where } = props;
        downloadTemp(props.templateType!, id, ids, where);
        onCancel();
      }, 1000);
      const downloadTemp = async (
        templateType: TemplateEnum,
        templateId: number,
        ids: number[],
        queryParam = {},
      ) => {
        loading.value = true;
        try {
          const res = await exportTemplate(templateType, templateId, ids, {
            ...queryParam,
            ...props.where,
          });
          console.log(res);
          downloadBlob(res);
        } catch (error) {
          console.log(error);
        }
        loading.value = false;
      };
      return () => {
        return (
          show.value && (
            <div class={prefixCls} ref={wrapElRef} onClick={handleMaskClick}>
              <div class={`${prefixCls}-content`}>
                <div class="w-60vw bg-white p-4">
                  <p class="text-[#333333]">模板选择</p>
                  {unref(loading) && <div class="empty-tips">加载中，请稍后……</div>}

                  {!unref(loading) && (
                    <div class="flex flex-wrap w-full">
                      {props.templateList?.map((item, index) => {
                        return (
                          <div
                            class={{
                              'template-box md:w-[calc(25%_-_9px)] w-full': true,
                              'md:mr-12px': (index % 4) + 1 < 4,
                              'mt-12px': (index + 1) / 4 > 1,
                            }}
                          >
                            <div class="template-content" onClick={() => onClick(item)}>
                              <div class="template-icon flex items-center justify-center">
                                {item.sysDefault === 'Y' && (
                                  <div class="default">
                                    <div class="default-icon text-xs">默认</div>
                                  </div>
                                )}
                                <FIcon file-name={item.templateName} width={50} />
                              </div>
                              <div class="select-button">
                                <a-button type="link" disabled={item.isEnable === 'N'}>
                                  选择
                                </a-button>
                              </div>
                            </div>
                            <div>
                              <div
                                class="whitespace-nowrap text-ellipsis overflow-hidden"
                                title={item.templateName}
                              >
                                {item.templateName}
                              </div>
                              <div class="text-xs text-gray-300">
                                {item.supportMaxRecord === 0
                                  ? '无限制'
                                  : item.supportMaxRecord + '行'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
  .export-doc {
    display: flex;
    position: fixed;
    z-index: @preview-comp-z-index;
    inset: 0;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background: rgb(0 0 0 / 50%);
    user-select: none;

    &-content {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;

      .empty-tips {
        height: 100px;
        line-height: 100px;
        text-align: center;
      }

      .template-box {
        .template-content {
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 148%;
          overflow: hidden;
          border: 1px solid #c2c2c2;
          border-radius: 4px;
          background-color: #fff;
          // box-shadow: 2px 2px 2px #dddddd;
          text-align: center;

          .template-icon {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }

          .default {
            position: absolute;
            top: 0;
            right: 0;

            .default-icon {
              position: relative;
              width: 30px;
              height: 16px;
              border-radius: 0 0 0 2px;
              background: linear-gradient(to right, #ffb996, #fb9968);
              color: #fff;

              &::after {
                content: ' ';
                position: absolute;
                top: 0;
                left: -12px;
                width: 0;
                height: 0;
                border-top: 16px solid #ffb996;
                border-left: 12px solid transparent;
              }
            }
          }

          .select-button {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 32px;

            button {
              display: none;
            }
          }
        }

        &:hover {
          .select-button {
            background-color: #f4fcfc;

            button {
              display: inline-block;
            }
          }
        }
      }
    }
  }
</style>
