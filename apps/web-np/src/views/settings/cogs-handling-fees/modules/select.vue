<script lang="ts" setup>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

import { Button, Divider, Select } from 'ant-design-vue';

import { AntPlus } from '#/icons';
import { useShopSettingStore } from '#/store';

const emit = defineEmits(['blur', 'change']);
const shopSettingStore = useShopSettingStore();
const router = useRouter();

const VNodes = defineComponent({
  props: {
    vnodes: {
      type: Object,
      required: true,
    },
  },
  render() {
    return this.vnodes;
  },
});

const modelValue = defineModel<[string, string]>({
  default: () => 'default',
});

function onChange() {
  emit('change', modelValue.value);
}

function handleNewZone() {
  router.push({
    name: 'settings.shipping-fees',
  });
}
</script>
<template>
  <Select
    v-model:value="modelValue"
    :options="
      shopSettingStore.regions.map((item) => ({
        label: item.name,
        value: item.uuid,
      }))
    "
    @blur="emit('blur')"
    @change="onChange"
  >
    <template #dropdownRender="{ menuNode: menu }">
      <VNodes :vnodes="menu" />
      <Divider class="my-2" />
      <div class="my-2 text-center">
        <Button @click="handleNewZone">
          <template #icon>
            <AntPlus />
          </template>
          New zone
        </Button>
      </div>
    </template>
  </Select>
</template>
