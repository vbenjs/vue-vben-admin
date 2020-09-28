<template>
  <BasicDrawer v-bind="$attrs" title="Modal Title" width="50%" showFooter>
    <p class="h-20" v-for="index in 20" :key="index">根据屏幕高度自适应</p>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicDrawer } from '/@/components/Drawer';
  export default defineComponent({
    components: { BasicDrawer },
    setup() {
      return {};
    },
  });
</script>
