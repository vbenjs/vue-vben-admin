<script lang="ts" setup>
import { ref } from 'vue';

import { Collapse, CollapsePanel } from 'ant-design-vue';

import EllipsisText from '#/components/EllipsisText/index.vue';

const text = ref(
  `
    Vben Admin 是一个基于 Vue3.0、Vite、 TypeScript 的后台解决方案，目标是为开发中大型项目提供开箱即用的解决方案。包括二次封装组件、utils、hooks、动态菜单、权限校验、多主题配置、按钮级别权限控制等功能。项目会使用前端较新的技术栈，可以作为项目的启动模版，以帮助你快速搭建企业级中后台产品原型。也可以作为一个示例，用于学习 vue3、vite、ts 等主流技术。该项目会持续跟进最新技术，并将其应用在项目中。Vben Admin 是一个基于 Vue3.0、Vite、 TypeScript 的后台解决方案，目标是为开发中大型项目提供开箱即用的解决方案。包括二次封装组件、utils、hooks、动态菜单、权限校验、多主题配置、按钮级别权限控制等功能。项目会使用前端较新的技术栈，可以作为项目的启动模版，以帮助你快速搭建企业级中后台产品原型。也可以作为一个示例，用于学习 vue3、vite、ts 等主流技术。该项目会持续跟进最新技术，并将其应用在项目中。Vben Admin 是一个基于 Vue3.0、Vite、 TypeScript 的后台解决方案，目标是为开发中大型项目提供开箱即用的解决方案。包括二次封装组件、utils、hooks、动态菜单、权限校验、多主题配置、按钮级别权限控制等功能。项目会使用前端较新的技术栈，可以作为项目的启动模版，以帮助你快速搭建企业级中后台产品原型。也可以作为一个示例，用于学习 vue3、vite、ts 等主流技术。该项目会持续跟进最新技术，并将其应用在项目中。Vben Admin 是一个基于 Vue3.0、Vite、 TypeScript 的后台解决方案，目标是为开发中大型项目提供开箱即用的解决方案。包括二次封装组件、utils、hooks、动态菜单、权限校验、多主题配置、按钮级别权限控制等功能。项目会使用前端较新的技术栈，可以作为项目的启动模版，以帮助你快速搭建企业级中后台产品原型。也可以作为一个示例，用于学习 vue3、vite、ts 等主流技术。该项目会持续跟进最新技术，并将其应用在项目中。
   `,
);
const activeKey = ref(['1', '2', '3', '4']);
</script>

<template>
  <div class="card-box p-5">
    <h1 class="mb-5 text-xl font-semibold">文本省略示例</h1>
    <div>
      <Collapse v-model:activeKey="activeKey">
        <CollapsePanel key="1" header="Ellipsis 基本使用">
          <EllipsisText :max-width="240">{{ text }}</EllipsisText>
        </CollapsePanel>
        <CollapsePanel key="2" header="Ellipsis 多行省略">
          <EllipsisText :line="2">{{ text }}</EllipsisText>
        </CollapsePanel>
        <CollapsePanel key="3" header="Ellipsis 点击展开">
          <EllipsisText :line="3" expand>{{ text }}</EllipsisText>
        </CollapsePanel>
        <CollapsePanel key="4" header="Ellipsis 定制 Tooltip 内容">
          <EllipsisText :max-width="240">
            住在我心里孤独的 孤独的海怪 痛苦之王 开始厌倦 深海的光 停滞的海浪
            <template #tooltip>
              <div style="text-align: center">
                《秦皇岛》<br />住在我心里孤独的<br />孤独的海怪 痛苦之王<br />开始厌倦
                深海的光 停滞的海浪
              </div>
            </template>
          </EllipsisText>
        </CollapsePanel>
      </Collapse>
    </div>
  </div>
</template>
