<!-- eslint-disable prettier/prettier -->
<template>
  <Card :bordered="false">
    <template v-if="chartData">
      <div class="mb-4">
        <div v-if="isShowAvg">
          <div class="avg-value">
            <div class="avg-value-name">{{ '平均' + attributeName }}</div>
            <div class="avg-value-value">
              <span>{{ formatValue(attributeType, chartData.avgValue) }}</span>
              <span class="value-unit">{{ attributeUnit }}</span>
            </div>
          </div>
          <div class="max-min-value">
            <div class="max-value">
              <div class="max-value-name">{{ '最高' + attributeName }}</div>
              <div class="max-value-value">
                <span>{{ formatValue(attributeType, chartData.maxValue) }}</span>
                <span class="value-unit">{{ attributeUnit }}</span>
              </div>
            </div>
            <div class="min-value">
              <div class="min-value-name">{{ '最低' + attributeName }}</div>
              <div class="min-value-value">
                <span>{{ formatValue(attributeType, chartData.minValue) }}</span>
                <span class="value-unit">{{ attributeUnit }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="isShowTotal">
          <div class="avg-value">
            <div class="avg-value-name">{{ '累计' + attributeName }}</div>
            <div class="avg-value-value">
              <span>{{ formatValue(attributeType, chartData.totalValue) }}</span>
              <span class="value-unit">{{ attributeUnit }}</span>
            </div>
          </div>
        </div>
      </div>

      <div ref="chartRef" class="w-230 h-85"></div>
    </template>
    <Empty
      class="!mt-30"
      v-else
      :image="emptyImg"
      :image-style="{
        display: 'flex',
        justifyContent: 'center',
      }"
      description="暂无数据"
    />

    <div class="tips" v-if="!!getTips">提示：{{ getTips }}</div>
  </Card>
</template>
<script lang="ts" setup>
  import { computed, ref, Ref, watch } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { Card, Empty } from 'ant-design-vue';
  import { getEquipmentDeta } from '@/api/equipment';
  import { cloneDeep } from 'lodash-es';
  import { EquipmentAttributeResult, EquipmentData } from '@/api/model/equipmentModel';
  import { attributeUnitMap } from '@/enums/attributeType';
  import emptyImg from '@/assets/icons/zxt.svg?inline';
  import { useEnumStore } from '@/store/modules/enum';

  const chartRef = ref<HTMLDivElement | null>(null);
  const chartData = ref<EquipmentData>();

  const enumStore = useEnumStore();

  const props = defineProps({
    attributes: {
      type: Array as PropType<EquipmentAttributeResult[]>,
      default: () => [],
    },
    selectAttr: {
      type: [Number, String],
    },
    date: {
      type: String,
    },
    equipmentIds: {
      type: Array as PropType<number[]>,
      required: true,
    },
    attributeType: {
      type: String as PropType<string>,
    },
  });

  const attributeType = computed<string>(() => {
    if (props.selectAttr === 'total') return 'ELECTRIC';
    return (
      props.attributes.find((item) => item.id === props.selectAttr)?.attributeType ??
      props.attributeType ??
      'WORKING_HOURS'
    );
  });

  const attributeName = computed(() => {
    if (props.selectAttr === 'total') return '总能耗';
    return enumStore.attributeTypeMap.get(attributeType.value);
  });

  const attributeUnit = computed(() => {
    return attributeType.value ? attributeUnitMap.get(attributeType.value) : undefined;
  });

  const color = computed(() => {
    return enumStore.attributeColorMap.get(attributeType.value);
  });

  const isShowAvg = computed(() => {
    return (
      attributeType.value === 'HUMIDITY' ||
      attributeType.value === 'TEMPERATURE' ||
      attributeType.value === 'LUX' ||
      attributeType.value === 'CO2' ||
      attributeType.value === 'HCHO' ||
      attributeType.value === 'PM25'
    );
  });

  const isShowTotal = computed(() => {
    return attributeType.value === 'ELECTRIC' || attributeType.value === 'WORKING_HOURS';
  });

  const getTips = computed(() => {
    if (attributeType.value === 'HCHO') return '国家标准密闭建筑物内小于0.08mg/m³';
    if (attributeType.value === 'CO2') return '室内二氧化碳浓度一般在500到700 PPM左右';
    if (attributeType.value === 'PM25') return 'pm2.5的值小于35，空气质量优';
    return '';
  });

  const formatValue = (attributeType?: string, value?: number) => {
    if (!value) return value;
    switch (attributeType) {
      case 'WORKING_HOURS':
        return (value / 3600).toFixed(2);
      case 'HCHO':
        return ((value * 1.339) / 1000).toFixed(3);
      default:
        return value;
    }
  };

  const setChartOptions = async (
    attributes: EquipmentAttributeResult[],
    value: number | string,
    date: string,
  ) => {
    const xAxisData: string[] = [];
    const values: (number | string)[] = [];

    const attributeIds =
      value === 'total'
        ? attributes.filter((item) => item.attributeType === 'ELECTRIC').map((item) => item.id)
        : [value];

    const result = await getEquipmentDeta({
      dataDay: `${date} - ${date}`,
      attributeType: props.attributeType,
      attributeIds: !props.attributeType ? attributeIds : undefined,
      equipmentIds: props.equipmentIds,
    });

    if (result?.length) {
      let data = cloneDeep(result[0]);
      if (value === 'total') {
        data.equipmentName = '总能耗';
        data.id = 'total' as any;
        data.totalValue = 0;
        new Array(24).fill(0).forEach((_, index) => {
          const valueKey = `value${index}`;
          let value = 0;
          result.forEach((item) => {
            value += item[valueKey] ?? 0;
          });
          data[valueKey] = value;
        });
        result.forEach((item) => {
          data.totalValue += item.totalValue ?? 0;
        });
        data.totalValue = Number(data.totalValue.toFixed(4));
      }
      chartData.value = data;

      [...new Array(24)].forEach((_, index) => {
        xAxisData.push(index + '');
        const valueKey = `value${index}`;
        const value = formatValue(attributeType.value, data[valueKey]);
        values.push(value ? Number(value) : '');
      });
    } else {
      chartData.value = undefined;
    }
    const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

    setOptions(
      {
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '10%',
          containLabel: true,
        },
        toolbox: {
          feature: {
            // saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxisData,
        },
        yAxis: [
          {
            type: 'value',
            splitNumber: 4,
            axisTick: {
              show: false,
            },
            name: `单位（${attributeUnit.value}）`,
            nameTextStyle: {
              color: '#aaa',
            },
          },
        ],
        series: [
          {
            name: '',
            type: 'line',
            data: values,
            itemStyle: {
              color: color.value,
            },
          },
        ],
      },
      true,
    );
  };

  watch(
    [() => props.attributes, () => props.selectAttr, () => props.date],
    ([options, value, date]) => {
      if (!value) return;
      if (!date) return;
      setChartOptions(options, value, date);
    },
    { immediate: true },
  );
</script>
<style lang="less" scoped>
  .avg-value {
    margin-top: 12px;
  }

  .avg-value-name {
    color: #acacac;
    font-family: PingFangSC-Regular, 'PingFang SC';
    font-size: 14px;
  }

  .avg-value-value {
    width: 100px;
    height: 37px;
    color: #212121;
    font-family: DINAlternate-Bold, DINAlternate;
    font-size: 32px;
    font-weight: bold;
  }

  .max-value,
  .min-value {
    flex: 1;
  }

  .max-min-value {
    display: flex;
    margin-top: 8px;
  }

  .max-value-name,
  .min-value-name {
    color: #acacac;
    font-family: PingFangSC-Regular, 'PingFang SC';
    font-size: 12px;
  }

  .max-value-value,
  .min-value-value {
    color: #212121;
    font-family: DINAlternate-Bold, DINAlternate;
    font-size: 20px;
    font-weight: bold;
  }

  .value-unit {
    margin: 4px;
    color: #9e9e9e;
    font-size: 14px;
  }

  .tips {
    margin-top: 12px;
    color: #aaa;
    font-size: 12px;
  }
</style>
