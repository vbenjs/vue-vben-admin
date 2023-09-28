<template>
  <PageWrapper title="水印示例">
    <CollapseContainer class="w-full h-32 bg-white rounded-md" title="Global WaterMark">
      <a-button type="primary" class="mr-2" @click="setWatermark('WaterMark Info1')">
        Create Watermark1
      </a-button>
      <a-button type="primary" class="mr-2" @click="setWatermark2('WaterMark Info2')">
        Create Watermark2
      </a-button>
      <a-button color="error" class="mr-2" @click="clear"> Clear Watermark1 </a-button>
      <a-button color="error" class="mr-2" @click="clearAll"> ClearAll </a-button>
      <a-button color="warning" class="mr-2" @click="setWatermark('WaterMark Info New')">
        Update Watermark1
      </a-button>
    </CollapseContainer>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onUnmounted } from 'vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import { useWatermark } from '/@/hooks/web/useWatermark';
  import { PageWrapper } from '/@/components/Page';

  const { setWatermark, clear, clearAll } = useWatermark();
  const { setWatermark: setWatermark2 } = useWatermark();

  onUnmounted(() => {
    clearAll();
  });
</script>
