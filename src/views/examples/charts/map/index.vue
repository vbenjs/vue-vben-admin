<script lang="tsx">
  import { defineComponent } from 'compatible-vue';

  import { Row, Col } from 'ant-design-vue';
  import { CollapseContainer } from '@/components/container/index';

  import Map1 from './Map1.vue';

  export default defineComponent({
    setup() {
      return () => {
        return (
          <Row>
            <Col span={24} class="p-2">
              <CollapseContainer title="示例1" canExpan={false}>
                <Map1 height="600px" />
              </CollapseContainer>
            </Col>
          </Row>
        );
      };
    },
  });
</script>
