<!-- DictTag.vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Tag } from 'ant-design-vue'; // Assuming antd implementation

const props = defineProps({
  dictType: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
});

const dictOptions = ref<Array<{ label: string; value: string; class: string }>>([]);
const isLoading = ref(false);

const fetchDictData = async (type: string) => {
  isLoading.value = true;
  try {
    const response = await fetch(`http://localhost:5555/api/sys/dict/data/type/${type}`);
    const res = await response.json();
    if (res.code === 0) {
      dictOptions.value = res.data.map((item: any) => ({
        label: item.dictLabel,
        value: item.dictValue,
        class: item.listClass,
      }));
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (props.dictType) {
    fetchDictData(props.dictType);
  }
});

const matchedOption = computed(() => {
  const strValue = String(props.value);
  return dictOptions.value.find((item) => item.value === strValue);
});
</script>

<template>
  <span v-if="isLoading" class="text-gray-400 text-sm">...</span>
  <Tag v-else-if="matchedOption" :color="matchedOption.class">
    {{ matchedOption.label }}
  </Tag>
  <span v-else>{{ value }}</span>
</template>
