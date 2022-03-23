<template>
  <div class="relative">
    <LayoutHeader />
    <div class="container mx-auto flex flex-row mt-2 sm:mt-6 md:mt-10">
      <SiderMenu class="hidden sm:block" />
      <div class="flex-1">
        <LayoutContent />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import LayoutHeader from './header/index.vue';
  import LayoutContent from './content/index.vue';
  import SiderMenu from './sider-menu/index.vue';

  export default defineComponent({
    name: 'SimpleLayout',
    components: {
      LayoutHeader,
      LayoutContent,
      SiderMenu,
    },
  });
</script>

<style></style>
