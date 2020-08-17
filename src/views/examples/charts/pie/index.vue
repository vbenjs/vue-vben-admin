<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  import { Row, Col } from 'ant-design-vue';
  import { CollapseContainer } from '@/components/container/index';

  import Pie1 from './Pie1.vue';
  import Pie2 from './Pie2.vue';
  import Pie4 from './Pie4.vue';
  import Pie5 from './Pie5.vue';
  // import Pie7 from './Pie7.vue';
  import Pie8 from './Pie8.vue';
  export default defineComponent({
    setup() {
      return () => {
        return (
          <Row>
            <Col md={24} lg={12} class="p-2">
              <CollapseContainer title="基础饼图" canExpan={false}>
                <Pie1 />
              </CollapseContainer>
            </Col>
            <Col md={24} lg={12} class="p-2">
              <CollapseContainer title="自定义饼图" canExpan={false}>
                <Pie2 />
              </CollapseContainer>
            </Col>

            <Col md={24} lg={12} class="p-2">
              <CollapseContainer title="环形" canExpan={false}>
                <Pie4 />
              </CollapseContainer>
            </Col>
            <Col md={24} lg={12} class="p-2">
              <CollapseContainer title="蓝色饼图" canExpan={false}>
                <Pie5 />
              </CollapseContainer>
            </Col>

            {
              //   <Col span={24} class="p-2">
              //   <CollapseContainer title="弧形拼接环形饼图" canExpan={false}>
              //     <Pie7 height="600px" />
              //   </CollapseContainer>
              // </Col>
            }
            <Col span={24} class="p-2">
              <CollapseContainer title="琴键图表" canExpan={false}>
                <Pie8 height="600px" />
              </CollapseContainer>
            </Col>
          </Row>
        );
      };
    },
  });
</script>
