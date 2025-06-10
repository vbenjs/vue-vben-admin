<script lang="ts" setup>
import { Select as ASelect, Tag } from 'ant-design-vue';

import { countries } from '#/shared/constants';

const emit = defineEmits(['change']);

const modelValue = defineModel<string[]>({
  default: () => [],
});

function onChange() {
  emit('change', modelValue.value);
}

const filterOption = (input: string, option: any) => {
  return (
    option.label.toLowerCase().includes(input.toLowerCase()) ||
    option.value.toLowerCase().includes(input.toLowerCase())
  );
};
</script>
<template>
  <div>
    <ASelect
      :filter-option="filterOption"
      :options="countries"
      v-model:value="modelValue"
      @change="onChange"
      mode="multiple"
      style="width: 100%"
      placeholder="Select at least one country"
    >
      <template #option="{ value: val, label, icon }">
        <span role="img" :aria-label="val"> {{ icon }} </span>
        &nbsp; {{ label }}
      </template>
      <template #tagRender="{ value: val, label, closable, onClose, option }">
        <Tag :closable="closable" style="margin-right: 3px" @close="onClose">
          {{ label }} &nbsp;
          <span role="img" :aria-label="val">
            {{ option ? option.icon : '' }}
          </span>
        </Tag>
      </template>
    </ASelect>
  </div>
</template>
