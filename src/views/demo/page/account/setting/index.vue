<template>
  <ScrollContainer>
    <div ref="wrapperRef" class="m-4 account">
      <Tabs tab-position="left" :tabBarStyle="tabBarStyle">
        <template v-for="item in settingList" :key="item.key">
          <TabPane :tab="item.name">
            <component :is="item.component" />
          </TabPane>
        </template>
      </Tabs>
    </div>
  </ScrollContainer>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Tabs } from 'ant-design-vue';

  import { ScrollContainer } from '/@/components/Container/index';
  import { settingList } from './data';

  import BaseSetting from './BaseSetting.vue';
  import SecureSetting from './SecureSetting.vue';
  import AccountBind from './AccountBind.vue';
  import MsgNotify from './MsgNotify.vue';

  export default defineComponent({
    components: {
      ScrollContainer,
      Tabs,
      TabPane: Tabs.TabPane,
      BaseSetting,
      SecureSetting,
      AccountBind,
      MsgNotify,
    },
    setup() {
      return {
        settingList,
        tabBarStyle: {
          width: '220px',
        },
      };
    },
  });
</script>
<style lang="less" scoped>
  .account {
    background: #fff;

    /deep/ .base-title {
      padding-left: 0;
    }

    /deep/ .ant-tabs {
      padding: 16px 0;
    }

    /deep/ .ant-tabs-tab-active {
      background-color: #e6f7ff;
    }
  }
</style>
