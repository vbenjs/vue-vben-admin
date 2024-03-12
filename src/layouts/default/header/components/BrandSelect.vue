<template>
  <Dropdown>
    <a class="ant-dropdown-link" @click.prevent>
      Cascading menu
      <DownOutlined />
    </a>
    <template #overlay>
      <Menu>
        <MenuItem>1st menu item</MenuItem>
        <MenuItem>2nd menu item</MenuItem>
      </Menu>
    </template>
  </Dropdown>
</template>
<script lang="ts" setup>
  import { DownOutlined } from '@ant-design/icons-vue';
  import { Dropdown, Menu } from 'ant-design-vue';

  const MenuItem = Menu.Item;
</script>
