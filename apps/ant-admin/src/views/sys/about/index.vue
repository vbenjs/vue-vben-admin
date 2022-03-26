<script lang="ts" setup>
import { h } from 'vue'
import { Tag } from 'ant-design-vue'
import { PageWrapper } from '@/components/page'
import {
  Description,
  DescItem,
  useDescription,
} from '@/components/description/index'
import { GITHUB_URL, SITE_URL, DOC_URL } from '@pkg/setting'

const { pkg, lastBuildTime } = __APP_INFO__
const { dependencies, devDependencies, name, version } = pkg
const schema: DescItem[] = []
const devSchema: DescItem[] = []

const commonTagRender = (color: string) => (curVal) =>
  h(Tag, { color }, () => curVal)

const commonLinkRender = (text: string) => (href) =>
  h('a', { href, target: '_blank' }, text)

const infoSchema: DescItem[] = [
  {
    label: '版本',
    field: 'version',
    render: commonTagRender('blue'),
  },
  {
    label: '最后编译时间',
    field: 'lastBuildTime',
    render: commonTagRender('blue'),
  },
  {
    label: '文档地址',
    field: 'doc',
    render: commonLinkRender('文档地址'),
  },
  {
    label: '预览地址',
    field: 'preview',
    render: commonLinkRender('预览地址'),
  },
  {
    label: 'Github',
    field: 'github',
    render: commonLinkRender('Github'),
  },
]

const infoData = {
  version,
  lastBuildTime,
  doc: DOC_URL,
  preview: SITE_URL,
  github: GITHUB_URL,
}

Object.keys(dependencies).forEach((key) => {
  schema.push({ field: key, label: key })
})

Object.keys(devDependencies).forEach((key) => {
  devSchema.push({ field: key, label: key })
})

const [register] = useDescription({
  title: '生产环境依赖',
  data: dependencies,
  schema: schema,
  column: 3,
})

const [registerDev] = useDescription({
  title: '开发环境依赖',
  data: devDependencies,
  schema: devSchema,
  column: 3,
})

const [infoRegister] = useDescription({
  title: '项目信息',
  data: infoData,
  schema: infoSchema,
  column: 2,
})
</script>

<template>
  <page-wrapper title="关于">
    <template #headerContent>
      <div class="flex items-center justify-between">
        <span class="flex-1">
          <a :href="GITHUB_URL" target="_blank">{{ name }}</a>
          是一个基于Vue3.0、Vite、 Ant-Design-Vue 、TypeScript
          的后台解决方案，目标是为中大型项目开发,提供现成的开箱解决方案及丰富的示例,原则上不会限制任何代码用于商用。
        </span>
      </div>
    </template>

    <description @register="infoRegister" class="enter-y" />
    <description @register="register" class="my-4 enter-y" />
    <description @register="registerDev" class="enter-y" />
  </page-wrapper>
</template>
