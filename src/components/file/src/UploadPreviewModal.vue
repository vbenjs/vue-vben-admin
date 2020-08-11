<script lang="tsx">
  import { defineComponent, reactive, watch } from 'compatible-vue';
  import { Row, Col } from 'ant-design-vue';
  import { BasicModal } from '@/components/modal/index';
  import { BasicEmpty } from '@/components/empty/index';
  import { Icon } from '@/components/icon/index';

  import { priviewProps } from './props';
  import { PriviewProps, UploadResult } from './types';
  import { downloadByUrl } from './FileDownload';
  import { useDesign } from '@/hooks/core/useDesign';
  import { createImgPreview } from '@/components/preview/index';
  import { useMessage } from '@/hooks/core/useMessage';

  export default defineComponent({
    name: 'UploadPreviewModal',
    props: priviewProps,
    setup(props: PriviewProps, { listeners, emit }) {
      const { prefixCls } = useDesign('upload-priview');
      const { createConfirm } = useMessage();

      const state = reactive<{ fileList: Array<UploadResult>; hasRemove: boolean }>({
        fileList: [],
        hasRemove: false,
      });
      watch(
        () => props.priviewList,
        (value) => {
          if (value && value.length > 0) {
            state.fileList = [...value];
          }
        },
        { immediate: true }
      );
      function handleRemove(file) {
        const index = state.fileList.indexOf(file);
        const newFileList = state.fileList.slice();
        newFileList.splice(index, 1);
        state.hasRemove = true;
        state.fileList = newFileList;
      }
      function handleOk() {
        emit('change', state.fileList);
        state.hasRemove = false;
      }
      function handleCloseFunc() {
        return new Promise((resolve) => {
          if (state.hasRemove) {
            createConfirm({
              iconType: 'warning',
              title: '温馨提醒',
              content: '已有删除文件，确定放弃保存?',
              onOk: () => {
                resolve(true);
                state.fileList = [...props.priviewList];
                state.hasRemove = false;
              },
              // onCancel: () => {
              //   state.fileList = [...props.priviewList];
              // },
            });
          } else {
            resolve(true);
          }
        });
      }
      function renderEmpty() {
        return <BasicEmpty />;
      }
      function renderImg() {
        return (
          <Row gutter={16} type="flex" align="bottom">
            {state.fileList.map((file, index) => {
              return (
                <Col span={8} key={index} class={`${prefixCls}__item`}>
                  <div class={`${prefixCls}__item-content`}>
                    <img class={`${prefixCls}__item-img`} src={file.url} title={file.name} />

                    <div class={[`${prefixCls}__item-action`]}>
                      <span class={`${prefixCls}__item-icons`}>
                        <Icon
                          type="eye"
                          class={`${prefixCls}__item-icon`}
                          onClick={createImgPreview.bind(null, { imageList: [file.url] })}
                        />
                        <Icon
                          type="download"
                          class={`${prefixCls}__item-icon`}
                          onClick={handleDownload.bind(null, file)}
                        />
                        <Icon
                          type="delete"
                          class={`${prefixCls}__item-icon`}
                          onClick={handleRemove.bind(null, file)}
                        />
                      </span>
                    </div>
                  </div>
                  <p class={[`${prefixCls}__item-name`, 'my-1']}>{file.name}</p>
                </Col>
              );
            })}
          </Row>
        );
      }

      function handleDownload(file: UploadResult) {
        downloadByUrl({
          url: file.url,
        });
      }
      function renderFile() {
        return state.fileList.map((file, index) => {
          return (
            <Row type="flex" key={index} class={[`${prefixCls}__file`, 'mb-2']}>
              <Col style={{ flex: '1' }} class={[`${prefixCls}__file-name`, 'ellipsis']}>
                {file.name}
              </Col>
              <Col class={[`${prefixCls}__file-action`]}>
                <Icon
                  type="download"
                  class={`${prefixCls}__file-icon`}
                  onClick={handleDownload.bind(null, file)}
                />
                <Icon
                  type="delete"
                  class={`${prefixCls}__file-icon`}
                  onClick={handleRemove.bind(null, file)}
                />
              </Col>
            </Row>
          );
        });
      }

      return () => (
        <BasicModal
          title="预览"
          width={600}
          closeFunc={handleCloseFunc}
          on={{ ...listeners, ok: handleOk }}
        >
          <div class={prefixCls}>
            {!state.fileList || state.fileList.length === 0
              ? renderEmpty()
              : props.isUploadImg
              ? renderImg()
              : renderFile()}
          </div>
        </BasicModal>
      );
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-upload-priview ';

  .@{prefix-cls} {
    &__item {
      &-content {
        position: relative;
      }

      &-content:hover &-action {
        display: block;
      }

      &-img {
        width: 100%;
      }

      &-name {
        font-size: 14px;
      }

      &-action {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: none;
        font-size: 18px;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.5);

        // &--active {
        //   display: block;
        // }
      }

      &-icons {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        text-align: center;
        // z-index: 10;
        // white-space: nowrap;
        transform: translate(-50%, -50%);
      }

      &-icon {
        padding: 0 4px;

        &:hover {
          color: @primary-color;
        }
      }
    }

    &__file {
      &-name {
        &:hover {
          color: @primary-color;
        }
      }

      &-icon {
        padding: 0 4px;
        font-size: 16px;

        &:hover {
          color: @primary-color;
        }
      }
    }
  }
</style>
