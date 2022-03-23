<template>
  <div class="md:flex">
    <template v-for="(item, index) in growCardList" :key="item.title">
      <Card
        size="small"
        :loading="loading"
        :title="item.title"
        class="md:w-1/4 w-full !md:mt-0"
        :class="{ 'md:!mr-4': index + 1 < 4, '': index > 0 }"
      >
        <template #extra>
          <Tag :color="item.color">{{ item.action }}</Tag>
        </template>

        <div class="flex items-center justify-between px-4 py-4">
          <CountTo
            prefix="$"
            :startVal="1"
            :endVal="item.value"
            class="text-2xl"
          />
          <Icon :icon="item.icon" :size="40" />
        </div>

        <div class="flex justify-between p-2 px-4">
          <span>总{{ item.title }}</span>
          <CountTo prefix="$" :startVal="1" :endVal="item.total" />
        </div>
      </Card>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { CountTo } from '@components/common'
import { Icon } from '@components/common'
import { Tag, Card } from 'ant-design-vue'
import { growCardList } from '../data'

defineProps({
  loading: {
    type: Boolean,
  },
})
</script>
