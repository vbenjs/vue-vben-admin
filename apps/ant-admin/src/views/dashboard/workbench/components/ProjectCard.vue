<template>
  <Card title="项目" v-bind="$attrs">
    <template #extra>
      <a-button type="link" size="small">更多</a-button>
    </template>

    <CardGrid v-for="item in items" :key="item" class="!md:w-1/3 !w-full">
      <span class="flex">
        <Icon :icon="item.icon" :color="item.color" size="30" />
        <span class="ml-4 text-lg">{{ item.title }}</span>
      </span>
      <div class="flex h-10 mt-2 text-secondary">{{ item.desc }}</div>
      <div class="flex justify-between text-secondary">
        <span>{{ item.group }}</span>
        <span>{{ item.date }}</span>
      </div>
    </CardGrid>
  </Card>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Card } from 'ant-design-vue'
import { Icon } from '@components/common'
import { groupItems } from './data'

export default defineComponent({
  components: { Card, CardGrid: Card.Grid, Icon },
  setup() {
    return { items: groupItems }
  },
})
</script>
