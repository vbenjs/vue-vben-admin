<script lang="ts" setup>
import { computed, unref } from 'vue'
import { useRootSetting } from '@/hooks/setting/useRootSetting'
import { useMultipleTabSetting } from '@/hooks/setting/useMultipleTabSetting'
import { useMultipleTabStore } from '@/store/multiple-tab'
import FrameLayout from '@/layouts/iframe/index.vue'

const { getShowMultipleTab } = useMultipleTabSetting()
const tabStore = useMultipleTabStore()

const { getOpenKeepAlive, getCanEmbedIFramePage } = useRootSetting()

const openCache = computed(
  () => unref(getOpenKeepAlive) && unref(getShowMultipleTab),
)

const getCaches = computed((): string[] => {
  if (!unref(getOpenKeepAlive)) {
    return []
  }
  return tabStore.getCachedTabList
})
</script>

<template>
  <router-view>
    <template #default="{ Component, route }">
      <transition name="fade-slide" mode="out-in" appear>
        <keep-alive v-if="openCache" :include="getCaches">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
        <component v-else :is="Component" :key="route.fullPath" />
      </transition>
    </template>
  </router-view>
  <frame-layout v-if="getCanEmbedIFramePage" />
</template>
