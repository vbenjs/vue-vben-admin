<template>
  <PageWrapper title="文本复制示例">
    <CollapseContainer class="w-full h-32 bg-white rounded-md" title="Copy Example">
      <div class="flex justify-center">
        <a-input placeholder="请输入" v-model:value="value" />
        <a-button type="primary" @click="handleCopy"> Copy </a-button>
      </div>
    </CollapseContainer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, unref, ref } from 'vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PageWrapper } from '/@/components/Page';
  import { copyText } from '/@/utils/copyTextToClipboard';

  export default defineComponent({
    name: 'Copy',
    components: { CollapseContainer, PageWrapper },
    setup() {
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
      return { handleCopy, value: valueRef };
    },
  });
</script>
