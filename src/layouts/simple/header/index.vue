<template>
  <div>
    <div class="header h-15 sm:h-20 px-3 sm:px-20">
      <Logo />
      <div class="flex-1"></div>
      <UserDropDown class="hidden md:block" />
      <MenuDrawer class="sm:hidden" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Logo from './components/logo/index.vue';
  import UserDropDown from './components/user-dropdown/index.vue';
  import MenuDrawer from './components/menu-drawer/index.vue';
</script>

<style lang="less" scope>
  .header {
    background-color: @primary-color;
    color: #fff;
    display: flex;
    align-items: center;
  }
</style>
