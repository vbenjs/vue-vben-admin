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
        @click="() => handleTo(item.to)"
      >
        <div class="pt-4 pb-2 flex justify-around items-start">
          <div>
            <Icon :icon="item.icon" :size="58" />
          </div>
          <div>
            <div>{{ item.title }}</div>
            <div>
              <CountTo
                v-if="isNumber(item.value)"
                :startVal="0"
                :endVal="item.value"
                class="text-2xl"
              />
              <div v-else class="text-2xl">{{ item.value }}</div>
              <span class="ml-1">{{ item.unit }}</span>
            </div>
            <div class="" v-if="item.value2">
              <span class="text-2xl">{{ '(' }}</span>
              <CountTo
                class="text-2xl"
                v-if="isNumber(item.value2)"
                :startVal="0"
                :endVal="item.value2"
              />
              <div class="text-2xl" v-else>{{ item.value2 }}</div>
              <span class="text-2xl">{{ ')' }}</span>
              <span class="ml-1">{{ item.unit2 }}</span>
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
  import { getStoreSummary } from '@/api/home';
  import { isNumber } from 'lodash-es';
  import { useGo } from '@/hooks/web/usePage';

  const loading = ref(true);
  const growCardList = ref<GrowCardItem[]>([]);

  const go = useGo();
  onMountedOrActivated(() => {
    loadData();
  });
  const loadData = async () => {
    loading.value = true;

    const data = await getStoreSummary();

    growCardList.value = [
      {
        title: '库存托数',
        icon: 'home-pallet|svg',
        value: data.palletCount,
        to: '/warehouse/pallet_code',
      },
      {
        title: '库存箱数',
        icon: 'home-case|svg',
        value: data.boxCount,
        to: '/warehouse/case_code',
      },
      {
        title: '库存盒(片)数',
        icon: 'home-box|svg',
        value: data.packageCount,
        to: '/warehouse/box_code',
        value2: data.pieceCount,
      },
      {
        title: '今日入库',
        icon: 'home-in-out|svg',
        value: data.dayInPiece,
        to: '/warehouse/inbound',
      },
      {
        title: '待入库片数',
        icon: 'home-wait-in|svg',
        value: data.dayPendingPiece,
        to: '/warehouse/inbound',
      },
      {
        title: '出库片数',
        icon: 'home-wait-out|svg',
        value: data.dayOutPiece,
        to: '/warehouse/outbound',
      },
    ];
    loading.value = false;
  };

  const handleTo = (path: string) => {
    if (path) {
      go(path);
    }
  };
</script>
