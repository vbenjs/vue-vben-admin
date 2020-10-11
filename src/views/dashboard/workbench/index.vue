<template>
  <Row class="workbench p-4" :gutter="12">
    <Col :md="24" :lg="17">
      <ProdTotal class="mb-3" />
      <TodoList class="mb-3" />
      <NewsList class="mb-3" />
    </Col>
    <Col :md="24" :lg="7">
      <img src="/@/assets/images/dashboard/wokb/wokb.png" class="workbench__wokb-img mb-3" />
      <ShortCuts class="mb-3" />
      <Week class="mb-3" />
    </Col>
  </Row>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Row, Col } from 'ant-design-vue';
  import ProdTotal from './components/ProdTotal.vue';
  import TodoList from './components/TodoList.vue';
  import Week from './components/Week.vue';
  import NewsList from './components/NewsList.vue';
  import ShortCuts from './components/ShortCuts.vue';

  export default defineComponent({
    components: { Row, Col, ProdTotal, TodoList, Week, ShortCuts, NewsList },
    setup() {
      return {};
    },
  });
</script>
<style lang="less" scoped>
  .workbench {
    &__wokb-img {
      width: 100%;
      height: 240px;
    }
  }
</style>
