<script lang="ts" setup>
import { Select as ASelect, Tag } from 'ant-design-vue';

import { countries } from '#/constants';

const emit = defineEmits(['change']);

const modelValue = defineModel<string[]>({
  default: () => [],
});

function onChange() {
  emit('change', modelValue.value);
}
</script>
<template>
  <div class="">
    <ASelect
      v-model:value="modelValue"
      @change="onChange"
      mode="multiple"
      style="width: 100%"
      placeholder="select one country"
      :options="countries"
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
