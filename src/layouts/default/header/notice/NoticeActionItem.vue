<template>
  <div class="layout-header__action-item notify-action">
    <Popover title="" trigger="click">
      <Badge :count="count" dot :numberStyle="numberStyle">
        <BellOutlined class="layout-header__action-icon" />
      </Badge>
      <template #content>
        <Tabs>
          <template v-for="item in tabListData" :key="item.key">
            <TabPane>
              <template #tab>
                {{ item.name }}
                <span v-if="item.list.length !== 0">({{ item.list.length }})</span>
              </template>
              <NoticeList :list="item.list" />
            </TabPane>
          </template>
        </Tabs>
      </template>
    </Popover>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Popover, Tabs, Badge } from 'ant-design-vue';
  import { BellOutlined } from '@ant-design/icons-vue';
  import { tabListData } from './data';
  import NoticeList from './NoticeList.vue';

  export default defineComponent({
    components: { Popover, BellOutlined, Tabs, TabPane: Tabs.TabPane, Badge, NoticeList },
    setup() {
      let count = 0;
      for (let i = 0; i < tabListData.length; i++) {
        count += tabListData[i].list.length;
      }

      return {
        tabListData,
        count,
        numberStyle: {},
      };
    },
  });
</script>
<style lang="less">
  .notify-action {
    padding-top: 2px;

    .ant-tabs-content {
      width: 300px;
    }

    .ant-badge {
      font-size: 18px;

      .ant-badge-multiple-words {
        padding: 0 4px;
        // transform: translate(26%, -40%);
      }

      svg {
        width: 0.9em;
      }
    }
  }
</style>
