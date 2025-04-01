<script lang="ts" setup>
import { alert, prompt, VbenButton } from '@vben/common-ui';

import { VbenSelect } from '@vben-core/shadcn-ui';

function showPrompt() {
  prompt({
    content: '请输入一些东西',
  })
    .then((val) => {
      alert(`已收到你的输入：${val}`);
    })
    .catch(() => {
      alert('Canceled');
    });
}

function showSelectPrompt() {
  prompt({
    component: VbenSelect,
    componentProps: {
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ],
      placeholder: '请选择',
    },
    content: 'This is an alert message with icon',
    icon: 'question',
  }).then((val) => {
    alert(`你选择的是${val}`);
  });
}
</script>
<template>
  <div class="flex gap-4">
    <VbenButton @click="showPrompt">Prompt</VbenButton>
    <VbenButton @click="showSelectPrompt">Confirm With Select</VbenButton>
  </div>
</template>
