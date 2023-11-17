<template>
  <PageWrapper title="密码强度校验组件">
    <div class="flex justify-center">
      <div class="demo-wrap p-10">
        <StrengthMeter placeholder="默认" />
        <StrengthMeter placeholder="禁用" disabled />
        <br />
        <StrengthMeter placeholder="隐藏input" :show-input="false" value="!@#qwe12345" />
      </div>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { StrengthMeter } from '@/components/StrengthMeter';
  import { PageWrapper } from '@/components/Page';
</script>
<style lang="less" scoped>
  .demo-wrap {
    width: 50%;
    border-radius: 10px;
    background-color: @component-background;
  }
</style>
