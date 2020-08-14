<template>
  <div class="p-4">
    <div style="width: 400px;">
      <StrengthMeter placeholder="默认" />
      <StrengthMeter placeholder="禁用" disabled />

      <br />
      <StrengthMeter placeholder="隐藏input" :show-input="false" value="!@#qwe12345" />
    </div>
  </div>
</template>

<script lang="tsx">
  import { defineComponent } from 'compatible-vue';
  import { StrengthMeter } from '@/components/strength-meter/index';
  export default defineComponent({
    name: 'StrengthMeterDemo',
    components: {
      StrengthMeter,
    },
    setup() {
      return {};
    },
  });
</script>
