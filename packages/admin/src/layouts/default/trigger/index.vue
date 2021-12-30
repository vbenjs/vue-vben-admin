<template>
  <SiderTrigger v-if="sider" />
  <HeaderTrigger v-else :theme="theme" />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent'
import HeaderTrigger from './HeaderTrigger.vue'

export default defineComponent({
  name: 'LayoutTrigger',
  components: {
    SiderTrigger: createAsyncComponent(() => import('./SiderTrigger.vue')),
    HeaderTrigger: HeaderTrigger,
  },
  props: {
    sider: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      validator: (v: string) => ['dark', 'light'].includes(v),
    },
  },
})
</script>
