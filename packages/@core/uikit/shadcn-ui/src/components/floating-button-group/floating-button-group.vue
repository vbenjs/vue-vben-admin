<script setup lang="ts">
import { ref } from 'vue';

const isMenuOpen = ref(false);
const menuItems = ref(['1', '2', '3', '4']);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleMenuItemClick = (_item: any) => {
  // console.log(111, item);
};
</script>

<template>
  <div class="fixed bottom-5 right-5 flex flex-col-reverse items-center gap-2">
    <button
      :class="{ 'rotate-45': isMenuOpen }"
      class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-xl text-white transition-transform duration-300"
      @click="toggleMenu"
    >
      ✖
    </button>
    <div
      :class="{
        'visible translate-y-0 opacity-100': isMenuOpen,
        'invisible translate-y-2 opacity-0': !isMenuOpen,
      }"
      class="absolute bottom-16 right-0 flex flex-col-reverse gap-2 transition-all duration-300"
    >
      <button
        v-for="(item, index) in menuItems"
        :key="index"
        class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-xl text-white"
        @click="handleMenuItemClick(item)"
      >
        {{ item }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 可以在这里添加任何需要的额外样式 */
</style>
