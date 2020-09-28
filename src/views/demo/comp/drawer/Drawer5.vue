<template>
  <BasicDrawer v-bind="$attrs" :drawerType="DrawerType.DETAIL" title="Drawer Title5">
    <p class="h-20">Content Message</p>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicDrawer, DrawerType } from '/@/components/Drawer';
  export default defineComponent({
    components: { BasicDrawer },
    setup() {
      return { DrawerType };
    },
  });
</script>
