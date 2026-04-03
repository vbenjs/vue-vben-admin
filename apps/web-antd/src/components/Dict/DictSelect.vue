<!-- DictSelect.vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { message, Select } from 'ant-design-vue';

import { requestClient } from '#/api/request';

// 定义 Props
const props = defineProps({
  dictType: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number, Array],
    default: undefined,
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:value', 'change']);

const dictOptions = ref<Array<{ class: string; label: string; value: string }>>(
  [],
);
const isLoading = ref(false);

const fetchDictData = async (type: string) => {
  isLoading.value = true;
  try {
    const data = await requestClient.get(`/sys/dict/data/type/${type}`);
    dictOptions.value = (data || []).map((item: any) => ({
      label: item.dictLabel,
      value: item.dictValue,
      class: item.listClass,
    }));
  } catch {
    message.error('获取字典数据失败');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (props.dictType) {
    fetchDictData(props.dictType);
  }
});

const innerValue = computed<any>({
  get: () => props.value,
  set: (val: any) => {
    emit('update:value', val);
    emit('change', val);
  },
});
</script>

<template>
  <Select
    v-model:value="innerValue"
    :disabled="disabled"
    :loading="isLoading"
    :options="dictOptions"
    :placeholder="placeholder"
    allow-clear
    class="w-full"
  />
</template>
