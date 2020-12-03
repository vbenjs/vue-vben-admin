<template>
  <ParentLayout :isPage="true" />
  <FrameLayout v-if="getCanEmbedIFramePage" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import FrameLayout from '/@/layouts/iframe/index.vue';

  import { useRootSetting } from '/@/hooks/setting/useRootSetting';

  import ParentLayout from '/@/layouts/parent/index.vue';
  export default defineComponent({
    components: { ParentLayout, FrameLayout },
    setup() {
      const { getCanEmbedIFramePage } = useRootSetting();

      return { getCanEmbedIFramePage };
    },
  });
</script>
