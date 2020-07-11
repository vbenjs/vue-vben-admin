<script lang="tsx">
  import { defineComponent, unref, PropOptions } from 'compatible-vue';
  import { Dropdown } from '@/components/dropdown/index';
  import { Icon } from '@/components/icon/index';

  import { useDesign } from '@/hooks/core/useDesign';
  import projectSetting from '@/settings/projectSetting';
  import { useTabDropdown } from './useMultiTab';
  // type
  import { TabContentEnum, TabContentProps } from './tab.data';

  export default defineComponent({
    name: 'TabContent',
    props: {
      tabItem: {
        type: Object,
        default: () => {
          return {};
        },
      } as PropOptions<any>,
      type: {
        type: Number,
        default: TabContentEnum.TAB_TYPE,
      } as PropOptions<number>,
      trigger: {
        type: Array,
        default: () => {
          return ['contextmenu'];
        },
      } as PropOptions<string[]>,
    },
    setup(props: Readonly<TabContentProps>) {
      const { prefixCls } = useDesign('multi-tabs-tabcontent');

      /**
       * @description: 渲染图标
       */
      function renderIcon() {
        const icon = props.tabItem.meta && props.tabItem.meta.icon;
        return icon && projectSetting.multiTabsSetting.showIcon ? <Icon type={icon} /> : null;
      }
      function renderTabContent() {
        const { tabItem: { meta } = {} } = props;
        return (
          <div class={`${prefixCls}__content`}>
            {renderIcon()}
            <span>{meta && meta.title}</span>
          </div>
        );
      }
      function renderExtraContent() {
        return (
          <span class={`${prefixCls}__extra`}>
            <Icon type="down" />
          </span>
        );
      }

      const { getDropMenuList, handleMenuEvent } = useTabDropdown(props);

      return () => {
        const { trigger, type } = props;
        return (
          <Dropdown
            dropMenuList={unref(getDropMenuList)}
            trigger={trigger}
            onMenuEvent={handleMenuEvent}
          >
            {type === TabContentEnum.TAB_TYPE ? renderTabContent() : renderExtraContent()}
          </Dropdown>
        );
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-multi-tabs-tabcontent';

  .@{prefix-cls} {
    &__extra {
      display: inline-block;
      width: 64px;
      color: @primary-color;
      text-align: center;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    }

    &__content {
      display: inline-block;
      width: 100%;
      padding-left: 10px;
      margin-left: -10px;
      .unselect();
    }
  }
</style>
