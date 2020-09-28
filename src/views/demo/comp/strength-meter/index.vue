<template>
  <div class="p-4 flex justify-center">
    <div class="w-1/2 bg-white p-10 rounded-md">
      <StrengthMeter placeholder="默认" />
      <StrengthMeter placeholder="禁用" disabled />
      <br />
      <StrengthMeter placeholder="隐藏input" :show-input="false" value="!@#qwe12345" />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import StrengthMeter from '/@/components/StrengthMeter/index';
  export default defineComponent({
    components: {
      StrengthMeter,
    },
    setup() {
      return {};
    },
  });
</script>
