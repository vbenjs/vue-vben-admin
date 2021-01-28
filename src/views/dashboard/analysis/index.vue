<template>
  <div class="p-4 analysis">
    <a-row class="pl-2">
      <template v-for="item in growCardList" :key="item.title">
        <a-col :sm="24" :md="12" :lg="6">
          <GrowCard :info="item" />
        </a-col>
      </template>
    </a-row>

    <a-row>
      <a-col :md="24" :lg="17" class="my-3">
        <CollapseContainer class="mr-3" title="产品成交额" :canExpan="false">
          <AnalysisLine />
        </CollapseContainer>
        <a-row class="mt-3">
          <a-col :md="24" :lg="12" class="product-total">
            <CollapseContainer class="mr-3" title="产品成交额" :canExpan="false">
              <AnalysisPie />
            </CollapseContainer>
          </a-col>
          <a-col :md="24" :lg="12">
            <CollapseContainer class="mr-3" title="用户来源" :canExpan="false">
              <AnalysisBar />
            </CollapseContainer>
          </a-col>
        </a-row>
      </a-col>
      <a-col :md="24" :lg="7">
        <CollapseContainer class="mt-3" title="项目进度" :canExpan="false">
          <template v-for="item in taskList" :key="item.title">
            <TaskCard :info="item" />
          </template>
        </CollapseContainer>
      </a-col>
    </a-row>
    <a-row>
      <FlowAnalysis />
    </a-row>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import GrowCard from './components/GrowCard.vue';
  import AnalysisLine from './components/AnalysisLine.vue';
  import AnalysisPie from './components/AnalysisPie.vue';
  import AnalysisBar from './components/AnalysisBar.vue';
  import TaskCard from './components/TaskCard.vue';
  import FlowAnalysis from './components/FlowAnalysis';
  import { CollapseContainer } from '/@/components/Container/index';
  import { Row, Col } from 'ant-design-vue';
  import { growCardList, taskList } from './data';
  export default defineComponent({
    components: {
      GrowCard,
      CollapseContainer,
      AnalysisLine,
      AnalysisPie,
      AnalysisBar,
      TaskCard,
      FlowAnalysis,
      [Row.name]: Row,
      [Col.name]: Col,
    },
    setup() {
      return { growCardList, taskList };
    },
  });
</script>
<style lang="less" scoped>
  .analysis {
    width: 100%;

    .product-total {
      .respond-to(small-and-medium, {padding-right: 0;margin-bottom: 24px;});
    }
  }
</style>
