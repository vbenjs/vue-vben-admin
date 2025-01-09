<script lang="ts" setup>
import { Input, Select } from 'ant-design-vue';

const emit = defineEmits(['blur', 'change', 'change']);

const modelValue = defineModel<[string, string]>({
  default: ['+85', ''],
});

function onChange() {
  emit('change', modelValue.value);
}
</script>
<template>
  <div class="flex w-full gap-1">
    <Select
      v-model:value="modelValue[0]"
      class="w-[80px]"
      show-search
      placeholder="区码"
      :class="{ 'valid-success': !!modelValue[0] }"
      @blur="emit('blur')"
      @change="onChange"
    >
      <Select.Option value="+82">+82</Select.Option>
      <Select.Option value="+85">+85</Select.Option>
      <Select.Option value="+86">+86</Select.Option>
    </Select>
    <Input
      placeholder="请输入11位手机号码"
      class="flex-1"
      :class="{ 'valid-success': modelValue[1]?.match(/^1[3-9]\d{9}$/) }"
      v-model:value="modelValue[1]"
      :maxlength="11"
      type="tel"
      @blur="emit('blur')"
      @change="onChange"
    />
  </div>
</template>
