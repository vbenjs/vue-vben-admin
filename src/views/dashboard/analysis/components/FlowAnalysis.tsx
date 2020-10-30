import { defineComponent } from 'vue';
import { Tabs, Row, Col, Progress, Divider } from 'ant-design-vue';
import { CollapseContainer } from '/@/components/Container/index';
import TrendLine from './TrendLine.vue';
import './flow-ana.less';
const prefixCls = 'flow-analysis';
export default defineComponent({
  name: 'AnalysisFLow',
  setup() {
    const renderContent = () => {
      return (
        <Row>
          {() => (
            <>
              <Col md={24} lg={8}>
                {() => (
                  <CollapseContainer
                    title="整体流量评分"
                    canExpan={false}
                    class={`${prefixCls}__left`}
                  >
                    {() => (
                      <div>
                        <div class={`${prefixCls}__score`}>
                          86.2<span>分</span>
                        </div>
                        <div class={`${prefixCls}__rank`}>
                          排名<span>前20%</span>
                        </div>
                        <Progress percent={70} showInfo={false} status="active" />
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
                      </div>
                    )}
                  </CollapseContainer>
                )}
              </Col>
              <Col md={24} lg={16}>
                {() => (
                  <CollapseContainer title="整体流量趋势" canExpan={false}>
                    {() => <TrendLine />}
                  </CollapseContainer>
                )}
              </Col>
            </>
          )}
        </Row>
      );
    };
    return () => (
      <Tabs class={prefixCls} default-active-key="1">
        {() => [
          <Tabs.TabPane key="1" tab="产品一">
            {() => renderContent()}
          </Tabs.TabPane>,
          <Tabs.TabPane key="2" tab="产品二">
            {() => renderContent()}
          </Tabs.TabPane>,
          <Tabs.TabPane key="3" tab="产品三">
            {() => renderContent()}
          </Tabs.TabPane>,
        ]}
      </Tabs>
    );
  },
});
