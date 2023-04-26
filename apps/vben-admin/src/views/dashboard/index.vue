<script lang="ts" setup>
  import { VbenAdminLayout } from '@vben/layout';
  import { Checkbox, InputNumber, Radio, RadioGroup } from 'ant-design-vue';
  import { reactive } from 'vue';

  defineOptions({
    name: 'Dashboard',
  });

  const model = reactive({
    sideWidth: 200,
    siderCollapse: false,
    layout: 'side-nav',
    sideMixedExtraVisible: false,
    fixedMixedExtra: false,
    isMobile: false,
  });
</script>

<template>
  <VbenAdminLayout
    :sideWidth="model.sideWidth"
    :layout="model.layout"
    :fixedMixedExtra="model.fixedMixedExtra"
    :isMobile="model.isMobile"
    v-model:side-collapse="model.siderCollapse"
    v-model:mixed-extra-visible="model.sideMixedExtraVisible"
  >
    <template #side>
      <div>side</div>
    </template>
    <template #side-extra>side-extra</template>
    <template #header>header</template>
    <template #footer>footer</template>
    <template #content>
      <div>
        <div>左侧菜单宽度</div>
        <InputNumber v-model:value="model.sideWidth" />
        <Checkbox v-model:checked="model.siderCollapse" class="mx-5">折叠菜单</Checkbox>

        <Checkbox v-model:checked="model.sideMixedExtraVisible" class="mx-5">打开扩展菜单</Checkbox>
        <Checkbox v-model:checked="model.fixedMixedExtra" class="mx-5">固定扩展菜单</Checkbox>
        <Checkbox v-model:checked="model.isMobile" class="mx-5">isMobile</Checkbox>
        <hr />
        <div>切换布局</div>
        <RadioGroup v-model:value="model.layout">
          <Radio.Button value="side-nav">side-nav</Radio.Button>
          <Radio.Button value="header-nav">header-nav</Radio.Button>
          <Radio.Button value="mixed-nav">mixed-nav</Radio.Button>
          <Radio.Button value="side-mixed-nav">side-mixed-nav</Radio.Button>
          <Radio.Button value="full-content">full-content</Radio.Button>
        </RadioGroup>
        <hr />
      </div>
    </template>
  </VbenAdminLayout>
</template>
