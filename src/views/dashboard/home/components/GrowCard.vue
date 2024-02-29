<template>
  <div class="lg:flex">
    <template v-for="(item, index) in growCardList" :key="item.title">
      <Card
        size="small"
        :loading="loading"
        class="lg:w-1/6 w-full !lg:mt-0"
        :class="{
          '!md:mr-4': index + 1 < 6,
          '!mt-4': index > 0,
          'enter-x': true,
        }"
      >
        <div class="py-4 px-4 flex justify-around items-center">
          <Icon :icon="item.icon" :size="58" />
          <div>
            <div>{{ item.title }}</div>
            <div>
              <CountTo :startVal="0" :endVal="Number(item.value)" class="text-2xl" />
              <span class="ml-1">{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </Card>
    </template>
  </div>
</template>
<script lang="ts" setup>
  import { CountTo } from '@/components/CountTo/index';
  import Icon from '@/components/Icon/Icon.vue';
  import { Card } from 'ant-design-vue';
  import { GrowCardItem } from '../data';
  import { onMountedOrActivated } from '@vben/hooks';
  import { ref } from 'vue';
  import { getHomeCount } from '@/api/home';

  const loading = ref(true);
  const growCardList = ref<GrowCardItem[]>([]);
  onMountedOrActivated(() => {
    loadData();
  });
  const loadData = async () => {
    loading.value = true;
    const data = await getHomeCount();

    growCardList.value = [
      {
        title: '地点总量',
        icon: 'home-store|svg',
        value: data.storeCount,
      },
      {
        title: '网关总量',
        icon: 'home-gateway|svg',
        value: data.gatewayCount,
      },
      {
        title: '传感器总量',
        icon: 'home-sensor|svg',
        value: data.sensorCount,
      },
      {
        title: '设备总量',
        icon: 'home-device|svg',
        value: data.equipmentCount,
      },
      {
        title: '告警总量',
        icon: 'home-warn|svg',
        value: data.totalRemindCount,
      },
      {
        title: '今日告警数',
        icon: 'home-alarm|svg',
        value: data.dayRemindCount,
      },
    ];
    loading.value = false;
  };
</script>
