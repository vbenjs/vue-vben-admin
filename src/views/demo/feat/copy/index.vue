<template>
  <PageWrapper title="文本复制示例">
    <CollapseContainer class="w-full h-32 bg-white rounded-md" title="Copy Example">
      <div class="flex justify-center">
        <a-input placeholder="请输入" v-model:value="valueRef" />
        <a-button type="primary" @click="handleCopy"> Copy </a-button>
      </div>
    </CollapseContainer>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { unref, ref } from 'vue';
  import { CollapseContainer } from '@/components/Container';
  import { useMessage } from '@/hooks/web/useMessage';
  import { PageWrapper } from '@/components/Page';
  import { copyText } from '@/utils/copyTextToClipboard';

  const valueRef = ref('');
  const { createMessage } = useMessage();

  function handleCopy() {
    const value = unref(valueRef);
    if (!value) {
      createMessage.warning('请输入要拷贝的内容！');
      return;
    }
    copyText(value);
  }
</script>
