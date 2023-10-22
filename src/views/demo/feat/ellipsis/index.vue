<template>
  <PageWrapper title="文本省略示例">
    <CollapseContainer class="w-full bg-white rounded-md mb-4" title="Ellipsis 基本使用">
      <EllipsisText :maxWidth="240">{{ text }}</EllipsisText>
    </CollapseContainer>
    <CollapseContainer class="w-full bg-white rounded-md mb-4" title="Ellipsis 多行省略">
      <EllipsisText :line="2">{{ text }}</EllipsisText>
    </CollapseContainer>
    <CollapseContainer class="w-full bg-white rounded-md mb-4" title="Ellipsis 点击展开">
      <EllipsisText expand :line="3">{{ text }}</EllipsisText>
    </CollapseContainer>
    <CollapseContainer class="w-full bg-white rounded-md mb-4" title="Ellipsis 定制 Tooltip 内容">
      <EllipsisText :max-width="240">
        住在我心里孤独的 孤独的海怪 痛苦之王 开始厌倦 深海的光 停滞的海浪
        <template #tooltip>
          <div style="text-align: center">
            《秦皇岛》<br />住在我心里孤独的<br />孤独的海怪 痛苦之王<br />开始厌倦 深海的光
            停滞的海浪
          </div>
        </template>
      </EllipsisText>
    </CollapseContainer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import { PageWrapper } from '/@/components/Page';
  import { EllipsisText } from '@/components/EllipsisText';

  export default defineComponent({
    name: 'Ellipsis',
    components: { CollapseContainer, PageWrapper, EllipsisText },
    setup() {
      const text =
        ref(`Vue-Vben-Admin 是一个基于 Vue3.0、Vite、 Ant-Design-Vue、TypeScript 的后台解决方案，目标是为开发中大型项目提供开箱即用的解决方案。
      包括二次封装组件、utils、hooks、动态菜单、权限校验、按钮级别权限控制等功能。项目会使用前端较新的技术栈，可以作为项目的启动模版，以帮助你快速搭建企业级中后台产品原型。
      也可以作为一个示例，用于学习 vue3、vite、ts 等主流技术。该项目会持续跟进最新技术，并将其应用在项目中。Vue-Vben-Admin 是一个基于 Vue3.0、Vite、 Ant-Design-Vue、TypeScript 的后台解决方案，目标是为开发中大型项目提供开箱即用的解决方案。
      包括二次封装组件、utils、hooks、动态菜单、权限校验、按钮级别权限控制等功能。项目会使用前端较新的技术栈，可以作为项目的启动模版，以帮助你快速搭建企业级中后台产品原型。
      也可以作为一个示例，用于学习 vue3、vite、ts 等主流技术。该项目会持续跟进最新技术，并将其应用在项目中。Vue-Vben-Admin 是一个基于 Vue3.0、Vite、 Ant-Design-Vue、TypeScript 的后台解决方案，目标是为开发中大型项目提供开箱即用的解决方案。
      包括二次封装组件、utils、hooks、动态菜单、权限校验、按钮级别权限控制等功能。项目会使用前端较新的技术栈，可以作为项目的启动模版，以帮助你快速搭建企业级中后台产品原型。
      也可以作为一个示例，用于学习 vue3、vite、ts 等主流技术。该项目会持续跟进最新技术，并将其应用在项目中。`);

      return { text };
    },
  });
</script>
