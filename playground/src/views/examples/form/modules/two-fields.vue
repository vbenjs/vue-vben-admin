<script lang="ts" setup>
import { Input, Select } from 'antdv-next';

type ModelValue = [string | undefined, string | undefined];

const emit = defineEmits<{
  blur: [];
  change: [value: ModelValue];
}>();

const modelValue = defineModel<ModelValue>({
  default: () => [undefined, undefined],
});

function updateModelValue(index: 0 | 1, value: string | undefined) {
  const nextValue: ModelValue = [...modelValue.value];
  nextValue[index] = value;
  modelValue.value = nextValue;
  emit('change', nextValue);
}

function updateType(value: unknown) {
  if (value === null || value === undefined) {
    updateModelValue(0, undefined);
    return;
  }
  if (typeof value === 'string') {
    updateModelValue(0, value);
  }
}
</script>
<template>
  <div class="flex w-full gap-1">
    <Select
      :value="modelValue[0]"
      class="w-20"
      placeholder="类型"
      allow-clear
      :class="{ 'valid-success': !!modelValue[0] }"
      :options="[
        { label: '个人', value: 'personal' },
        { label: '工作', value: 'work' },
        { label: '私密', value: 'private' },
      ]"
      @blur="emit('blur')"
      @update:value="updateType"
    />
    <Input
      placeholder="请输入11位手机号码"
      class="flex-1"
      allow-clear
      :class="{ 'valid-success': modelValue[1]?.match(/^1[3-9]\d{9}$/) }"
      :value="modelValue[1]"
      :maxlength="11"
      type="tel"
      @blur="emit('blur')"
      @update:value="updateModelValue(1, $event)"
    />
  </div>
</template>
