<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import GrowCard from './components/GrowCard.vue';
  import TaskCard from './components/TaskCard.vue';
  import AnalysisLine from './components/AnalysisLine.vue';
  import AnalysisPie from './components/AnalysisPie.vue';
  import AnalysisBar from './components/AnalysisBar.vue';
  import { CollapseContainer } from '@/components/container/index';
  import FlowAnalysis from './FlowAnalysis.vue';

  import { Row, Col } from 'ant-design-vue';

  import { useDesign } from '@/hooks/core/useDesign';

  import { growCardList, taskList } from './data';
  export default defineComponent({
    setup() {
      const { prefixCls } = useDesign('analysis');

      return () => (
        <div class={[prefixCls, 'p-4']}>
          <Row class="grow-card">
            {growCardList.map((item, index) => {
              return (
                <Col key={index} sm={24} md={12} lg={6}>
                  <GrowCard info={item} />
                </Col>
              );
            })}
          </Row>

          <Row>
            <Col md={24} lg={17} class="pr-6 my-3">
              <CollapseContainer class="mr-3" title="产品成交额" canExpan={false}>
                <AnalysisLine />
              </CollapseContainer>
              <Row class="mt-3">
                <Col md={24} lg={12} class="pr-3 product-total">
                  <CollapseContainer class="mr-3" title="产品成交额" canExpan={false}>
                    <AnalysisPie />
                  </CollapseContainer>
                </Col>
                <Col md={24} lg={12}>
                  <CollapseContainer class="mr-3" title="用户来源" canExpan={false}>
                    <AnalysisBar />
                  </CollapseContainer>
                </Col>
              </Row>
            </Col>
            <Col md={24} lg={7}>
              <CollapseContainer class="mt-3" title="项目进度" canExpan={false}>
                {taskList.map((item, index) => {
                  return <TaskCard key={index} info={item} />;
                })}
              </CollapseContainer>
            </Col>
          </Row>
          <Row>
            <FlowAnalysis />
          </Row>
        </div>
      );
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-analysis';
  .@{prefix-cls} {
    width: 100%;

    .product-total {
      .respond-to(small-and-medium, {padding-right: 0;margin-bottom: 24px;});
    }

    .grow-card {
      margin-right: -12px;
    }
  }
</style>
