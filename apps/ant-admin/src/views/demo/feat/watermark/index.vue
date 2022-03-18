<template>
  <PageWrapper title="水印示例">
    <CollapseContainer
      class="w-full h-32 bg-white rounded-md"
      title="Global WaterMark"
    >
      <a-button
        type="primary"
        class="mr-2"
        @click="setWatermark('WaterMark Info')"
      >
        Create
      </a-button>
      <a-button color="error" class="mr-2" @click="clear"> Clear </a-button>
      <a-button
        color="warning"
        class="mr-2"
        @click="setWatermark('WaterMark Info New')"
      >
        Reset
      </a-button>
    </CollapseContainer>
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { CollapseContainer } from '@/components/container/index'
import { useWatermark } from '@pkg/use'
import { PageWrapper } from '@/components/page'

export default defineComponent({
  components: { CollapseContainer, PageWrapper },
  setup() {
    const areaRef = ref<Nullable<HTMLElement>>(null)
    const { setWatermark, clear } = useWatermark()
    return {
      setWatermark,
      clear,
      areaRef,
    }
  },
})
</script>
