<script setup lang="ts">
import type { AboutProps, DescriptionItem } from './about';

import { h } from 'vue';

import { VbenLink, VbenRenderContent } from '@vben-core/shadcn-ui';

interface Props extends AboutProps {}

defineOptions({
  name: 'AboutUI',
});

withDefaults(defineProps<Props>(), {
  description:
    '是一个基于Vue3.0、Vite 、TypeScript 等前沿技术的后台解决方案，目标是为服务中大型项目开发，提供现成的开箱解决方案及丰富的示例。',
  name: 'Vben Admin Pro',
  title: '关于我们',
});

const {
  authorEmail,
  authorName,
  authorUrl,
  buildTime,
  dependencies = {},
  devDependencies = {},
  homepage,
  license,
  repositoryUrl,
  version,
} = window.__VBEN_ADMIN_METADATA__ || {};

const vbenDescriptionItems: DescriptionItem[] = [
  {
    content: version,
    title: '版本号',
  },
  {
    content: license,
    title: '开源许可协议',
  },
  {
    content: buildTime,
    title: '最后构建时间',
  },
  {
    // TODO:
    content: h(VbenLink, { href: homepage }, { default: () => '点击查看' }),
    title: '主页',
  },
  {
    // TODO:
    content: h(
      VbenLink,
      { href: repositoryUrl },
      { default: () => '点击查看' },
    ),
    title: '文档地址',
  },
  {
    // TODO:
    content: h(
      VbenLink,
      { href: repositoryUrl },
      { default: () => '点击查看' },
    ),
    title: '预览地址',
  },
  {
    content: h(
      VbenLink,
      { href: repositoryUrl },
      { default: () => '点击查看' },
    ),
    title: 'Github',
  },
  {
    content: h('div', [
      h(
        VbenLink,
        { class: 'mr-2', href: authorUrl },
        { default: () => authorName },
      ),
      h(
        VbenLink,
        { href: `mailto:${authorEmail}` },
        { default: () => authorEmail },
      ),
    ]),
    title: '作者',
  },
];

const dependenciesItems = Object.keys(dependencies).map((key) => ({
  content: dependencies[key],
  title: key,
}));

const devDependenciesItems = Object.keys(devDependencies).map((key) => ({
  content: devDependencies[key],
  title: key,
}));
</script>

<template>
  <div class="m-5">
    <div class="bg-card rounded-md p-5">
      <div>
        <h3 class="text-foreground text-2xl font-semibold leading-7">
          {{ title }}
        </h3>
        <p class="text-foreground/80 mt-3 text-sm leading-6">
          <VbenLink :href="repositoryUrl">
            {{ name }}
          </VbenLink>
          {{ description }}
        </p>
      </div>
      <div class="mt-4">
        <dl class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <template v-for="item in vbenDescriptionItems" :key="item.title">
            <div class="border-border border-t px-4 py-6 sm:col-span-1 sm:px-0">
              <dt class="text-foreground text-sm font-medium leading-6">
                {{ item.title }}
              </dt>
              <dd class="text-foreground/80 mt-1 text-sm leading-6 sm:mt-2">
                <VbenRenderContent :content="item.content" />
              </dd>
            </div>
          </template>
        </dl>
      </div>
    </div>

    <div class="bg-card mt-6 rounded-md p-5">
      <div>
        <h5 class="text-foreground text-lg">生产环境依赖</h5>
      </div>
      <div class="mt-4">
        <dl class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <template v-for="item in dependenciesItems" :key="item.title">
            <div class="border-border border-t px-4 py-3 sm:col-span-1 sm:px-0">
              <dt class="text-foreground text-sm">
                {{ item.title }}
              </dt>
              <dd class="text-foreground/60 mt-1 text-sm sm:mt-2">
                <VbenRenderContent :content="item.content" />
              </dd>
            </div>
          </template>
        </dl>
      </div>
    </div>

    <div class="bg-card mt-6 rounded-md p-5">
      <div>
        <h5 class="text-foreground text-lg">开发环境依赖</h5>
      </div>
      <div class="mt-4">
        <dl class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <template v-for="item in devDependenciesItems" :key="item.title">
            <div class="border-border border-t px-4 py-3 sm:col-span-1 sm:px-0">
              <dt class="text-foreground text-sm">
                {{ item.title }}
              </dt>
              <dd class="text-foreground/60 mt-1 text-sm sm:mt-2">
                <VbenRenderContent :content="item.content" />
              </dd>
            </div>
          </template>
        </dl>
      </div>
    </div>
  </div>
</template>
