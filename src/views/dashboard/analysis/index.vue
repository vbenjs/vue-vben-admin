<template>
  <div class="analysis p-4">
    <Row class="pl-2">
      <template v-for="item in growCardList" :key="item.title">
        <ACol :sm="24" :md="12" :lg="6">
          <GrowCard :info="item" />
        </ACol>
      </template>
    </Row>

    <Row>
      <ACol :md="24" :lg="17" class="my-3">
        <CollapseContainer class="mr-3" title="产品成交额" :canExpan="false">
          <AnalysisLine />
        </CollapseContainer>
        <Row class="mt-3">
          <ACol :md="24" :lg="12" class="product-total">
            <CollapseContainer class="mr-3" title="产品成交额" :canExpan="false">
              <AnalysisPie />
            </CollapseContainer>
          </ACol>
          <ACol :md="24" :lg="12">
            <CollapseContainer class="mr-3" title="用户来源" :canExpan="false">
              <AnalysisBar />
            </CollapseContainer>
          </ACol>
        </Row>
      </ACol>
      <ACol :md="24" :lg="7">
        <CollapseContainer class="mt-3" title="项目进度" :canExpan="false">
          <template v-for="item in taskList" :key="item.title">
            <TaskCard :info="item" />
          </template>
        </CollapseContainer>
      </ACol>
    </Row>
    <Row>
      <FlowAnalysis />
    </Row>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import GrowCard from './components/GrowCard.vue';
  import TrendLine from './components/TrendLine.vue';
  import AnalysisLine from './components/AnalysisLine.vue';
  import AnalysisPie from './components/AnalysisPie.vue';
  import AnalysisBar from './components/AnalysisBar.vue';
  import TaskCard from './components/TaskCard.vue';
  import FlowAnalysis from './components/FlowAnalysis';
  import { Row, Col } from 'ant-design-vue';
  import { CollapseContainer } from '/@/components/Container/index';

  import { growCardList, taskList } from './data';
  export default defineComponent({
    components: {
      Row,
      ACol: Col,
      GrowCard,
      CollapseContainer,
      TrendLine,
      AnalysisLine,
      AnalysisPie,
      AnalysisBar,
      TaskCard,
      FlowAnalysis,
    },
    setup() {
      return { growCardList, taskList };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '../../../design/index.less';

  .analysis {
    width: 100%;

    .product-total {
      .respond-to(small-and-medium, {padding-right: 0;margin-bottom: 24px;});
    }
  }
</style>
