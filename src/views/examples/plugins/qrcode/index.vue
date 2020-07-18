<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { CollapseContainer } from '@/components/container/index';
  import { QrCode } from '@/components/qrcode/index';
  import { Row, Col } from 'ant-design-vue';
  export default defineComponent({
    name: 'QrcodePlguinDemo',
    setup() {
      return () => (
        <div class="p-4">
          <Row>
            <Col span={11}>
              <CollapseContainer title="基础示例" canExpan={false}>
                <QrCode value="https://www.baidu.com" />
              </CollapseContainer>
            </Col>
            <Col span={10} offset={1}>
              <CollapseContainer title="渲染成img标签示例" canExpan={false}>
                <QrCode value="https://www.baidu.com" tag="img" />
              </CollapseContainer>
            </Col>
            <Col span={11} class="mt-4">
              <CollapseContainer title="配置样式示例" canExpan={false}>
                <QrCode
                  value="https://www.baidu.com"
                  options={{
                    color: { dark: '#55D187' },
                  }}
                />
              </CollapseContainer>
            </Col>
            <Col span={10} offset={1} class="mt-4">
              <CollapseContainer title="配置大小示例" canExpan={false}>
                <QrCode
                  value="https://www.baidu.com"
                  options={{
                    width: 400,
                  }}
                />
              </CollapseContainer>
            </Col>
          </Row>
        </div>
      );
    },
  });
</script>
