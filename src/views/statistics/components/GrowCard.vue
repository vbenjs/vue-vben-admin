<template>
  <div class="lg:flex">
    <template v-for="(item, index) in growCardList" :key="item.title">
      <Card
        size="small"
        :loading="loading"
        class="lg:w-1/4 w-full !lg:mt-0"
        :class="{
          '!md:mr-4': index + 1 < 4,
          '!mt-4': index > 0,
          'enter-x': true,
        }"
        :title="item.title"
      >
        <div class="py-4 px-4 flex justify-around items-center">
          <div>
            <CountTo :startVal="0" :endVal="Number(item.value)" class="text-2xl" />
            <span class="ml-1">{{ item.unit }}</span>
          </div>
        </div>
      </Card>
    </template>
  </div>
</template>
<script lang="ts" setup>
  import { CountTo } from '@/components/CountTo/index';
  import { Card } from 'ant-design-vue';
  import { onMountedOrActivated } from '@vben/hooks';
  import { ref } from 'vue';

  const loading = ref(true);
  const growCardList = ref<any[]>([]);
  onMountedOrActivated(() => {
    loadData();
  });

  const props = defineProps({
    type: {
      type: String,
      default: '入库',
    },
  });

  const loadData = async () => {
    loading.value = true;

    growCardList.value = [
      {
        title: `今日已完成${props.type}单`,
        icon: 'home-pallet|svg',
        value: Math.floor(Math.random() * 1000),
      },
      {
        title: `今日已完成${props.type}数量`,
        icon: 'home-case|svg',
        value: Math.floor(Math.random() * 1000),
      },
      {
        title: `待${props.type}单`,
        icon: 'home-box|svg',
        value: Math.floor(Math.random() * 1000),
      },
      {
        title: `待${props.type}数量`,
        icon: 'home-in-out|svg',
        value: Math.floor(Math.random() * 1000),
      },
    ];
    loading.value = false;
  };
</script>
