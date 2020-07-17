<script lang="tsx">
  import { defineComponent, unref } from 'compatible-vue';
  import { Tabs, Tooltip, Icon, Row, Col } from 'ant-design-vue';
  import { SvgIcon } from '@/components/icon/index';

  import { svgIcons } from './svgIcons';
  import { antIcons, antFillIcons } from './antIcons';

  import { useCopyToClipboard } from '@/hooks/event/useCopyToClipboard';
  import { useMessage } from '@/hooks/core/useMessage';

  export default defineComponent({
    name: 'IconIndex',
    setup() {
      const { createMessage } = useMessage();

      function generateAntIconCode(item, theme = '') {
        if (theme) {
          return `<Icon type="${item}" theme="${theme}"/>`;
        } else {
          return `<Icon type="${item}" />`;
        }
      }
      function generateSvgIconCode(item) {
        return `<SvgIcon type="${item}" />`;
      }

      function handleClipboard(item: string) {
        const { isSuccessRef } = useCopyToClipboard(item);
        if (unref(isSuccessRef)) {
          createMessage.success((h) => (
            <span>
              <code>{item}</code> copyed success!
            </span>
          ));
        }
      }

      function renderAntIcons() {
        return (
          <Row type="flex">
            {antIcons.map((item) => {
              return (
                <Col
                  key={item}
                  class="icon-demo__col py-4"
                  onClick={handleClipboard.bind(null, generateAntIconCode(item))}
                >
                  <Tooltip>
                    <template slot="title">{generateAntIconCode(item)}</template>
                    <Icon type={item} class="pb-2" />

                    <br />
                    <span>{item}</span>
                  </Tooltip>
                </Col>
              );
            })}
            {antFillIcons.map((item) => {
              return (
                <Col
                  key={`${item}-filled`}
                  class="icon-demo__col py-4"
                  onClick={handleClipboard.bind(null, generateAntIconCode(item, 'filled'))}
                >
                  <Tooltip>
                    <template slot="title">{generateAntIconCode(item, 'filled')}</template>
                    <Icon type={item} class="pb-2" theme="filled" />

                    <br />
                    <span>{item}</span>
                  </Tooltip>
                </Col>
              );
            })}
          </Row>
        );
      }
      function renderSvgIcons() {
        return (
          <Row type="flex">
            {svgIcons.map((item) => {
              return (
                <Col
                  key={item}
                  class="icon-demo__col py-4"
                  onClick={handleClipboard.bind(null, generateSvgIconCode(item))}
                >
                  <Tooltip>
                    <template slot="title">{generateSvgIconCode(item)}</template>
                    <SvgIcon type={item} class="pb-2" />
                    <br />
                    <span>{item}</span>
                  </Tooltip>
                </Col>
              );
            })}
          </Row>
        );
      }
      return () => (
        <Tabs default-active-key="1">
          <Tabs.TabPane key="1" tab="ant icons">
            {renderAntIcons()}
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab="svg icons">
            {renderSvgIcons()}
          </Tabs.TabPane>
        </Tabs>
      );
    },
  });
</script>
<style lang="less" scoped>
  .icon-demo {
    &__col {
      width: 150px;
      text-align: center;

      .anticon {
        font-size: 30px;
      }
    }
  }
</style>
