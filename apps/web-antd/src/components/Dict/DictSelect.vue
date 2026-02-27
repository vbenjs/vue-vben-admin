<!-- DictSelect.vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Select } from 'ant-design-vue'; // Assuming antd as primary, adjust based on generic ui-kit wrapper
import { useMessage } from '@vben/hooks';

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
  }
});

const emit = defineEmits(['update:value', 'change']);

const dictOptions = ref<Array<{ label: string; value: string; class: string }>>([]);
const isLoading = ref(false);
const { createMessage } = useMessage();

// 模拟的 API 请求 (应替换为从 src/api/sys/dict 引入的真实请求接口)
const fetchDictData = async (type: string) => {
  // 生产环境中，这里应该加上本地 SessionStorage 级别的缓存，避免同一页面发送 N 个相同的 dictType 查询
  isLoading.value = true;
  try {
    // 从全新的本地 NestJS 后端系统拉取业务数据
    const response = await fetch(`http://localhost:5555/api/sys/dict/data/type/${type}`);
    const res = await response.json();
    if (res.code === 0) {
      dictOptions.value = res.data.map((item: any) => ({
        label: item.dictLabel,
        value: item.dictValue,
        class: item.listClass,
      }));
    }
  } catch (error) {
    createMessage.error('获取字典数据失败');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (props.dictType) {
    fetchDictData(props.dictType);
  }
});

const innerValue = computed({
  get: () => props.value,
  set: (val) => {
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
