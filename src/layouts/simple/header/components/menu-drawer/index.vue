<template>
  <div>
    <Icon :size="28" icon="ant-design:more-outlined" @click="onToggle" />
    <Drawer v-model:visible="visible" width="280">
      <Menus :onClose="onToggle" />
    </Drawer>
  </div>
</template>

<script setup lang="ts">
  import { Drawer } from 'ant-design-vue';
  import { ref } from 'vue';
  import Icon from '/@/components/Icon';
  import Menus from '../menus/index.vue';

  const visible = ref(false);

  function onToggle() {
    visible.value = !visible.value;
  }
</script>

<style></style>
