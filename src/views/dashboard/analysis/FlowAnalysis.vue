<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Tabs, Row, Col, Progress, Divider } from 'ant-design-vue';
  import { CollapseContainer } from '@/components/container/index';
  import TrendLine from './components/TrendLine.vue';
  import { useDesign } from '@/hooks/core/useDesign';

  export default defineComponent({
    name: 'Analysis',
    setup() {
      const { prefixCls } = useDesign('flow-analysis');
      const renderContent = () => {
        return (
          <Row>
            <Col md={24} lg={8}>
              <CollapseContainer title="整体流量评分" canExpan={false} class={`${prefixCls}__left`}>
                <div class={`${prefixCls}__score`}>
                  86.2<span>分</span>
                </div>
                <div class={`${prefixCls}__rank`}>
                  排名<span>前20%</span>
                </div>
                <Progress percent={70} showInfo={false} />
                <Divider />

                <ul class={`${prefixCls}__rs`}>
                  <li>
                    <span>平均分</span>
                    <span>77.5</span>
                  </li>
                  <li>
                    <span>最高分</span>
                    <span>99.5</span>
                  </li>
                  <li>
                    <span>最低分</span>
                    <span>56.5</span>
                  </li>
                </ul>
              </CollapseContainer>
            </Col>
            <Col md={24} lg={16}>
              <CollapseContainer title="整体流量趋势" canExpan={false}>
                <TrendLine />
              </CollapseContainer>
            </Col>
          </Row>
        );
      };
      return () => (
        <Tabs class={prefixCls} default-active-key="1">
          <Tabs.TabPane key="1" tab="产品一">
            {renderContent()}
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab="产品二">
            {renderContent()}
          </Tabs.TabPane>
          <Tabs.TabPane key="3" tab="产品三">
            {renderContent()}
          </Tabs.TabPane>
        </Tabs>
      );
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-flow-analysis';
  .@{prefix-cls} {
    width: 100%;
    background: @white;

    &__left {
      padding: 10px 20px !important;
      border-right: 1px solid rgba(0, 0, 0, 0.06);
    }

    &__score {
      margin-top: 20px;
      font-size: 30px;
      line-height: 38px;
      color: rgba(0, 0, 0, 0.85);

      span {
        font-size: 20px;
        line-height: 28px;
        color: rgba(0, 0, 0, 0.85);
      }
    }

    &__rank {
      margin: 16px 0;
      font-size: 12px;
      line-height: 20px;
      color: #7c8087;

      span {
        display: inline-block;
        margin-left: 10px;
        color: #1c1d21;
      }
    }

    &__rs {
      li {
        display: flex;
        line-height: 28px;
        justify-content: space-between;

        span {
          &:nth-child(1) {
            font-size: 14px;
            color: #1c1d21;
          }

          &:nth-child(2) {
            font-size: 16px;
            color: #1c1d21;
          }
        }
      }
    }
  }
</style>
