<template>
  <transition name="fade-bottom" mode="out-in">
    <lock-page v-if="getIsLock" />
  </transition>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import LockPage from './LockPage.vue'
import { useLockStore } from '@/store/lock'

const lockStore = useLockStore()
const getIsLock = computed(() => lockStore?.getLockInfo?.isLock ?? false)
</script>
