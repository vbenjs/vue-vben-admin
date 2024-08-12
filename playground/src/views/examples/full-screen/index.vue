<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { useFullscreen } from '@vueuse/core';
import { Button, Card } from 'ant-design-vue';

const domRef = ref<HTMLElement>();

const { enter, exit, isFullscreen, toggle } = useFullscreen();

const { isFullscreen: isDomFullscreen, toggle: toggleDom } =
  useFullscreen(domRef);
</script>

<template>
  <Page title="全屏示例">
    <Card class="h-32 w-full rounded-md bg-white" title="Window Full Screen">
      <Button
        :disabled="isFullscreen"
        class="mr-2"
        type="primary"
        @click="enter"
      >
        Enter Window Full Screen
      </Button>
      <Button class="mr-2" @click="toggle"> Toggle Window Full Screen </Button>

      <Button class="mr-2" danger @click="exit">
        Exit Window Full Screen
      </Button>

      Current State: {{ isFullscreen }}
    </Card>

    <Card class="mt-5 w-full rounded-md bg-white" title="Dom Full Screen">
      <Button class="mr-2" type="primary" @click="toggleDom">
        Enter Dom Full Screen
      </Button>
    </Card>

    <div
      ref="domRef"
      class="mx-auto mt-10 flex h-64 w-1/2 items-center justify-center rounded-md bg-white"
    >
      <Button class="mr-2" type="primary" @click="toggleDom">
        {{ isDomFullscreen ? 'Exit Dom Full Screen' : 'Enter Dom Full Screen' }}
      </Button>
    </div>
  </Page>
</template>
