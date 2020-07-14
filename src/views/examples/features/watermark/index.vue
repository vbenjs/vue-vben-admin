<script lang="tsx">
  import { defineComponent, ref, Ref } from 'compatible-vue';
  import { Button } from 'ant-design-vue';
  import { CollapseContainer } from '@/components/container/index';

  import { useWatermark } from '@/hooks/functions/useWatermark';
  export default defineComponent({
    name: 'Watermark',
    setup() {
      const wrapRef = ref<HTMLElement | null>(null);
      const { setWatermark, clear } = useWatermark();
      const { setWatermark: set, clear: clearArea } = useWatermark(wrapRef as Ref<HTMLElement>);

      return () => (
        <div ref={wrapRef} class="p-4" style={{ height: '300px' }}>
          <CollapseContainer title="全局" class="mb-3">
            <Button class="mr-2" onClick={setWatermark.bind(null, 'vben')}>
              设置水印
            </Button>
            <Button class="mr-2" onClick={clear}>
              清空水印
            </Button>
            <Button class="mr-2" onClick={setWatermark.bind(null, 'vben123')}>
              更改水印
            </Button>
          </CollapseContainer>

          <CollapseContainer title="局部" class="mb-3">
            <Button class="mr-2" onClick={set.bind(null, 'vben')}>
              设置水印
            </Button>
            <Button class="mr-2" onClick={clearArea}>
              清空水印
            </Button>
            <Button class="mr-2" onClick={set.bind(null, 'vben123')}>
              更改水印
            </Button>
          </CollapseContainer>
        </div>
      );
    },
  });
</script>
