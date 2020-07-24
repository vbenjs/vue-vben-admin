<script lang="tsx">
  import { defineComponent, watch, computed, ref, unref } from 'compatible-vue';
  import { Tabs } from 'ant-design-vue';
  import { tabStore, TabItem } from '@/store/modules/tab';
  import TabContent from './TabContent.vue';

  import { useDesign } from '@/hooks/core/useDesign';
  import { useGo } from '@/hooks/core/useRouter';
  import { addAffixTabs, closeTab } from './useMultiTab';

  import { TabContentEnum, TabContentProps } from './tab.data';
  import projectSetting from '@/settings/projectSetting';
  import { pageEnum } from '@/enums/pageEnum';

  export default defineComponent({
    name: 'MultiTabs',
    setup(_, { root }) {
      const { prefixCls } = useDesign('multi-tabs');

      // 当前激活tab
      const activeKeyRef = ref<string>('');
      // 当前tab列表
      const getTabsState = computed(() => {
        return tabStore.getTabsState;
      });
      // 添加固定tab
      addAffixTabs();
      // 添加tab
      watch(
        () => unref(root.$route),
        (route) => {
          activeKeyRef.value = route.path;
          tabStore.commitAddTab(route);
        },
        {
          immediate: true,
        }
      );
      // 渲染tab列表
      function renderTabs() {
        return unref(getTabsState).map((item: TabItem) => {
          return (
            <Tabs.TabPane key={item.path} closable={!(item && item.meta && item.meta.affix)}>
              <TabContent tabItem={item} slot="tab" />
            </Tabs.TabPane>
          );
        });
      }
      // tab切换
      function handleChange(activeKey: pageEnum) {
        activeKeyRef.value = activeKey;
        useGo({ path: activeKey, replace: false, router: root.$router });
      }
      // 关闭当前ab
      function handleEdit(targetKey: string) {
        // 新增操作隐藏，目前只使用删除操作
        const index = unref(getTabsState).findIndex((item) => item.path === targetKey);
        index !== -1 && closeTab(unref(getTabsState)[index]);
      }

      function renderQuick() {
        const tabContentProps: TabContentProps = {
          tabItem: root.$route,
          type: TabContentEnum.EXTRA_TYPE,
          trigger: ['click', 'contextmenu'],
        };
        return (
          <span slot="tabBarExtraContent">
            <TabContent props={tabContentProps} />
          </span>
        );
      }
      return () => {
        const { multiTabsSetting: { showQuick } = {} } = projectSetting;
        return (
          <div class={prefixCls}>
            <Tabs
              type="editable-card"
              size="small"
              hideAdd={true}
              tabBarGutter={3}
              activeKey={unref(activeKeyRef)}
              onChange={handleChange}
              onEdit={handleEdit}
            >
              {renderTabs()}
              {showQuick && renderQuick()}
            </Tabs>
          </div>
        );
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';
  @prefix-cls: ~'@{namespace}-multi-tabs';

  .@{prefix-cls} {
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    // 重置tab样式
    /deep/.ant-tabs.ant-tabs-card {
      .ant-tabs-card-bar {
        height: 40px;
        margin: 0;
        background: #fff;
        border: 0;
        box-shadow: 0 4px 26px 1px rgba(0, 0, 0, 0.08);

        .ant-tabs-nav-container {
          padding-top: 2px;
        }

        .ant-tabs-tab {
          // height: 38px;
          font-size: 14px;
          color: @text-color-call-out;
          background: #fff;
          border: 1px solid @border-color-shallow-dark;
          border-radius: 4px 4px 0 0;

          .ant-tabs-close-x {
            color: inherit;
          }

          svg {
            fill: @text-color-base;
          }

          &::before {
            position: absolute;
            top: -2px;
            right: 0;
            left: 0;
            height: 4px;
            background-color: @primary-color;
            border-radius: 16px 6px 0 0;
            content: '';
            transform: scaleX(0);
            transform-origin: bottom right;
          }

          &:hover::before {
            transform: scaleX(1);
            transition: transform 0.4s ease;
            transform-origin: bottom left;
          }

          // &:hover {
          //   background: #f6f6f6;
          // }
        }

        .ant-tabs-tab-active {
          color: #fff;
          // color: @primary-color;
          // background: #f6f6f6;
          background: @primary-color;
          border: 0;

          &::before {
            display: none;
            // transform: scaleX(1);
            // transition: transform 0.5s ease;
            // transform-origin: bottom left;
          }

          svg {
            fill: @white;
          }
        }
      }

      .ant-tabs-nav > div:nth-child(1) {
        padding: 0 10px;
      }

      .ant-tabs-tab-prev,
      .ant-tabs-tab-next {
        color: @border-color-dark;
        background: #fff;
      }
    }

    // /deep/ .ant-dropdown-trigger {
    //   display: inline-block;
    //   width: 64px;
    //   text-align: center;
    //   box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    // }
    /deep/ .ant-tabs-tab:not(.ant-tabs-tab-active) {
      .anticon-close {
        display: none;
        transition: all 0.3s;
      }

      &:hover {
        .anticon-close {
          display: inline-block;
          color: #fff;
        }
      }
    }
  }
</style>
