<script lang="tsx">
  import { defineComponent, unref } from 'compatible-vue';
  import { Input } from 'ant-design-vue';
  import { CollapseContainer } from '@/components/container/index';

  import { useCopyToClipboard } from '@/hooks/event/useCopyToClipboard';
  import { useMessage } from '@/hooks/core/useMessage';
  export default defineComponent({
    name: 'CopyPlugin',
    setup() {
      const { createMessage } = useMessage();

      function handleCopy(val: string) {
        if (!val) {
          createMessage.warning('请输入要拷贝的内容！');
          return;
        }
        const { isSuccessRef } = useCopyToClipboard(val);
        if (unref(isSuccessRef)) {
          createMessage.warning('copy success！');
        }
      }
      return () => (
        <CollapseContainer title="Copy Example" class="mb-3">
          <Input.Search enterButton="Copy" onSearch={handleCopy} />
        </CollapseContainer>
      );
    },
  });
</script>
