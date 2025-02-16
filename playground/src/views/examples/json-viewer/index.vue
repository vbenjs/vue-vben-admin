<script lang="ts" setup>
import { JsonViewer, Page } from '@vben/common-ui';

import { Card } from 'ant-design-vue';

import { json1, json2 } from './data';
</script>
<template>
  <Page
    title="Json Viewer"
    description="一个渲染 JSON 结构数据的组件，支持复制、展开等，简单易用"
  >
    <Card title="默认配置">
      <JsonViewer v-model="json1" />
    </Card>
    <Card title="可复制、默认展开3层、显示边框" class="mt-4">
      <JsonViewer
        v-model="json2"
        :expand-depth="3"
        copyable
        :sort="false"
        boxed
      />
    </Card>
  </Page>
</template>
