<template>
  <BasicDrawer v-bind="$attrs" @register="register" title="Drawer Title" width="50%">
    <p class="h-20">外部传递数据: {{ receiveDrawerDataRef }}</p>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  export default defineComponent({
    components: { BasicDrawer },
    setup() {
      const [register, { receiveDrawerDataRef }] = useDrawerInner();
      return { register, receiveDrawerDataRef };
    },
  });
</script>
