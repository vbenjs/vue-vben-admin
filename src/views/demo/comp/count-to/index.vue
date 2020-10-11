<template>
  <div class="p-4 count-to-demo">
    <Card>
      <CardGrid class="count-to-demo-card">
        <CountTo prefix="$" :startVal="1" :endVal="200000" :duration="8000" />
      </CardGrid>
      <CardGrid class="count-to-demo-card">
        <CountTo suffix="$" :startVal="1" :endVal="300000" :decimals="2" :duration="6000" />
      </CardGrid>
      <CardGrid class="count-to-demo-card">
        <CountTo suffix="$" :startVal="1" :endVal="400000" :duration="7000" />
      </CardGrid>
      <CardGrid class="count-to-demo-card">
        <CountTo separator="-" :startVal="10000" :endVal="500000" :duration="8000" />
      </CardGrid>
    </Card>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Card } from 'ant-design-vue';
  import { CountTo } from '/@/components/CountTo/index';
  export default defineComponent({
    components: {
      Card,
      CardGrid: Card.Grid,
      CountTo,
    },
    setup() {
      return {};
    },
  });
</script>
<style lang="less" scoped>
  .count-to-demo {
    &-card {
      width: 50%;
      font-size: 30px;
      text-align: center;
    }
  }
</style>
