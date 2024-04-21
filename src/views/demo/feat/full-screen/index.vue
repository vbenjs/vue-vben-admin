<template>
  <PageWrapper title="全屏示例">
    <CollapseContainer class="w-full h-32 bg-white rounded-md" title="Window Full Screen">
      <a-button type="primary" :disabled="isFullscreen" @click="enter" class="mr-2">
        Enter Window Full Screen
      </a-button>
      <a-button color="success" @click="toggle" class="mr-2"> Toggle Window Full Screen </a-button>

      <a-button color="error" @click="exit" class="mr-2"> Exit Window Full Screen </a-button>

      Current State: {{ isFullscreen }}
    </CollapseContainer>

    <CollapseContainer class="w-full mt-5 bg-white rounded-md" title="Dom Full Screen">
      <a-button type="primary" @click="toggleDom" class="mr-2"> Enter Dom Full Screen </a-button>
    </CollapseContainer>

    <div
      ref="domRef"
      class="flex items-center justify-center w-1/2 h-64 mx-auto mt-10 bg-white rounded-md"
    >
      <a-button type="primary" @click="toggleDom" class="mr-2">
        {{ isDomFullscreen ? 'Exit Dom Full Screen' : 'Enter Dom Full Screen' }}
      </a-button>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { CollapseContainer } from '@/components/Container';
  import { useFullscreen } from '@vueuse/core';

  import { PageWrapper } from '@/components/Page';
  import { type Nullable } from '@vben/types';

  const domRef = ref<Nullable<HTMLElement>>(null);

  const { enter, toggle, exit, isFullscreen } = useFullscreen();

  const { toggle: toggleDom, isFullscreen: isDomFullscreen } = useFullscreen(domRef);
</script>
