<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Card } from 'ant-design-vue';
  import VueCountTo from 'vue-count-to';

  export default defineComponent({
    name: 'CountToDemo',
    setup() {
      return () => (
        <div class="p-4 count-to-demo">
          <Card>
            <Card.Grid class="count-to-demo-card">
              <VueCountTo prefix="$" startVal={1} endVal={200000} duration={8000} />
            </Card.Grid>
            <Card.Grid class="count-to-demo-card">
              <VueCountTo suffix="$" startVal={1} endVal={300000} decimals={2} duration={6000} />
            </Card.Grid>
            <Card.Grid class="count-to-demo-card">
              <VueCountTo suffix="$" startVal={1} endVal={400000} duration={7000} />
            </Card.Grid>
            <Card.Grid class="count-to-demo-card">
              <VueCountTo separator="-" startVal={10000} endVal={500000} duration={8000} />
            </Card.Grid>
          </Card>
        </div>
      );
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
