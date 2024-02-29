<template>
  <div class="p-4">
    <div class="mb-4 flex">
      <YearPicker v-model="year" />
      <span class="ml-4">
        <span> 地点：</span>
        <ApiSelect
          class="w-50"
          :api="getStore"
          :immediate="true"
          :filterOption="false"
          showSearch
          labelField="name"
          valueField="id"
          searchField="storeInfo"
          :formatter="formatter"
          autoSelectFirst
          v-model:value="storeId"
          @options-change="hanldeChangeOptions"
        />
      </span>
    </div>
    <div class="w-full enter-y">
      <div class="mb-4 lg:flex">
        <StoreYearPower
          class="mb-4 lg:mb-0 lg:w-1/2 lg:mr-4"
          :height="height"
          :storeId="storeId"
          :year="Number(year) - 1"
        />
        <StoreYearPower class="lg:w-1/2" :height="height" :storeId="storeId" :year="year" />
      </div>
      <StoreYoy :height="height" :storeId="storeId" :year="year" />
    </div>
  </div>
</template>
<script lang="ts" setup name="StoreYoy">
  import StoreYearPower from './components/StoreYearPower.vue';
  import StoreYoy from './components/StoreYoy.vue';
  import { YearPicker } from '@/components/DatePicker';
  import { ref } from 'vue';
  import { getStore } from '@/api/store';
  import { useFormat } from '@/utils/format';
  import { ApiSelect } from '@/components/Form';
  import { onMountedOrActivated } from '@vben/hooks';

  const { formatStore } = useFormat();
  const formatter = (item: any) => formatStore(item, '()');

  const height = ref('280px');
  const year = ref('');
  const storeId = ref<number>();

  const hanldeChangeOptions = (array: any[]) => {
    if (!storeId.value) storeId.value = array[0].id;
  };

  onMountedOrActivated(async () => {
    window.dispatchEvent(new Event('resize'));
  });
</script>
