<template>
  <PageWrapper title="全屏示例">
    <CollapseContainer class="w-full h-32 bg-white rounded-md" title="Window Full Screen">
      <a-button type="primary" @click="enterFullscreen" class="mr-2">
        Enter Window Full Screen
      </a-button>
      <a-button color="success" @click="toggleFullscreen" class="mr-2">
        Toggle Window Full Screen
      </a-button>

      <a-button color="error" @click="exitFullscreen" class="mr-2">
        Exit Window Full Screen
      </a-button>

      Current State: {{ isFullscreenRef }}
    </CollapseContainer>

    <CollapseContainer class="w-full mt-5 bg-white rounded-md" title="Dom Full Screen">
      <a-button type="primary" @click="toggleDom" class="mr-2"> Enter Dom Full Screen </a-button>
    </CollapseContainer>

    <div
      ref="domRef"
      class="flex items-center justify-center w-1/2 h-64 mx-auto mt-10 bg-white rounded-md"
    >
      <a-button type="primary" @click="toggleDom" class="mr-2"> Exit Dom Full Screen </a-button>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import { useFullscreen } from '/@/hooks/web/useFullScreen';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: { CollapseContainer, PageWrapper },
    setup() {
      const domRef = ref<Nullable<HTMLElement>>(null);
      const {
        enterFullscreen,
        toggleFullscreen,
        isFullscreenRef,
        exitFullscreen,
      } = useFullscreen();

      const { toggleFullscreen: toggleDom } = useFullscreen(domRef);
      return {
        enterFullscreen,
        toggleDom,
        toggleFullscreen,
        isFullscreenRef,
        exitFullscreen,
        domRef,
      };
    },
  });
</script>
