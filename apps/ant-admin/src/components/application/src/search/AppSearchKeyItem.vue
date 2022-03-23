<script lang="ts" setup>
import { Icon } from '@components/common'
defineProps({
  icon: String,
})
</script>

<template>
  <span :class="$attrs.class">
    <Icon :icon="icon" />
  </span>
</template>
