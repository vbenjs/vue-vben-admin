<template>
  <div @click="openDrawer(true)">
    <Icon icon="ion:settings-outline" />
    <SettingDrawer @register="register" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import SettingDrawer from './SettingDrawer'
import { Icon } from '@components/common'

import { useDrawer } from '@/components/drawer'

export default defineComponent({
  name: 'SettingButton',
  components: { SettingDrawer, Icon },
  setup() {
    const [register, { openDrawer }] = useDrawer()

    return {
      register,
      openDrawer,
    }
  },
})
</script>
