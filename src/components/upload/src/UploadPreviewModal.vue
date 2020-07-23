<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Row, Col } from 'ant-design-vue';
  import { BasicModal } from '@/components/modal/index';
  import { BasicEmpty } from '@/components/empty/index';

  import { priviewProps } from './props';
  import { PriviewProps } from './types';

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
        return props.priviewList.map((file, index) => {
          return (
            <Col span={8} key={index} class={`${prefixCls}__item`}>
              <img src={file.url} title={file.name} />
            </Col>
          );
        });
      }
      // TODO: 下载文件
      function renderFile() {
        return props.priviewList.map((file, index) => {
          return (
            <Col key={index} class={`${prefixCls}__file-item`}>
              {file.name}
            </Col>
          );
        });
      }

      return () => (
        <BasicModal title="预览" width={600} on={listeners} footer={null}>
          {props.priviewList}
          <Row class={prefixCls}>
            {!props.priviewList || props.priviewList.length === 0
              ? renderEmpty()
              : props.uploadImg
              ? renderImg()
              : renderFile()}
          </Row>
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
  }
</style>
