<script lang="ts" setup>
import type { FlattenedItem } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { ref, watch } from 'vue';

import { Page, VbenTree } from '@vben/common-ui';

import { Card, message } from 'ant-design-vue';

import { data } from './data';

function getNodeClass(node: FlattenedItem<Recordable<any>>) {
  const classes: string[] = [];
  if (node.hasChildren) {
    classes.push('col-span-3');
  } else {
    classes.push('inline-flex col-span-1 flex-nowarp  text-nowrap');
    if (node.index % 3 >= 1) {
      classes.push('!pl-0');
    }
  }

  return classes.join(' ');
}
const selected = ref();
const checked = ref(['2']);
watch(selected, (val) => {
  message.info(`已选择的项目：${val}`);
});

watch(checked, (val) => {
  message.info(`已选择的项目：${JSON.stringify(val)}`);
});
</script>
<template>
  <Page title="Tree">
    <Card title="基础树">
      <VbenTree
        :tree-data="data"
        v-model="selected"
        bordered
        transition
        :default-expanded-level="0"
      />
    </Card>
    <Card title="选择框 + 自定义布局" class="mt-4">
      <VbenTree
        v-model="checked"
        class="grid w-[600px] grid-cols-3"
        :tree-data="data"
        :get-node-class="getNodeClass"
        transition
        :multiple="true"
      />
    </Card>
  </Page>
</template>
