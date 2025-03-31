<script lang="ts" setup>
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui';

interface Props {
  class?: any;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
}

const props = defineProps<Props>();
</script>
<template>
  <Select>
    <SelectTrigger :class="props.class">
      <SelectValue :placeholder="placeholder" />
    </SelectTrigger>
    <SelectContent>
      <template v-for="item in options" :key="item.value">
        <SelectItem :value="item.value"> {{ item.label }} </SelectItem>
      </template>
    </SelectContent>
  </Select>
</template>

<style lang="scss" scoped>
button[role='combobox'][data-placeholder] {
  color: hsl(var(--muted-foreground));
}

button {
  --ring: var(--primary);
}
</style>
