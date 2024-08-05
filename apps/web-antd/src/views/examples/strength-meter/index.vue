<script setup lang="ts">
import StrengthMeter from '#/components/StrengthMeter.vue';
</script>

<template>
  <div class="flex justify-center">
    <div class="demo-wrap p-10">
      <StrengthMeter placeholder="默认" />
      <StrengthMeter disabled placeholder="禁用" />
      <br />
      <StrengthMeter
        :show-input="false"
        placeholder="隐藏input"
        value="!@#qwe12345"
      />
    </div>
  </div>
</template>

<style scoped>
.demo-wrap {
  width: 50%;
  background-color: @component-background;
  border-radius: 10px;
}
</style>
