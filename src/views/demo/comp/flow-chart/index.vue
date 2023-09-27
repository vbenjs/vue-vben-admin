<template>
  <PageWrapper
    title="流程图"
    content="简单流程图示例,具体功能需要自己完善"
    contentFullHeight
    fixedHeight
  >
    <FlowChart :data="demoData" />
  </PageWrapper>
</template>

<script lang="ts">
  import { FlowChart } from '/@/components/FlowChart';
  import { PageWrapper } from '/@/components/Page';

  import demoData from './dataTurbo.json';

  export default {
    components: { FlowChart, PageWrapper },
    setup() {
      return { demoData };
    },
  };
</script>
