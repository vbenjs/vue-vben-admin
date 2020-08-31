<script lang="tsx">
  import { defineComponent, computed, unref } from 'compatible-vue';
  import { Row, Col, Tag } from 'ant-design-vue';
  import { CollapseContainer, ScrollContainer } from '@/components/container/index';

  import { useDesign } from '@/hooks/core/useDesign';

  import { wokbStore } from '../store';
  // import { AnnoItem } from '@/api/dashboard/model/wokbModel';

  export default defineComponent({
    name: 'AnnoList',
    setup() {
      const { prefixCls } = useDesign('anno-list');
      const getAnnoList = computed(() => {
        return wokbStore.getAnnoList;
      });

      return () => (
        // <div class={prefixCls}>
        <CollapseContainer class={prefixCls} title="公告" canExpan={false}>
          <ScrollContainer>
            {unref(getAnnoList).map((item) => {
              const { id, annoTitle, annoTime, annoType } = item;
              return (
                <Row type="flex" key={id} class={[`${prefixCls}__item`]}>
                  <Col style={{ flex: '1' }} class="ellipsis">
                    <Tag color="#108ee9">{annoType}</Tag>{' '}
                    <span title={annoTitle}> {annoTitle}</span>
                  </Col>
                  <Col>{annoTime}</Col>
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
  @prefix-cls: ~'@{namespace}-anno-list';
  .@{prefix-cls} {
    /deep/ .@{namespace}-collapse-container__body {
      height: 240px;
    }

    &__item {
      padding: 8px 0;
      font-size: 14px;
      line-height: 22px;
      color: #7c8087;

      // /deep/ .ant-btn {
      //   font-size: 12px;
      // }
    }
  }
</style>
