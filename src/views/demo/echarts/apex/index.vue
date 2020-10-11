<template>
  <div class="apex-demo p-4">
    <div class="demo-box">
      <Line />
    </div>
    <div class="demo-box">
      <Bar />
    </div>
    <div class="demo-box">
      <Area />
    </div>
    <div class="demo-box">
      <Mixed />
    </div>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';

  import Line from './Line.vue';
  import Bar from './Bar.vue';
  import Area from './Area.vue';
  import Mixed from './Mixed.vue';
  export default defineComponent({
    components: { Line, Bar, Area, Mixed },
    setup() {},
  });
</script>
<style lang="less" scoped>
  .apex-demo {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .demo-box {
      width: 49%;
      margin-bottom: 20px;
      background: #fff;
      border-radius: 10px;
    }
  }
</style>
