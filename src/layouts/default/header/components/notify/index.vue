<template>
  <div :class="prefixCls">
    <Popover title="" trigger="click" :overlayClassName="`${prefixCls}__overlay`">
      <Badge :count="count" dot :numberStyle="numberStyle">
        <BellOutlined />
      </Badge>
      <template #content>
        <Tabs>
          <template v-for="item in listData" :key="item.key">
            <Tabs.TabPane>
              <template #tab>
                {{ item.name }}
                <span v-if="item.list.length !== 0">({{ item.list.length }})</span>
              </template>
              <!-- 绑定title-click事件的通知列表中标题是“可点击”的-->
              <NoticeList :list="item.list" v-if="item.key === '1'" @title-click="onNoticeClick" />
              <NoticeList :list="item.list" v-else />
            </Tabs.TabPane>
          </template>
        </Tabs>
      </template>
    </Popover>
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { Popover, Tabs, Badge } from 'ant-design-vue';
  import { BellOutlined } from '@ant-design/icons-vue';
  import { tabListData, ListItem } from './data';
  import NoticeList from './NoticeList.vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useMessage } from '@/hooks/web/useMessage';

  const { prefixCls } = useDesign('header-notify');
  const { createMessage } = useMessage();
  const listData = ref(tabListData);
  const numberStyle = {};

  const count = computed(() => {
    let count = 0;
    for (let i = 0; i < tabListData.length; i++) {
      count += tabListData[i].list.length;
    }
    return count;
  });

  function onNoticeClick(record: ListItem) {
    createMessage.success('你点击了通知，ID=' + record.id);
    // 可以直接将其标记为已读（为标题添加删除线）,此处演示的代码会切换删除线状态
    record.titleDelete = !record.titleDelete;
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-notify';

  .@{prefix-cls} {
    padding-bottom: 1px;

    &__overlay {
      max-width: 360px;
    }

    .ant-tabs-content {
      width: 300px;
    }

    .ant-badge {
      display: flex;
      align-items: center;
      font-size: 18px;

      .ant-badge-multiple-words {
        padding: 0 4px;
      }

      svg {
        width: 0.9em;
      }
    }
  }
</style>
