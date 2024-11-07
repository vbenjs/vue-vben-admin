<script lang="ts" setup>
import { ref } from 'vue';

import { IconPicker } from '@vben/common-ui';
import { listIcons } from '@vben/icons';

import { Input } from 'ant-design-vue';

import iconsData from './icons.data';

export interface Props {
  allowClear?: boolean;
  pageSize?: number;
  /**
   * 可以通过prefix获取系统中使用的图标集
   */
  prefix?: string;
  readonly?: boolean;
  value?: string;
  width?: string;
}

// Don't inherit FormItem disabled、placeholder...
defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  allowClear: true,
  pageSize: 36,
  prefix: '',
  readonly: false,
  value: '',
  width: '100%',
});

const refIconPicker = ref();
const currentSelect = ref('');

function getIcons() {
  if (props.prefix) {
    return listIcons('', props.prefix);
  } else {
    const prefix = iconsData.prefix;
    return iconsData.icons.map((icon) => `${prefix}:${icon}`);
  }
}

const currentList = ref(getIcons());

const triggerPopover = () => {
  if (refIconPicker.value) {
    refIconPicker.value.changeOpenState();
  }
};

const handleChange = (icon: string) => {
  currentSelect.value = icon;
};
</script>

<template>
  <Input
    v-model:value="currentSelect"
    :allow-clear="props.allowClear"
    :readonly="props.readonly"
    :style="{ width }"
    class="cursor-pointer"
    placeholder="点击选中图标"
    @click="triggerPopover"
  >
    <template #addonAfter>
      <IconPicker
        ref="refIconPicker"
        :icons="currentList"
        :page-size="pageSize"
        :value="currentSelect"
        @change="handleChange"
      />
    </template>
  </Input>
</template>
