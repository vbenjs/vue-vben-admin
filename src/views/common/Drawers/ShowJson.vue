<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="title"
    :width="640"
    destroyOnClose
  >
    <CodeEditor readonly :value="value" :mode="MODE.JSON" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { CodeEditor, MODE } from '@/components/CodeEditor';
  import { ref } from 'vue';

  defineProps({
    title: {
      type: String,
      default: 'JSON查看',
    },
  });

  const value = ref();
  defineEmits(['success', 'register']);

  const [registerDrawer] = useDrawerInner(async (data) => {
    value.value = data;
  });
</script>
