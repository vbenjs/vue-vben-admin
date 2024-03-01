<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    :width="600"
    destroyOnClose
    :maskClosable="true"
  >
    <div v-if="pageData" class="m-[-16px] relative">
      <div class="flex justify-between p-4">
        <div class="text-lg font-medium color-[#000000D9]">
          <span>
            {{ pageData.equipmentName }}
          </span>
        </div>
        <div class="color-[#A5AAB0]"> 告警时间：{{ formatToDateTime(pageData.remindTime) }} </div>
      </div>
      <Descriptions class="px-4" :column="1">
        <Descriptions.Item label="设备类型">
          {{ equipmentTypeMap.get(pageData.equipmentType) }}
        </Descriptions.Item>
        <Descriptions.Item label="属性">
          {{ enumStore.attributeTypeMap.get(pageData.attributeType) }}
        </Descriptions.Item>
      </Descriptions>
      <div class="px-4 pb-4">
        <Tag :color="alarmLevelColorMap.get(pageData.alarmLevel)">
          {{ alarmLevelMap.get(pageData.alarmLevel) }}
        </Tag>
        <span>{{ pageData.remindMsg.split(':').pop() }}</span>
      </div>
      <div class="bg-[#F2F4F6] h-12px"></div>
      <div class="p-4">
        <Descriptions title="地点详情" :column="2">
          <Descriptions.Item label="省">{{ pageData.store.province }}</Descriptions.Item>
          <Descriptions.Item label="市">{{ pageData.store.city }}</Descriptions.Item>
          <Descriptions.Item label="详细地址">{{ pageData.store.address }}</Descriptions.Item>
          <Descriptions.Item label="联系人">{{ pageData.store.people }}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{{ pageData.store.phone }}</Descriptions.Item>
        </Descriptions>
        <Divider />

        <Descriptions title="告警条件" :column="2">
          <Descriptions.Item label="监控时间" :span="2">
            {{ `在${pageData.timeRange}之${pageData.inRange === 'Y' ? '间' : '外'}` }}
          </Descriptions.Item>
          <Descriptions.Item label="统计方式">
            {{ enumStore.statTypeMap.get(pageData.statType) }}
          </Descriptions.Item>
          <Descriptions.Item label="条件类型">
            {{ enumStore.conditionTypeMap.get(pageData.conditionType) }}
          </Descriptions.Item>
          <Descriptions.Item label="条件阈值">
            {{ pageData.conditionValue + pageData.attributeUnit }}
          </Descriptions.Item>
          <Descriptions.Item label="当前值">
            {{ pageData.currentValue + pageData.attributeUnit }}
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        <Descriptions title="原因" :column="1">
          <Descriptions.Item label="">{{ pageData.reason }}</Descriptions.Item>
        </Descriptions>
        <Divider />
        <Descriptions title="发送对象" />
        <List
          item-layout="horizontal"
          :data-source="[
            {
              account: pageData.remindAccount,
              createTime: pageData.remindTime,
              readTime: pageData.readTime,
            },
            ...(pageData.ccList ?? []),
          ]"
        >
          <template #renderItem="{ item }">
            <List.Item>
              <List.Item.Meta>
                <template #title>
                  <div class="flex justify-between">
                    <span>{{ item.account?.name ?? item.account?.username }}</span>
                    <span class="mx-6 text-[#00000073]">
                      {{ formatToDateTime(item.createTime) }}
                    </span>
                  </div>
                </template>
                <template #avatar>
                  <img :src="headerImg" width="30" />
                </template>
                <template #description>
                  <span v-if="item.account?.name" class="mr-3">
                    用户名：{{ item.account.username }}
                  </span>
                  <span v-if="item.account?.phone" class="mr-3">
                    手机号：{{ item.account.phone }}
                  </span>
                  <span v-if="item.account?.email" class="mr-3">
                    邮箱：<a :href="`mailto:${item.account.email}`">{{ item.account.email }}</a>
                  </span>
                </template>
              </List.Item.Meta>
              <BasicHelp v-if="item.readTime" :text="formatToDateTime(item.readTime)">
                <YNTag text="Y" true-label="已读" />
              </BasicHelp>
              <YNTag v-else text="N" false-label="未读" />
            </List.Item>
          </template>
        </List>
      </div>

      <!-- 图片 -->
      <div class="picture" v-if="pageData.handleStatus !== 'Y'">
        <img :src="untreated" width="80" height="65" />
      </div>
      <div class="picture" v-else>
        <img :src="processed" width="80" height="65" />
      </div>
    </div>
  </BasicDrawer>
</template>
<script lang="tsx" setup>
  import { ref, computed } from 'vue';
  import { useDrawerInner, BasicDrawer } from '@/components/Drawer';
  import { Descriptions, Divider, Tag, List } from 'ant-design-vue';
  import { equipmentTypeMap } from '@/enums/equipmentType';
  import { formatToDateTime } from '@/utils/dateUtil';
  import { alarmLevelColorMap, alarmLevelMap } from '@/enums/alarmLevel';
  import { isFunction } from '@/utils/is';
  import { RemindRecordResult } from '@/api/remind/model/recordModel';
  import { BasicHelp } from '@/components/Basic';
  import { YNTag } from '@/components/Tag';

  import untreated from '@/assets/images/untreated.png';
  import processed from '@/assets/images/processed.png';
  import headerImg from '@/assets/images/header.svg';
  import { useEnumStore } from '@/store/modules/enum';

  defineEmits(['success', 'register']);
  const pageData = ref<RemindRecordResult>();
  const modalTitle = '告警记录';
  const getTitle = computed(() => {
    return '查看' + modalTitle;
  });
  const enumStore = useEnumStore();
  const [registerDrawer, { changeLoading }] = useDrawerInner(async ({ id, api }) => {
    if (api && isFunction(api)) {
      try {
        changeLoading(true);
        const value = await api(id);
        pageData.value = value;
      } finally {
        changeLoading(false);
      }
    }
  });
</script>
<style scoped>
  .picture {
    position: absolute;
    top: 80px;
    right: 30px;
  }
</style>
