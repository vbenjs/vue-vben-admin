<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  import { Row, Col } from 'ant-design-vue';
  import { CollapseContainer } from '@/components/container/index';

  import Bar1 from './Bar1.vue';
  import Bar2 from './Bar2.vue';
  import Bar3 from './Bar3.vue';
  import Bar4 from './Bar4.vue';
  import Bar5 from './Bar5.vue';
  import Bar6 from './Bar6.vue';
  import Bar7 from './Bar7.vue';
  import Bar8 from './Bar8.vue';
  export default defineComponent({
    setup() {
      return () => {
        return (
          <Row>
            <Col md={24} lg={12} class="p-2">
              <CollapseContainer title="基础柱状图" canExpan={false}>
                <Bar1 />
              </CollapseContainer>
            </Col>
            <Col md={24} lg={12} class="p-2">
              <CollapseContainer title="交错正负轴" canExpan={false}>
                <Bar2 />
              </CollapseContainer>
            </Col>
            <Col md={24} lg={12} class="p-2">
              <CollapseContainer title="堆叠柱状图" canExpan={false}>
                <Bar3 />
              </CollapseContainer>
            </Col>
            <Col md={24} lg={12} class="p-2">
              <CollapseContainer title="堆叠条形图" canExpan={false}>
                <Bar4 />
              </CollapseContainer>
            </Col>
            <Col md={24} lg={12} class="p-2">
              <CollapseContainer title="某地区蒸发量和降水量" canExpan={false}>
                <Bar5 />
              </CollapseContainer>
            </Col>
            <Col md={24} lg={12} class="p-2">
              <CollapseContainer title="极坐标堆叠柱状图" canExpan={false}>
                <Bar6 />
              </CollapseContainer>
            </Col>
            <Col span={24} class="p-2">
              <CollapseContainer title="工程进度" canExpan={false}>
                <Bar7 height="600px" />
              </CollapseContainer>
            </Col>
            <Col span={24} class="p-2">
              <CollapseContainer title="琴键图表" canExpan={false}>
                <Bar8 height="600px" />
              </CollapseContainer>
            </Col>
          </Row>
        );
      };
    },
  });
</script>
