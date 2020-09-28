<template>
  <template v-for="frame in getFramePages" :key="frame.path">
    <FramePage
      v-if="frame.meta.frameSrc && hasRenderFrame(frame.path)"
      v-show="showIframe(frame)"
      :frameSrc="frame.meta.frameSrc"
    />
  </template>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { useFrameKeepAlive } from './useFrameKeepAlive';
  import FramePage from '/@/views/sys/iframe/index.vue';
  export default defineComponent({
    name: 'FrameLayout',
    components: { FramePage },
    setup() {
      const { hasRenderFrame, showIframe, getFramePages } = useFrameKeepAlive();
      return { hasRenderFrame, showIframe, getFramePages };
    },
  });
</script>
