<template>
  <div :class="prefixCls">
    <Popover
      title=""
      trigger="click"
      :overlayClassName="`${prefixCls}__overlay`"
      autoAdjustOverflow
      arrowPointAtCenter
      placement="bottomRight"
      v-model:open="open"
    >
      <Badge :count="count" :numberStyle="{}" :offset="[0, 0]">
        <BellOutlined />
      </Badge>
      <template #content>
        <Tabs>
          <TabPane>
            <template #tab>
              {{ '通知' }}
              <span v-if="remindList.length !== 0">({{ remindTotal }})</span>
            </template>
            <!-- 绑定title-click事件的通知列表中标题是“可点击”的-->
            <NoticeList
              :list="remindList"
              v-model:currentPage="remindPage"
              :pageSize="limit"
              :total="remindTotal"
              @title-click="onNoticeClick"
              @action-click="setRead"
            >
              <template #action>
                <Tag class="cursor-pointer">设为已读</Tag>
              </template>
            </NoticeList>
          </TabPane>
        </Tabs>
      </template>
    </Popover>

    <RemindRecordDrawer @register="registerDrawer" />
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref, unref, watch } from 'vue';
  import { Popover, Tabs, Badge, Tag } from 'ant-design-vue';
  import { BellOutlined } from '@ant-design/icons-vue';
  import { ListItem } from './data';
  import NoticeList from './NoticeList.vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { YN } from '@/enums/YN';
  import { readAlarm, getAlarmRemind, getAlarmDetail } from '@/api/system/notification';
  import { alarmLevelColorMap, alarmLevelMap } from '@/enums/alarmLevel';
  import { useDrawer } from '@/components/Drawer';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  const TabPane = Tabs.TabPane;
  const { prefixCls } = useDesign('header-notify');

  const RemindRecordDrawer = createAsyncComponent(
    () => import('@/views/Drawers/RemindRecordDrawer.vue'),
  );

  const [registerDrawer, { openDrawer }] = useDrawer();

  const open = ref(false);
  const limit = ref(5);
  const remindList = ref<ListItem[]>([]);
  const remindPage = ref(1);
  const remindTotal = ref(0);
  const count = computed(() => {
    return remindTotal.value;
  });

  async function setRead(record: ListItem) {
    await readAlarm([record.id]);
    createNotification(unref(remindPage));
  }
  async function onNoticeClick(record: ListItem) {
    open.value = false;
    openDrawer(true, {
      id: record.id,
      api: getAlarmDetail,
    });
    createNotification();
  }
  async function createNotification(page = 1) {
    const { count, data } = await getAlarmRemind({
      page,
      limit: unref(limit),
      readStatus: YN.N,
    });
    remindTotal.value = count;
    remindList.value = data.map((item) => {
      return {
        id: item.id,
        // refId: item.remindId,
        // mainId: item.storeId,
        title: item.remindMsg,
        // description: item.remindMsg,
        datetime: formatToDateTime(item.remindTime),
        extra: alarmLevelMap.get(item.alarmLevel),
        color: alarmLevelColorMap.get(item.alarmLevel),
      };
    });
  }
  // createNotification();
  watch(
    () => remindPage.value,
    (val) => {
      createNotification(val);
    },
    {
      immediate: true,
    },
  );
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-notify';

  .@{prefix-cls} {
    padding-top: 2px;

    &__overlay {
      // max-width: 700px;
      .ant-popover-content {
        width: 25vw;
        min-width: 650px;
      }
    }

    .ant-badge {
      font-size: 18px;

      .ant-badge-count {
        transform: scale(0.8);
        border-radius: 50%;
      }

      .ant-badge-multiple-words {
        padding: 0;
      }

      svg {
        width: 0.9em;
      }
    }
  }
</style>
