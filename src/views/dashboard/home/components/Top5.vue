<template>
  <Card size="small" :title="title">
    <Empty class="!mt-15" v-if="!props.data.length" description="暂无告警" />
    <div :style="{ height, width }" v-else>
      <!-- <div class="text-sm font-bold mb-8">{{ title }}</div> -->
      <div class="">
        <template v-for="(_, index) in array" :key="index">
          <div class="px-8">
            <div class="flex items-center mb-4 w-full">
              <div class="mr-2">
                <div
                  class="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  :class="{
                    'text-black': index >= 3,
                    'bg-gray-200': index >= 3,
                    'text-white': index < 3,
                    'bg-[#0960bd]': index < 3,
                  }"
                >
                  {{ index + 1 }}
                </div>
              </div>
              <div class="w-7/10">
                <div class="truncate flex-1" :title="data[index]?.name">
                  {{ data[index]?.name }}
                </div>
              </div>
              <div class="w-20">
                <div class="text-right">{{ data[index]?.value }}</div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </Card>
</template>
<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { basicProps } from './props';
  import { Card, Empty } from 'ant-design-vue';

  const props = defineProps({
    ...basicProps,
    number: {
      type: Number,
      default: 5,
    },
    title: {
      type: String,
      default: '',
    },
    data: {
      type: Array as PropType<{ name: string; value: string }[]>,
      default: () => [],
    },
  });
  const array = ref<any[]>([]);

  watch(
    () => props.data,
    (value) => {
      array.value = new Array(Math.min(props.number, value.length));
    },
  );
</script>
