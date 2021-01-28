<template>
  <PageWrapper
    contentFullHeight
    title="基础组件"
    content=" 基础组件依赖于ant-design-vue,组件库已有的基础组件,项目中不会再次进行demo展示（二次封装组件除外）"
  >
    <template #rightFooter>
      <a-button type="primary"> 确认 </a-button>
    </template>

    <div class="my-2">
      <h3>success</h3>
      <a-button color="success"> 成功 </a-button>
      <a-button color="success" class="ml-2" disabled> 禁用 </a-button>
      <a-button color="success" class="ml-2" loading> loading </a-button>
      <a-button color="success" type="link" class="ml-2"> link </a-button>
      <a-button color="success" type="link" class="ml-2" loading> loading link </a-button>
      <a-button color="success" type="link" class="ml-2" disabled> disabled link </a-button>
    </div>

    <div class="my-2">
      <h3>warning</h3>
      <a-button color="warning"> 警告 </a-button>
      <a-button color="warning" class="ml-2" disabled> 禁用 </a-button>
      <a-button color="warning" class="ml-2" loading> loading </a-button>
      <a-button color="warning" type="link" class="ml-2"> link </a-button>
      <a-button color="warning" type="link" class="ml-2" loading> loading link </a-button>
      <a-button color="warning" type="link" class="ml-2" disabled> disabled link </a-button>
    </div>

    <div class="my-2">
      <h3>error</h3>
      <a-button color="error"> 错误 </a-button>
      <a-button color="error" class="ml-2" disabled> 禁用 </a-button>
      <a-button color="error" class="ml-2" loading> loading </a-button>
      <a-button color="error" type="link" class="ml-2"> link </a-button>
      <a-button color="error" type="link" class="ml-2" loading> loading link </a-button>
      <a-button color="error" type="link" class="ml-2" disabled> disabled link </a-button>
    </div>

    <div class="my-2">
      <h3>ghost</h3>
      <a-button ghost> 幽灵 </a-button>
      <a-button ghost class="ml-2" disabled> 禁用 </a-button>
      <a-button ghost class="ml-2" loading> loading </a-button>
      <a-button ghost type="link" class="ml-2"> link </a-button>
      <a-button ghost type="link" class="ml-2" loading> loading link </a-button>
      <a-button ghost type="link" class="ml-2" disabled> disabled link </a-button>
    </div>

    <div class="my-2">
      <h3>primary</h3>
      <a-button type="primary" preIcon="mdi:page-next-outline"> 主按钮 </a-button>
      <a-button type="primary" class="ml-2" disabled> 禁用 </a-button>
      <a-button type="primary" class="ml-2" loading> loading </a-button>
      <a-button type="link" class="ml-2"> link </a-button>
      <a-button type="link" class="ml-2" loading> loading link </a-button>
      <a-button type="link" class="ml-2" disabled> disabled link </a-button>
    </div>

    <div class="my-2">
      <h3>default</h3>
      <a-button type="default"> 默认 </a-button>
      <a-button type="default" class="ml-2" disabled> 禁用 </a-button>
      <a-button type="default" class="ml-2" loading> loading </a-button>
      <a-button type="link" class="ml-2"> link </a-button>
      <a-button type="link" class="ml-2" loading> loading link </a-button>
      <a-button type="link" class="ml-2" disabled> disabled link </a-button>
    </div>

    <div class="my-2">
      <h3>dashed</h3>
      <a-button type="dashed"> dashed </a-button>
      <a-button type="dashed" class="ml-2" disabled> 禁用 </a-button>
      <a-button type="dashed" class="ml-2" loading> loading </a-button>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  export default defineComponent({
    components: { PageWrapper },
  });
</script>
