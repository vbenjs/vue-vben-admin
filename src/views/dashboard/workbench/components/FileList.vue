<script lang="tsx">
  import { defineComponent, computed, unref } from 'compatible-vue';
  import { Row, Col, Icon } from 'ant-design-vue';
  import { CollapseContainer, ScrollContainer } from '@/components/container/index';

  import { useDesign } from '@/hooks/core/useDesign';

  import { wokbStore } from '../store';
  import { FileItem } from '@/api/dashboard/model/wokbModel';

  export default defineComponent({
    name: 'FileList',
    setup() {
      const { prefixCls } = useDesign('file-list');
      const getFileList = computed(() => {
        return wokbStore.getFileList;
      });
      function handleDownload(item: FileItem) {
        console.log(item);
      }

      return () => (
        // <div class={prefixCls}>
        <CollapseContainer class={prefixCls} title="文件下载" canExpan={false}>
          <ScrollContainer>
            {unref(getFileList).map((item) => {
              const { id, fileTitle } = item;
              return (
                <Row type="flex" key={id} class={[`${prefixCls}__item`]}>
                  <Col style={{ flex: '1' }} class="ellipsis">
                    <Icon type="file" />
                    <span title={fileTitle}> {fileTitle}</span>
                  </Col>
                  <Col>
                    <a-button type="link" size="small" onClick={handleDownload.bind(item)}>
                      下载
                    </a-button>
                  </Col>
                </Row>
              );
            })}
          </ScrollContainer>
        </CollapseContainer>
        // </div>
      );
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-file-list';
  .@{prefix-cls} {
    /deep/ .@{namespace}-collapse-container__body {
      height: 180px;
    }

    &__item {
      padding: 8px 0;
      color: #1c1d21;
    }
  }
</style>
