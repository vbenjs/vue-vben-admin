<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Row, Col } from 'ant-design-vue';
  import { BasicModal } from '@/components/modal/index';
  import { BasicEmpty } from '@/components/empty/index';
  import { Icon } from '@/components/icon/index';

  import { priviewProps } from './props';
  import { PriviewProps, UploadResult } from './types';
  import { downloadByUrl } from './FileDownload';
  import { useDesign } from '@/hooks/core/useDesign';

  export default defineComponent({
    name: 'UploadPreviewModal',
    props: priviewProps,
    setup(props: PriviewProps, { listeners }) {
      const { prefixCls } = useDesign('upload-priview');
      function renderEmpty() {
        return <BasicEmpty />;
      }
      function renderImg() {
        return (
          <Row>
            {props.priviewList.map((file, index) => {
              return (
                <Col span={8} key={index} class={`${prefixCls}__item`}>
                  <img src={file.url} title={file.name} />
                  <div
                    onClick={handleDownload.bind(null, file)}
                    class={[`${prefixCls}__download`, 'py-2']}
                  >
                    <Icon type="download" />
                  </div>
                </Col>
              );
            })}
          </Row>
        );
      }

      function handleDownload(file: UploadResult) {
        downloadByUrl(file.url);
      }
      function renderFile() {
        return props.priviewList.map((file, index) => {
          return (
            <Row type="flex" key={index}>
              <Col style={{ flex: '1' }} class={[`${prefixCls}__file-item`, 'ellipsis']}>
                {file.name}
              </Col>
              <Col
                onClick={handleDownload.bind(null, file)}
                class={[`${prefixCls}__download`, 'px-2']}
              >
                <Icon type="download" />
              </Col>
            </Row>
          );
        });
      }

      return () => (
        <BasicModal title="预览" width={600} on={listeners} footer={null}>
          {props.priviewList}
          <div class={prefixCls}>
            {!props.priviewList || props.priviewList.length === 0
              ? renderEmpty()
              : props.uploadImg
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
      img {
        width: 100%;
      }
    }

    &__download {
      font-size: 18px;
      color: @primary-color;
      text-align: center;
    }
  }
</style>
