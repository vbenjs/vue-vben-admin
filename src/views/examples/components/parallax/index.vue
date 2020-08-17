<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { Row, Col, Divider } from 'ant-design-vue';

  import { Parallax } from '@/components/parallax/index';

  import parallax1Img from '@/assets/images/demo/parallax1.jpg';
  export default defineComponent({
    setup() {
      return () => (
        <div class="p-4 parallax-demo">
          <Row>
            <Col span={22} offset={1}>
              <div style="demo-card">
                <Divider>基础示例</Divider>
                <Parallax src={parallax1Img} />
              </div>
            </Col>
            <Col span={22} offset={1}>
              <div style="demo-card">
                <Divider>指定高度示例</Divider>
                <Parallax height={300} src={parallax1Img} />
              </div>
            </Col>

            <Col span={22} offset={1}>
              <div style="demo-card">
                <Divider>提示文本示例</Divider>
                <Parallax src={parallax1Img}>hello word</Parallax>
              </div>
            </Col>
          </Row>
        </div>
      );
    },
  });
</script>
<style lang="less" scoped>
  .parallax-demo {
    height: 4000px;

    .demo-card {
      height: 300px;
    }
  }
</style>
