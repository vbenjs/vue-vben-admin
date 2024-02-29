<template>
  <div class="sensor-card-value">
    <div class="sensor-card-tags">
      <Tag v-if="data?.ampere" color="#FCB159">
        {{ formatAmpere(data.ampere) }}
      </Tag>
      <Tag v-if="data?.t" color="#FA676F">
        {{ formatTemp(data.t) }}
      </Tag>
      <Tag v-if="data?.h" color="#5C8AF4">
        {{ formatHumidity(data.h) }}
      </Tag>
      <Tag v-if="data?.lux" color="#F4C75F">
        {{ formatLux(data.lux) }}
      </Tag>
      <Tag v-if="data?.co2" color="#9D9DA0">
        {{ formatCo2(data.co2) }}
      </Tag>
      <Tag v-if="data?.pm25" color="#B571CE">
        {{ formatPm25(data.pm25) }}
      </Tag>
      <Tag v-if="data?.hcho" color="#3390F0">
        {{ formatHcho(data.hcho) }}
      </Tag>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Tag } from 'ant-design-vue';
  import { ref, watch } from 'vue';

  const data = ref<any>();
  const props = defineProps({
    // 传入的数据
    data: {
      type: String,
      default: '',
    },
  });

  watch(
    () => props.data,
    (val) => {
      data.value = JSON.parse(val);
    },
    { immediate: true },
  );

  const formatAmpere = (val: number) => {
    return `平均电流：${val} A`;
  };

  const formatTemp = (val: number) => {
    return `温度：${val} ℃`;
  };

  const formatHumidity = (val: number) => {
    return `湿度：${val} %`;
  };

  const formatLux = (val: number) => {
    return `光照：${val} lux`;
  };

  const formatCo2 = (val: number) => {
    return `二氧化碳：${val} ppm`;
  };

  const formatPm25 = (val: number) => {
    return `PM2.5：${val} ug/m³`;
  };

  const formatHcho = (val: number) => {
    return `甲醛：${((val * 1.339) / 1000).toFixed(4)} mg/m³`;
  };
</script>
