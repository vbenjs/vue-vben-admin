<script lang="tsx">
  import { defineComponent, ref, Ref } from 'compatible-vue';

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
            <a-button class="mr-2" onClick={setWatermark.bind(null, 'test')}>
              设置水印
            </a-button>
            <a-button class="mr-2" onClick={clear}>
              清空水印
            </a-button>
            <a-button class="mr-2" onClick={setWatermark.bind(null, 'test123')}>
              更改水印
            </a-button>
          </CollapseContainer>

          <CollapseContainer title="局部" class="mb-3">
            <a-button class="mr-2" onClick={set.bind(null, 'test')}>
              设置水印
            </a-button>
            <a-button class="mr-2" onClick={clearArea}>
              清空水印
            </a-button>
            <a-button class="mr-2" onClick={set.bind(null, 'test123')}>
              更改水印
            </a-button>
          </CollapseContainer>
        </div>
      );
    },
  });
</script>
