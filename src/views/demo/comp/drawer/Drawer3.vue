<template>
  <BasicDrawer v-bind="$attrs" title="Modal Title" width="50%" showFooter @ok="handleOk">
    <p class="h-20" v-for="index in 40" :key="index">根据屏幕高度自适应</p>
    <template #insertFooter>
      <a-button> btn</a-button>
    </template>
    <template #centerFooter>
      <a-button> btn2</a-button>
    </template>

    <template #appendFooter>
      <a-button> btn3</a-button>
    </template>

    <!-- <template #footer>
      <a-button> customerFooter</a-button>
    </template> -->
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { BasicDrawer } from '@/components/Drawer';

  function handleOk() {
    console.log('=====================');
    console.log('ok');
    console.log('======================');
  }
</script>
